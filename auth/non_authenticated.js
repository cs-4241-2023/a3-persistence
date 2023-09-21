const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const { client } = require('../mongoDB/mongodb');
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');

// create db from client
const usersDB = client.db("Users");

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(
    new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
        // look up git user in db
        async (_accessToken, _refreshToken, profile, done) => {
            const user = await usersDB.collection('data').findOne({
                username: profile.id,
            });

            if (!user) {
                console.log("Adding new github user to the database");
                // create the user here
                const gitUser = new UserModel({
                    username: profile.id,
                    email: profile.username,
                    password: "null: github user",
                });
                // save the user to the db
                usersDB.collection("data").insertOne(gitUser);
                return done(null, profile);
            } else {
                console.log("Git user already exists in the DB");
                return done(null, profile);
            }
        }
    ));

router.get('/auth/github/',
    passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        req.session.login = true;
        req.session.user = "Github: " + req.user.username;
        res.redirect('/');
    });

router.get("/", (req, res) => {
    if (req.session.login === true) {
        res.redirect("/home")
    } else {
        res.redirect("/login")
    }
});

router.get("/home", (req, res) => {
    if (req.session.login === true) {
        res.render("index.ejs");
    } else {
        res.redirect("/login")
    }
})

router.get("/login", (req, res) => {
    if (req.session.login === undefined || req.session.login === false) {
        res.render("login.ejs", { error: "" });
    } else {
        res.redirect("/home")
    }
});

router.post("/login", async (req, res) => {
    const userEmail = req.body.email;

    const findUser = await usersDB.collection('data').findOne({ email: userEmail });

    console.log("User found");
    console.log(findUser);

    if (findUser !== null) {
        // grab user hash pass and match it with req.body.pass
        const inputtedPass = req.body.password;

        console.log("Inputted pass");
        console.log(inputtedPass);

        const passOnDb = findUser['password'];

        console.log("pass on db");
        console.log(passOnDb);

        bcrypt.compare(inputtedPass, passOnDb, (err, result) => {
            if (err) {
                throw err;
            }
            if (result) {
                req.session.login = true;
                req.session.user = findUser['email'].toLowerCase();
                res.redirect("/home");
            } else {
                res.render("login.ejs", {
                    error: "Incorrect username or password",
                });
                console.log("Incorrect username or password");
            }
        });

    } else {
        res.render("login.ejs", { error: "Incorrect username or password" });
    }

});

router.get("/register", (_, res) => {
    res.render("register.ejs", { error: "" });
});

router.post("/register", async (req, res) => {

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const formUser = new UserModel({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    })

    // Only add user if a they don't exist
    const findUser = await usersDB.collection('data').findOne({ email: req.body.email });

    if (findUser !== null) {
        res.render("register.ejs", { error: "Account with email entered is already registered! Please use a different email address." });
    } else {
        console.log("Registering the following user");

        usersDB.collection("data").insertOne(formUser);
        req.session.user = formUser['email'].toLowerCase();
        console.log("User has been added")
        res.redirect("/login");
    }
})

module.exports = router;