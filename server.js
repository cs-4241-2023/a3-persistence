'use strict';
const express = require('express');
const app = express();
const { MongoClient } = require("mongodb");
const PORT = process.env.PORT || 3000;
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session') // store session data in cookies

let githubUsername = undefined; // global variable for github username

require('dotenv').config()

app.use(express.static('public')) // Static files from public directory
// app.use(express.static('public', { index: false })) // don't give index.html by default
app.use(express.json()) // For parsing application/json

// MongoDB connection
const uri = `mongodb+srv://${process.env.TESTER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri);
let collection = undefined;
// Set collection global value with database
async function dbconnect() {
  await client.connect()
  collection = client.db("testA3").collection("testList")
}
dbconnect();

// From video passport tutorial

app.use(session({
  secret: process.env.USER_SECRET,
  resave: false,
  saveUninitialized: false, // we set to false
  cookie: {
    httpOnly: true,
    secure: false, // set secure to true when not using localhost
    maxAge: 24 * 60 * 60 * 1000
  } // 24 hours
}))

app.use(passport.initialize());
app.use(passport.session());

// Take user object and returns an id
passport.serializeUser(function (user, callback) {
  callback(null, user.id);
});

// Take id and returns user object
passport.deserializeUser(function (id, callback) {
  callback(null, id);
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID, // Client ID from GitHub OAuth app
  clientSecret: process.env.GITHUB_CLIENT_SECRET, // Client Secret from GitHub OAuth app
  callbackURL: process.env.GITHUB_CALLBACK_URL // Callback URL from GitHub OAuth app
},
  // Here is where we get the user profile (GitHub account) to be used in database
  function (accessToken, refreshToken, profile, callback) {

    // See if the user exists already in the database
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    console.log(profile);
    callback(null, profile);
  }
));

// Middleware to check if user is authenticated with persistent session
const isAuth = (req, res, next) => {
  console.log('inside isAuth()');
  if (githubUsername) {
    console.log('About to call next() and show menu');
    next(); // Yes Auth + Yes Player Account
  } else {
    console.log('bad auth going back to login welcom page');
    res.redirect('/login'); // No Auth 
  }
}

// Send to menu if user is already authenticated with cookie
app.get('/', isAuth, (req, res) => {
  console.log(`AMAZING about to show menu for: ${req.user.username}`);
  res.sendFile(__dirname + '/public/menu.html');
})


app.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/'); // Yes
  } else {
    res.sendFile(__dirname + '/public/index.html');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
})

// Middleware to check if user is authenticated
app.get('/auth/github', passport.authenticate('github'));

// Callback route after GitHub authentication
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  async function (req, res) {
    // Successful authentication
    console.log(`Good authentication: ${req.user.username}`);

    // No player account -> Serve editPlayer.html to create player account
     // Set global variable for github username
     githubUsername = req.user.username;
    const existingPlayer = await collection.findOne({ githubName: req.user.username });
    if (!existingPlayer) {
      console.log(`No player account for: ${req.user.username}`);
      res.redirect('/editPlayer')
      return;
    } else {
      // Yes player account
      console.log(`Redirecting to menu for: ${req.user.username}`);
      res.redirect('/');
    }
  });


// redirect for /editPlayer
app.get('/editPlayer', isAuth, (req, res) => {
  console.log(`Edit player: ${githubUsername}`);
  res.sendFile(__dirname + '/public/editPlayer.html')
})



// End of Passport Code --------------------------------------------------------------

// Start server
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

// Check database connection
app.use((req, res, next) => {
  if (collection !== null) {
    next()
  } else {
    res.status(503).send()
  }
})

// POST 
app.post('/submit', express.json(), async (req, res) => {
  // Add githubUsername to req.body
  req.body.githubName = githubUsername // TODO: can this be done without global variable?
  await collection.insertOne(req.body); // Add new player to the database
  await updatePlayersAndRespond(res);
});

// DELETE
app.delete('/delete', express.json(), async (req, res) => {
  const playerName = req.body.name;
  // Use MongoDB's deleteOne method to remove the player by name
  await collection.deleteOne({ name: playerName });
  await updatePlayersAndRespond(res);
});

// PUT
app.put('/edit', express.json(), async (req, res) => {
  const playerName = req.body.name;
  const newName = req.body.newName
  // Update the player's name in the MongoDB collection
  await collection.updateOne({ name: playerName }, { $set: { name: newName } });
  updatePlayersAndRespond(res)
});

// Helper function to update players and respond to client
async function updatePlayersAndRespond(res) {
  try {
    // Sort players by score (highest score first)
    const players = await collection.find({}).sort({ score: -1 }).toArray();

    // Assign ranks to players based on their position in the sorted list
    players.forEach((player, index) => {
      player.rank = index + 1;
    });

    // Update the rank for each player in the database (optional)
    const updatePromises = players.map(async (player) => {
      await collection.updateOne({ _id: player._id }, { $set: { rank: player.rank } });
    });

    await Promise.all(updatePromises);

    // Respond to the client with a JSON string of players
    res.status(200).json(players);
  } catch (error) {
    // Handle error
    res.status(500).json({ error: 'Internal server error' });
  }
}