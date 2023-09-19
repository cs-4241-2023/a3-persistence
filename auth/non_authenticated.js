const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@vehicleservicelogcluste.no66rrt.mongodb.net/VSL-DB?retryWrites=true&w=majority`;
const UserModel = require('../models/user');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Connect to DB 
client.connect().then(() => {
    console.log("Successfully connected to the DB");
})

// create db from client
const usersDB = client.db("Users");

router.get("/", (req, res) => {
    if (req.session.login === true) {
        res.redirect("/home")
    } else {
        res.redirect("/login")
    }
});

router.get("/home", (req, res) => {
    res.render("index.ejs");
})

router.get("/login", (_, res) => {
    res.render("login.ejs", { error: "" });
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
                res.redirect("/");
            } else {
                res.render("login.ejs", {
                    error: "Incorrect username or password",
                });
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

    // potentially render invalid email address error here

    // Only add user if a they don't exist
    const findUser = await usersDB.collection('data').findOne({ email: req.body.email });

    if (findUser !== null) {
        res.render("register.ejs", { error: "Account with email entered is already registered! Please use a different email address." });
    } else {
        console.log("Registering the following user");

        usersDB.collection("data").insertOne(formUser);
        req.session.user = formUser['email'].toLowerCase();
        console.log("User has been added")
        res.redirect("/");
    }

})

module.exports = router;