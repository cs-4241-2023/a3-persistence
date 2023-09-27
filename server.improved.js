const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./user");

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const presentSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const Present = mongoose.model("Present", presentSchema);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

app.use(
  session({
    secret: "ballislife",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static("public"));
app.use(express.json());

app.post("/register", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.error("Error registering user:", err);
        return res.status(500).send("Error registering user");
      }
      passport.authenticate("local")(req, res, () => {
        res.sendStatus(200);
      });
    }
  );
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

app.get("/dashboard", ensureAuthenticated, (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.redirect("/login");
  }
  res.render("dashboard", { user: req.user });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.post("/add-present", ensureAuthenticated, (req, res) => {
  const data = req.body;
  const userId = req.user.id;

  const newPresent = new Present({
    name: data.name,
    price: data.price,
    userId: userId,
  });

  newPresent.save((err) => {
    if (err) {
      console.error("Error saving present:", err);
      res.status(500).send("Error saving present");
    } else {
      console.log("Present saved successfully");
      res.sendStatus(200);
    }
  });
});

app.get("/get-presents", ensureAuthenticated, (req, res) => {
  const userId = req.user.id;
  Present.find({ userId: userId }, (err, presents) => {
    if (err) {
      console.error("Error retrieving presents:", err);
      res.status(500).send("Error retrieving presents");
    } else {
      res.json(presents);
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


