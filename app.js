const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const app = express();
const port = 3000;
require('dotenv').config();

const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Configure Passport
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/github/callback`, 
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if the user already exists in the database
            let user = await User.findOne({ githubId: profile.id });

            if (!user) {
                user = new User({
                    githubId: profile.id,
                    username: profile.username,
                });

                await user.save();
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
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
    if (req.isAuthenticated()) {
        res.redirect('/blogs');
    } else {
        res.sendFile(__dirname + '/src/public/login.html');
    }
})

app.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

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
