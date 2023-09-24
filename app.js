const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const app = express();
const port = 3000;
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Configure Passport
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/github/callback`, // Update BASE_URL in your .env file
},
    (accessToken, refreshToken, profile, done) => {
        // This callback function is called when a user is authenticated
        // You can save the user data to your database or perform other actions here
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json()); // Parse JSON request bodies
app.use(express.static('src/public'));

const blogPostRoutes = require('./src/routes/blogRoutes');

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/blogs');
    } else {
        res.redirect('/login');
    }
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/src/public/login.html');
})

app.get('/blogs', ensureAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/src/public/blog.html');
});

app.use('/api/blogs', blogPostRoutes);

app.get('/auth/github',
    passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/blogs');
    });

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/'); // Redirect to the login page
}


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
