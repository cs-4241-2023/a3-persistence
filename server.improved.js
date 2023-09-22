const { render } = require('ejs')

require('dotenv').config()


// server (express code)
const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      hbs     = require( 'express-handlebars' ).engine,
      cookie = require('cookie-session'),
      // path = require('path'),
      app = express() 
      // appdata = [
      //   {'yourname': 'Justin', 'username': 'Sombero', 'email': 'jwonoski2@wpi.edu', 'position': 'DPS'},
      //   {'yourname': 'Mason', 'username': 'Sneke', 'email': 'mSneke@wpi.edu', 'position': 'Support'},
      //   {'yourname': 'Tim', 'username': 'Robo', 'email': 'tRobo@wpi.edu', 'position': 'Tank'} 
      // ]

      app.use( express.static( 'public' ) )
      app.use( express.static( 'views'  ) )
      app.use( express.json() )      


// Middleware to use Handlebars as the view engine
app.set("view engine", "handlebars");
app.engine( 'handlebars', hbs( {} ) )
app.set( 'views','views')


// Serve the login.html page at the root path ("/")
app.get("/", (req, res) => {
  res.render('login', { msg: '', layout: false });
});

app.get( '/get',express.json(), async ( req, res ) => {
  const docs = await collection.find({}).toArray()
  res.json( docs )
})

app.post( '/submit', express.json(), async( req, res ) => {
  // our request object now has a 'json' field in it from our previous middleware
    const result = await collection.insertOne( req.body )
    res.json( result )
  })


app.delete( '/delete', express.json(), async( req, res ) => {
  const data = req.body
  const id = data.index
  console.log('Server received this user ID to delete',id)
  const result = await collection.deleteOne({ 
    _id:new ObjectId(id) 
  })
  
  res.json( result )
})


app.put( '/edit', express.json(), async( req, res ) => {
  const data = req.body
  const id = data.index
  const result = await collection.updateOne(
    { _id: new ObjectId( id ) },
    { $set:{yourname: data.playerdata.yourname, username: data.playerdata.username, email: data.playerdata.email, position: data.playerdata.position} }
  )
  console.log('This is Edit ID:', id)
  console.log('This is Edit Name:', data.playerdata.yourname)
  res.json( result )
  })


//MongoDB Database Code:

const uri = `mongodb+srv://${process.env.USR}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  //Replace datatest and test with our own from MongoDB
  collection = await client.db("Gamers").collection("users")

  app.use( (req,res,next) => {
    if( collection !== null ) {
      next()
    }else{
      res.status( 503 ).send()
    }
  })
}

  run()

  //Cookie code:

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.post( '/login', (req,res)=> {
  debugger
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log( req.body )

  if( req.body.password === 'test' ) {
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.login = true
    
    // since login was successful, send the user to the main content
    // use redirect to avoid authentication problems when refreshing
    // the page or using the back button, for details see:
    // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
    res.redirect( 'views/index.html' )
  }else{
    // cancel session login in case it was previously set to true
    req.session.login = false
    // password incorrect, send back to login page
    res.render('login', { msg:'login failed, please try again', layout:false })
  }
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use(function (req, res, next) {
  if (req.session.login === true)
    next();
  else
    res.redirect('views/login.html');
});


app.get('index', ( req, res) => {
    res.render( 'main', { msg:'success you have logged in', layout:false })
})


const listener = app.listen( process.env.PORT || 3000 )