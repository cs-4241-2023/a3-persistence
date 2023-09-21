require('dotenv').config();
const express = require('express');
const path = require("path");
const app = express();
const { connectToDatabase } = require('./mongoDB/mongodb');
const authRoute = require("./auth/authenticated");
const nonAuthRoute = require("./auth/non_authenticated");
const passport = require('passport');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(require('express-session')({ secret: process.env.SESSION_ID, resave: true, saveUninitialized: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

connectToDatabase();

function authNavigator(req, _, next) {
  if (req.session.login == true) {
    app.use(authRoute);
    console.log(`${req.url} using auth`);
    next();
  } else {
    app.use(nonAuthRoute);
    console.log(`${req.url} using non-auth`);
    next();
  }
}

app.use(authNavigator);

app.listen(process.env.PORT, () => console.log("Server has started on port 3000"));