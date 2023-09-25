const express = require("express"),
  passport = require("passport"),
  { MongoClient, ObjectId } = require("mongodb"),
  cookie = require('cookie-session'),
  app = express(),
  methodOverride = require('method-override'),
  dir = "public/",
  handlebars = require('express-handlebars'),
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
    if (result.length === 0) {
      return null;
    }
    return result[0]
  },
  async (username) => {
    console.log('adding new user')
    const newLoginResult = await passwordCollection.insertOne({ username: username, oauth: 'github', new: 1 });
    const result = await passwordCollection.find({ username: { $eq: username } }).toArray();
    console.log('new user', result)
    return (result[0])
  })

app.use(express.urlencoded({ extended: true }))

app.use(cookie({
  name: 'session',
  keys: ['100002', '31242']
}))
app.use(passport.initialize())
app.use(passport.session());
app.use(methodOverride('_method'));

app.set('view engine', 'hbs')
app.engine('hbs', handlebars.engine({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'indexLayout'
}))
app.set('views', './views')

app.use(express.static('public'));

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/loginFail' }),
  function (req, res) {
    console.log('redirecting')
    req.session.login = true;
    // Successful authentication, redirect home.
    res.redirect('/main');
  });

const failAuth = () => 'Login failed'

app.get('/', (req, res) => {
  res.redirect('/login')
})

app.get('/loginFail', (req, res) => {
  res.render('index', { layout: 'indexLayout', failed: failAuth() })
})

app.get('/login', (req, res) => {
  res.render('index', { layout: 'indexLayout', failed: '' })
})

app.get('/main', (req, res) => {
  const update = async () => {
    console.log("Session Im checking ", req.user)
    const result = await passwordCollection.find({ username: { $eq: req.user.username } }).toArray();
    if (result.length === 0) {
      res.redirect('/login')
    }
    else if (result[0].new === 1) {
      console.log('new user')
      await passwordCollection.updateOne(
        { username: { $eq: req.user.username } },
        {
          $set: {
            new: 0
          }
        }
      )
      res.render('mainNew', { layout: 'mainLayout', username: req.user.username })
    }
    else {
      res.render('main', { layout: 'mainLayout', username: req.user.username })
    }
  }
  update();
})

app.delete('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

app.use(function (req, res, next) {
  let index = req.url.includes("index");
  let css = req.url.includes("css");
  let js = req.url.includes("js");
  let robot = req.url.includes("robots.txt");
  if (req.session.login !== true && !index && !css && !js && !robot)
    res.redirect("/login");
  else next();
});

app.use(express.json());

// route to get all data
app.get('/getData', async (req, res) => {
  //console.log("Getting data")
  if (collection !== null) {
    const docs = await collection.find({ username: { $eq: req.user.username } }).toArray()
    //console.log(docs)
    res.json(docs)
  }
})

//route to submit data
app.post('/submit', async (req, res) => {
  //console.log(req.body)
  let start = new Date(req.body.startDate),
    today = new Date(),
    diff = new Date(today - start).getFullYear() - 1970,
    deposit = req.body.deposit,
    rate = req.body.rate,
    accrued = deposit * (1 + rate * diff);
  req.body['accrued'] = accrued
  req.body['username'] = req.user.username;
  const result = await collection.insertOne(req.body)
  if (collection !== null) {
    const appdata = await collection.find({ username: { $eq: req.user.username } }).toArray()
    //console.log(appdata)
    res.json(appdata)
  }
})

//route to delete
app.post('/delete', async (req, res) => {
  //console.log(req.body._id)
  const result = await collection.deleteOne({
    _id: new ObjectId(req.body._id)
  })

  const appdata = await collection.find({ username: { $eq: req.user.username } }).toArray()
  //console.log(appdata)
  res.json(appdata)
})

//route to modify
app.post('/modify', async (req, res) => {

  //console.log("modify request", req.body);

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

  const appdata = await collection.find({ username: { $eq: req.user.username } }).toArray()
  //console.log(appdata)
  res.json(appdata)
})

app.listen(process.env.PORT || port);
