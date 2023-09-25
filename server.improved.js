const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mime = require('mime');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;



const Entry = require('./models/Entry.js');
const User = require('./models/User.js');

app.use(morgan('dev')); // 'dev' is one of the predefined formats provided by Morgan


// Connect to mongodb
require('dotenv').config();
const uri = "mongodb+srv://anselychang:" + process.env.MONGODB_PASSWORD + "@ansel.musopg0.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  (result) => {
    console.log("connected to db");

    // start listening to requests only after we've successfully connected to the database
    app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));

  }
).catch(
  (err) => console.log(err)
);

app.use(express.json());
app.use(express.static('public'));

// Use sessions for tracking logins
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false }
}));

// redirect to login page if not logged in
const verifyLogin = function(req, res) {
  if(!req.session.username) {
    console.log("not logged in");
    res.redirect('/');
    return false;
  }
  return true;
}


const sendFile = function(res, filename) {
  const fullFilename = path.join(__dirname, 'public', filename);
  const type = mime.getType(fullFilename);

  fs.readFile(fullFilename, (err, content) => {
    if (err === null) {
      res.set('Content-Type', type);
      res.send(content);
    } else {
      res.status(404).send('404 Error: File Not Found');
    }
  });
};

app.get('/main', (req, res) => {
  if (!verifyLogin(req, res)) return;
  sendFile(res, 'home.html');
});

app.get('*', (req, res) => {
  console.log("get *", req.url);
  sendFile(res, 'login.html');
});

// return all the data for the logged in user
const sendUserState = async function(req, res) {

  let state = {
    user: req.session.username,
    caloriesGoal: 3000, // default calories goal
    proteinGoal: 150, // default protein gaol
    totalCalories: 0,
    totalProtein: 0,
    entries: []
  }

  let user = await User.findOne({ username: req.session.username });
  if (user) {
    state.caloriesGoal = parseInt(user.caloriesGoal);
    state.proteinGoal = parseInt(user.proteinGoal);
  }

  let entries = await Entry.find();
      
  for (let i = 0; i < entries.length; i++) {

    // only add entries for the logged in user
    if (entries[i].username !== req.session.username) {
      continue;
    }

    state.entries.push({
      id: entries[i]._id,
      name: entries[i].name,
      calories: entries[i].calories,
      protein: entries[i].protein,
      percentProtein: entries[i].percentProtein
    });

    state.totalCalories += parseInt(entries[i].calories);
    state.totalProtein += parseInt(entries[i].protein);

  }

  res.json({status: 200, message: "Successfully added entry", data: state},);

}

// Do nothing but just return data
app.post('/null', (req, res) => {
  if (!verifyLogin(req, res)) return;

  console.log("null", req.body);
  sendUserState(req, res);
});

// login user
// Format: {username: [string], password: [string]}
app.post('/login', async (req, res) => {

  try {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username });

    if (!user || password !== user.password) {
      console.log('Invalid username or password');
      return res.json({status: 400, message: 'Invalid username or password'});
    }

    console.log('User logged in successfully');
    req.session.username = username; // store username in session
    return res.json({status: 200, message: 'User loged in successfully'});

  } catch (error) {
    console.log(error);
    return res.json({status: 500, message: 'Internal Server Error'});
  }

});

// Sign up a new account
app.post('/signup', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log('User already exists');
      return res.json({status: 400, message: 'User already exists'});

    }

    const user = new User({ username: username, password: password, caloriesGoal: 3000, proteinGoal: 150 });
    await user.save();

    console.log('User signed up successfully');
    req.session.username = username; // store username in session
    return res.json({status: 200, message: 'User signed up in successfully'});

  } catch (error) {
    console.log(error);
    return res.json({status: 500, message: 'Internal Server Error'});
  }
});

// logout
app.post('/logout', (req, res) => {
  console.log("logout");
  req.session.destroy();
  res.redirect('/');
});

// Set calories/protein goal
// Format: {type: ["proteinGoal"/"caloriesGoal"], value: [number]}
app.post('/setgoal', (req, res) => {
  if (!verifyLogin(req, res)) return;

  const json = req.body;
  console.log("set goal", json);

  const filter = { username: req.session.username };
  const options = { new: true, upsert: false };

  let update;
  
  if (json.type === "caloriesGoal") update = { caloriesGoal: json.value };
  else if (json.type === "proteinGoal") update = { proteinGoal: json.value };
  else return;
  
  User.findOneAndUpdate(filter, update, options).then(
   (result) => {
      sendUserState(req, res);
    }
  ).catch(
    (err) => {
      console.log(err)
      res.json({status: 400, message: "Error setting goal"});
    }
  );
});

// Add entry
// Format: {name: [string], calories: [number], protein: [number]}
app.post('/add', (req, res) => {
  if (!verifyLogin(req, res)) return;

  const json = req.body;
  console.log("add", json);

  // calculate percent protein from calories and protein
  const proteinCalories = json.protein * 4;
  const percentProtein = Math.round((proteinCalories / json.calories) * 100);

  const entryData = {
    username: req.session.username, // each entry is associated with a user
    name: json.name,
    calories: json.calories,
    protein: json.protein,
    percentProtein: percentProtein
  };

  const entry = new Entry(entryData);

  entry.save().then(
    (result) => {
      console.log("Entry saved", entryData);

      sendUserState(req, res);
    }
  ).catch(
    (err) => {
      console.log(err)
      res.json({status: 400, message: "Error saving entry"});
    }
  );

});

// Delete entry
// Format: {id: [number]}
app.post('/delete', (req, res) => {
  if (!verifyLogin(req, res)) return;

  const json = req.body;
  console.log("delete", json);

  Entry.findByIdAndDelete(json.id).then(
    (result) => {
      sendUserState(req, res);
    }
  ).catch(
    (err) => {
      console.log(err)
      res.json({status: 400, message: "Error clearing entries"});
    }
  );
});

// Clear all entries
// Format: {}
app.post('/clear', (req, res) => {
  if (!verifyLogin(req, res)) return;

  const json = req.body;
  console.log("clear", json);

  Entry.deleteMany({}).then(
    (result) => {
      sendUserState(req, res);
    }
  ).catch(
    (err) => {
      console.log(err)
      res.json({status: 400, message: "Error clearing entries"});
    }
  );
});
