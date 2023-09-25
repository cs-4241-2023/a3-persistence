'use strict';
const express = require('express');
const app = express();
const { MongoClient } = require("mongodb");
const PORT = process.env.PORT || 3000;
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session') // store session data in cookies


require('dotenv').config()

// app.use(express.static('public')) // Static files from public directory
app.use(express.static('public', { index: false })) // don't give index.html by default
app.use(express.json()) // For parsing application/json
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')) // Bootstrap CSS

// EJS template engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');




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
    // console.log(profile);
    callback(null, profile);
  }
));

// Middleware to check if user is authenticated with persistent session
const isAuth = (req, res, next) => {
  if (req.user) {
    next(); // Yes Auth + Yes Player Account
  } else {
    res.redirect('/login'); // No Auth 
  }
}

// Send to menu if user is already authenticated with cookie
app.get('/', isAuth, (req, res) => {
  res.render('menu', { title: 'Menu' });
})

// redirect for /editPlayer
app.get('/editPlayer', isAuth, (req, res) => {
  res.render('editPlayer', { title: 'Edit Player' });
})

// When play button on menu.html is clicked, redirect to game.html
app.get('/game', isAuth, (req, res) => {
  res.render('game', { title: 'Game' });
});

// Results, redirect to results.html
app.get('/results', isAuth, (req, res) => {
  // Show only current session player's info from mongodb in results.html
  res.render('results', { title: 'Results' });
});


app.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/'); // Yes
  } else {
    res.render('welcome', { title: 'Welcome' });
  }
});

// Logout route with a callback function
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle any errors that occur during logout
      console.error(err);
    }
    // delete cookies from browser so user must re-authenticate
    req.session = null;
    res.redirect('/login');
  });
});


// Middleware to check if user is authenticated
app.get('/auth/github', passport.authenticate('github'));

// Callback after authentication
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  async function (req, res) {    
    // No player account -> Serve editPlayer.html to create player account  
    req.session.githubUsername = req.user.username;
    const existingPlayer = await collection.findOne({ githubName: req.user.username });

    if (!existingPlayer) {
      // Store the GitHub username in the session
      res.redirect('/editPlayer')
    } else {
      // Yes player account
      res.redirect('/');
    }
  });
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


// Get player data from database
app.get('/getResults', isAuth, express.json(), async (req, res) => {
  const githubUsername = req.session.githubUsername; // Get the GitHub username from the session
  const player = await collection.findOne({ githubName: githubUsername });

  // Create json object which contains list of json objects
  // The first item in the list should be the current session player's info
  // Followed by the top 10 players in the database
  const resultsList = [];
  resultsList.push(player);
  const top10 = await collection.find({}).sort({ score: -1 }).limit(10).toArray();
  resultsList.push(...top10);
  res.status(200).json(resultsList);
})


// POST 
app.post('/submit', express.json(), async (req, res) => {
  // Add githubUsername to req.body
  req.body.githubName = req.session.githubUsername 
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