const express = require("express"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  crypto = require("crypto"),
  { MongoClient, ObjectId } = require("mongodb"),
  cookie = require('cookie-session'),
  app = express(),
  methodOverride = require('method-override'),
  dir = "public/",
  port = 3000;

require('dotenv').config();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri)

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")
  passwordCollection = await client.db("datatest").collection("passwords")
}

run();

app.use((req, res, next) => {
  if (collection !== null && passwordCollection !== null) {
    next()
  } else {
    res.status(503).send()
  }
})

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  async (username) => {
    const result = await passwordCollection.find({ username: { $eq: username } }).toArray();
    //console.log(result);
    if(result.length === 0){
      return null;
    }
    return result[0]
  },
  async (username) => {
    const newLoginResult = await passwordCollection.insertOne({username: username, oauth: 'github'});
    const result = await passwordCollection.find({ username: { $eq: username } }).toArray();
    console.log(result)
    return(result)
  })

app.use(express.urlencoded({ extended: true }))

app.use(cookie({
  name: 'session',
  keys: ['100002', '31242']
}))
app.use(passport.initialize())
app.use(passport.session());
app.use(methodOverride('_method'));


app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/main');
  });

app.post('/login', checkNotAuthenticated, passport.authenticate('local', { successRedirect: '/main', failureRedirect: '/login' }))

app.get('/login',checkNotAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/main', checkAuthenticated, (req, res) => {
  console.log("Session Im checking ", req.user)
  res.redirect('main.html')
})

app.delete('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }

  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect('/main')
  }
  next();
}

//login request
/*app.post('/login', async (req, res) => {
  console.log(req.body)
  const result = await passwordCollection.find({ username: { $eq: req.body.username } }).toArray()

  if (result.length === 0) {
    const newLoginResult = await passwordCollection.insertOne(req.body);
  }

  const result1 = await passwordCollection.find({ username: { $eq: req.body.username } }).toArray()
  if (req.body.password === result1[0].password) {
    req.session.login = true
    req.session.username = req.body.username

    console.log(req.session.username)

    res.redirect('main.html')
  } else {

    res.sendFile(__dirname + '/public/index.html')
  }
})*/

/*
app.use(function (req, res, next) {
  if (req.session.login === true)
    next()
  else
    res.sendFile(__dirname + '/public/index.html')
})*/

app.use(express.static('public'));
app.use(express.json());

// route to get all data
app.get("/getData", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({ username: { $eq: req.user } }).toArray()
    //console.log(docs)
    res.json(docs)
  }
})


//route to submit data
app.post('/submit', async (req, res) => {
  console.log(req.body)
  let start = new Date(req.body.startDate),
    today = new Date(),
    diff = new Date(today - start).getFullYear() - 1970,
    deposit = req.body.deposit,
    rate = req.body.rate,
    accrued = deposit * (1 + rate * diff);
  req.body['accrued'] = accrued
  req.body['username'] = req.user;
  const result = await collection.insertOne(req.body)
  if (collection !== null) {
    const appdata = await collection.find({ username: { $eq: req.user } }).toArray()
    console.log(appdata)
    res.json(appdata)
  }
})

//route to delete
app.post('/delete', async (req, res) => {
  console.log(req.body._id)
  const result = await collection.deleteOne({
    _id: new ObjectId(req.body._id)
  })

  const appdata = await collection.find({ username: { $eq: req.user } }).toArray()
  console.log(appdata)
  res.json(appdata)
})

//route to modify
app.post('/modify', async (req, res) => {

  console.log("modify request", req.body);

  for (let i = 0; i < req.body.length; i++) {
    if (req.body[i].changed === 1) {
      let start = new Date(req.body[i].startDate),
        today = new Date(),
        diff = new Date(today - start).getFullYear() - 1970,
        deposit = req.body[i].deposit,
        rate = req.body[i].rate,
        accrued = deposit * (1 + rate * diff);

      const result = await collection.updateOne(
        { _id: new ObjectId(req.body[i]._id) },
        {
          $set: {
            deposit: deposit,
            rate: rate,
            startDate: req.body[i].startDate,
            accrued: accrued,
          }
        }
      )
    }
  }

  const appdata = await collection.find({ username: { $eq: req.user } }).toArray()
  console.log(appdata)
  res.json(appdata)
})

app.listen(process.env.PORT || port);
