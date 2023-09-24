const express = require('express'),
  { MongoClient, ObjectId } = require("mongodb"),
  cookie  = require( 'cookie-session' ),
  { create } = require( 'express-handlebars' ),
  app = express(),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  GitHubStrategy = require('passport-github').Strategy

require('dotenv').config()

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let data_collection = null
let user_collection = null

async function run() {
  await client.connect()
  data_collection = client.db("a3_persistence").collection("inventory")
  user_collection = client.db("a3_persistence").collection("users")
}
run()


const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol', minimumFractionDigits: 2 })
const numberFormat = new Intl.NumberFormat('en-US')

const hbs = create({
    helpers: {
      numberFormat(amount) { return numberFormat.format(amount) },
      currencyFormat(amount) { return currencyFormat.format(amount) }
    }
})

app.engine( 'handlebars',  hbs.engine )
app.set( 'view engine', 'handlebars' )
app.set( 'views', './views' )


app.use( cookie({
  name: 'session',
  keys: ['secure_key1', 'secure_key2']
}))

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const result = await user_collection.find({username, password}).toArray()

  if(result.length > 0) {
    return cb(null, result[0].username)
  } else {
    return cb(null, false, { message: 'Incorrect username or password.' })
  }
}))

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/oauth2/github/redirect"
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile.username)
  }
))

app.use( express.json() )
app.use( express.urlencoded({ extended:true }) )

app.post( '/login/local', passport.authenticate('local', { failureRedirect: '/index.html', failureMessage: true }),
  async function(req, res) {
    req.session.login = true
    res.redirect( '/main' )
  }
)

app.get('/login/github', passport.authenticate('github'))

app.get('/oauth2/github/redirect', passport.authenticate('github', { failureRedirect: '/index.html' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.login = true
    res.redirect( '/main' )
  }
)

app.use( function( req,res,next) {
  let contain_index = req.url.includes('index')
  let contain_css = req.url.includes('html')
  let contain_js = req.url.includes('html')

  if( req.session.login !== true && !contain_css && !contain_js && !contain_index ) {
    res.redirect( '/index.html' )
  } else {
    next()
  }
})

app.use( express.static( 'public' ) )

app.use( (req,res,next) => {
  if( data_collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.get( '/main', async (req, res) => {
  const data = await data_collection.find({username: req.session.passport.user}).toArray()
  res.render( 'main', {username: req.session.passport.user, data: data, layout: false} )
})

app.get( '/logout', (req, res) => {
  req.session.passport = null
  req.session.login = false
  res.redirect( '/index.html' )
})

app.post( '/add', async (req, res) => {
  const data = req.body
  data['amount'] = Number(data['amount'])
  data['unit_value'] = Number(data['unit_value'])
  data['total_value'] = parseFloat((data['amount'] * data['unit_value']).toFixed(2))
  data['username'] = req.session.passport.user
  await data_collection.insertOne( data )

  console.log('ADD:', data)

  res.redirect( '/main' )
})

app.post( '/delete', async (req, res) => {
  const data = req.body
  const response = await data_collection.deleteOne( { _id: new ObjectId(data['_id']) } )

  if(response.deletedCount == 1) {
    res.redirect( '/main' )
    console.log('DELETE:', data)
  } else {
    console.log(`Delete Failed: ID not found. (${data['_id']})`)
    res.status( 412 ).send()
  }
})

app.post( '/modify', async (req, res) => {
  const data = req.body
  data['amount'] = Number(data['amount'])
  data['unit_value'] = Number(data['unit_value'])
  data['total_value'] = parseFloat((data['amount'] * data['unit_value']).toFixed(2))
  data['username'] = req.session.passport.user
  data['_id'] = new ObjectId(data['_id'])
  
  const response = await data_collection.replaceOne( { _id: data['_id'] }, data )
  
  if(response.modifiedCount == 1) {
    res.redirect( '/main' )
    console.log('MODIFY:', data)
  } else {
    console.log(`Modify Failed: ID not found. (${data['_id']})`)
    res.status( 412 ).send()
  }
})

app.listen( process.env.PORT || 3000 )
