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
      currencyFormat(amount) { return currencyFormat.format(amount) },
      idEqual(id1, id2) {return id1.equals(id2)}
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
  const result = await user_collection.findOne({username, oauth: { $exists: false }})

  if(!result) {
    const newUser = await user_collection.insertOne( {username, password} )
    return cb(null, {
      username,
      user_id: newUser.insertedId,
      new_user: true
    })
  } else if(result.password === password) {
    return cb(null, {
      username,
      user_id: result._id,
      new_user: false
    })
  } else {
    return cb(null, false, { message: 'User exists, but the password is incorrect.' })
  }
}))

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://a3-nelson-diaz.glitch.me/oauth2/github/redirect"
  },
  async function(accessToken, refreshToken, profile, cb) {
    
    const result = await user_collection.findOne({username: profile.username, oauth: 'github'})

    if(!result) {
      const newUser = await user_collection.insertOne( {username: profile.username, oauth: 'github'} )
      return cb(null, {
        username: profile.username,
        user_id: newUser.insertedId,
        new_user: true
      })
    } else {
      return cb(null, {
        username: profile.username,
        user_id: result._id,
        new_user: false
      })
    }
  }
))

app.use( express.urlencoded({ extended:true }) )
app.use( express.static( 'public' ) )

app.get('/', (req, res) => res.redirect('/login'))

app.get( '/login', function(req, res) {
  if(req.session.login === true) {
    res.redirect('/main')
    return;
  }
  
  const message = req.session.messages ? req.session.messages[0] : ''

  res.render('login', {message, layout: false})
  req.session.messages = []
})

app.post( '/login/local', passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  async function(req, res) {
    req.session.login = true
    res.redirect( '/main' )
  }
)

app.get('/login/github', passport.authenticate('github'))

app.get('/oauth2/github/redirect', passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.login = true
    res.redirect( '/main' )
  }
)

app.use( function( req,res,next) {
  let contain_robots = req.url.includes('robots.txt') // Prvents SEO error in Lighthouse test

  if( req.session.login !== true && !contain_robots ) {
    res.redirect( '/login' )
  } else {
    next()
  }
})


app.use( (req,res,next) => {
  if( data_collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.get( '/main', async (req, res) => {
  const data = await data_collection.find({user_id: req.session.passport.user.user_id}).toArray()
  res.render( 'main', {
    username: req.session.passport.user.username,
    new_user: req.session.passport.user.new_user,
    data: data,
    modifyId: new ObjectId(req.session.modifyId),
    layout: false
  })
})

app.get( '/logout', (req, res) => {
  req.session.passport = null
  req.session.login = false
  req.session.modifyId = null
  res.redirect( '/index.html' )
})

app.post( '/add', async (req, res) => {
  const data = req.body
  data['amount'] = Number(data['amount'])
  data['unit_value'] = Number(data['unit_value'])
  data['total_value'] = parseFloat((data['amount'] * data['unit_value']).toFixed(2))
  data['user_id'] = req.session.passport.user.user_id
  console.log(req.session.passport.user)
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

app.post( '/modifyLoad', (req, res) => {
  req.session.modifyId = req.body.modifyId
  res.redirect( '/main' )
})

app.post( '/modify', async (req, res) => {
  const data = req.body
  data['amount'] = Number(data['amount'])
  data['unit_value'] = Number(data['unit_value'])
  data['total_value'] = parseFloat((data['amount'] * data['unit_value']).toFixed(2))
  data['user_id'] = req.session.passport.user.user_id
  data['_id'] = new ObjectId(data['_id'])
  
  const response = await data_collection.replaceOne( { _id: data['_id'] }, data )
  req.session.modifyId = null
  
  if(response.modifiedCount == 1) {
    res.redirect( '/main' )
    console.log('MODIFY:', data)
  } else {
    console.log(`Modify Failed: ID not found. (${data['_id']})`)
    res.status( 412 ).send()
  }
})

app.listen( process.env.PORT || 3000 )
