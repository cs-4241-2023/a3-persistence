const express = require('express'),
  { MongoClient, ObjectId } = require("mongodb"),
  cookie  = require( 'cookie-session' ),
  app = express()
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  GitHubStrategy = require('passport-github').Strategy

require('dotenv').config()
let last_updated = Date.now()


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
  function(req, res) {
    req.session.login = true
    res.redirect( '/main.html' )
  }
)

app.get('/login/github', passport.authenticate('github'))

app.get('/oauth2/github/redirect', passport.authenticate('github', { failureRedirect: '/index.html' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.login = true
    res.redirect('/main.html')
  }
)

app.use( function( req,res,next) {
  let contain_html = req.url.includes('html')
  let contain_index = req.url.includes('index')
  
  if( req.session.login !== true && contain_html && !contain_index ) {
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

app.get( '/last_updated', (req, res) => {
  res.json({ last_updated })
})

app.get( '/data', async (req, res) => {
  const docs = await data_collection.find({username: req.session.passport.user}).toArray()
  res.json( docs )
})

app.post( '/add', async (req, res) => {
  const data = req.body
  data['total_value'] = parseFloat((data['amount'] * data['unit_value']).toFixed(2))
  data['username'] = req.session.user
  await data_collection.insertOne( data )
  data['_id'] = data['_id']

  console.log('ADD:', data)
  last_updated = Date.now()

  res.json( data )
})

app.post( '/delete', async (req, res) => {
  const data = req.body
  const response = await data_collection.deleteOne( { _id: new ObjectId(data['_id']) } )

  if(response.deletedCount == 1) {
    res.status( 200 ).send()
    console.log('DELETE:', data)
    last_updated = Date.now()
  } else {
    console.log(`Delete Failed: ID not found. (${data['_id']})`)
    res.status( 412 ).send()
  }
})

app.post( '/modify', async (req, res) => {
  const data = req.body
  data['total_value'] = parseFloat((data['amount'] * data['unit_value']).toFixed(2))
  data['username'] = req.session.user
  data['_id'] = new ObjectId(data['_id'])
  
  const response = await data_collection.replaceOne( { _id: data['_id'] }, data )
  
  if(response.modifiedCount == 1) {
    res.json( data )
    console.log('MODIFY:', data)
    last_updated = Date.now()
  } else {
    console.log(`Modify Failed: ID not found. (${data['_id']})`)
    res.status( 412 ).send()
  }
})

app.listen( process.env.PORT || 3000 )
