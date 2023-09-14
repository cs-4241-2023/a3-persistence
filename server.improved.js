require('dotenv').config();
const path = require('path');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const passportLocal = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Initialize Express
const port = 3000;
const app = express();

function connectToDatabase() {
  try {
    const client = new MongoClient(process.env.MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    const tempDB = client.db('Project-A3');
    tempDB.command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return tempDB;
  } catch (error) {
    console.error(error);
  }
}

// Get or create collection
let db = connectToDatabase();
let dbCollection = db.collection('Expenses');
if (dbCollection === null || dbCollection === undefined) {
  console.error("MongoDB does not have collection, 'Expenses'!");
  return;
}

// Initialize and setup passport and session
app.use(session({
  secret: process.env.GOOGLE_CLIENT_ID,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// For OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://cs4241-assignment3.onrender.com/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// For username and password
passport.use(new passportLocal.Strategy((username, password, done) => {
  if (username === 'cs4241' && password === 'ihatejs') {
    return done(null, { id: username });
  } else {
    return done(null, false, { message: 'Invalid username or password' });
  }
}));

// API Routes for Expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await dbCollection.find().toArray();
    res.json({ expenses });
  } catch (error) {
    res.json({ message: 'Failed to fetch expenses', error });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const { Cost, Date, Item } = req.body;
    const result = await dbCollection.insertOne({ Cost, Date, Item });
    res.json({ message: 'Expense added', result });
  } catch (error) {
    res.json({ message: 'Failed to add expense', error });
  }
});

app.put('/api/expenses', async (req, res) => {
  try {
    const { _id, Cost, Date, Item } = req.body;
    const result = await dbCollection.updateOne({ _id: new ObjectId(_id) }, { $set: { Cost, Date, Item } });
    res.json({ message: 'Expense updated', result });
  } catch (error) {
    res.json({ message: 'Failed to update expense', error });
  }
});

app.delete('/api/expenses', async (req, res) => {
  try {
    const { _id } = req.body;
    const result = await dbCollection.deleteOne({ _id: new ObjectId(_id) });
    res.json({ message: 'Expense deleted', result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete expense', error });
  }
});

// OAuth endpoints
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/expenses.html');
  }
);

// Local Auth endpoints
app.post('/auth/local', (req, res, next) => {
  next();
}, passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
  res.json({ success: true });
});


// Serve Static Files for Authenticated Users
app.get('/expenses.html', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'expenses.html'));
});

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});