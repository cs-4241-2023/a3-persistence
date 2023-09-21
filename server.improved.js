// server
const express = require("express"),
  { MongoClient, ObjectId } = require("mongodb"),
  hbs     = require( 'express-handlebars' ).engine,
  cookie = require('cookie-session'),
  app = express();

app.use( express.urlencoded({ extended:true }) )

app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());

app.engine( 'handlebars',  hbs() )
app.set(    'view engine', 'handlebars' )
app.set(    'views',       './views' )

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.il1hxgz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

let collection = null;

let loginCollection = null;

async function run() {
  //debugger;
  await client.connect();
  collection = await client.db("a3-database").collection("playlists");
  loginCollection = await client.db("a3-database").collection("information")
}

app.use((req, res, next) => {
  if (collection !== null && loginCollection !==null) {
    next();
  } else {
    res.status(503).send();
  }
});

//calling run
run();

app.post( '/submit', async (req,res) => {
  const length = req.body.length;
  const minutes = Math.floor(length / 60).toString();

  const seconds = (length % 60).toString();

  let finalTime = "";

  if (seconds < 10) {
    finalTime = minutes + ":0" + seconds;
  } else {
    finalTime = minutes + ":" + seconds;
  }

  req.body.length = finalTime;
  const result = await collection.insertOne( req.body )

  const playlistData = await client.db("a3-database").collection("playlists").find().toArray();
  
  res.status(200).json(playlistData);
  
})


app.post("/remove", async (req, res) => {
  
  const { id } = req.body
  const query = { _id: new ObjectId(id) }

  const collection = client.db("a3-database").collection("playlists");
  let result = await collection.deleteOne(query);
  
  const playlistData = await client.db("a3-database").collection("playlists").find().toArray();
  
  res.status(200).json(playlistData);
  
});

app.post( '/login', async (req,res)=> {
  console.log( req.body )
  
  // below is *just a simple authentication example* 
  // for A3, you should check username / password combos in your database
  if( req.body.password === 'test' ) {
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.login = true

    res.redirect( 'main.html' )
  }else{
    // cancel session login in case it was previously set to true
    req.session.login = false
    // password incorrect, send back to login page
    res.render('index', { msg:'login failed: incorrect password', layout:false })
  }
  
  const result = await loginCollection.insertOne( req.body );
  
})

app.get( '/', (req,res) => {
  res.render( 'index', { msg:'', layout:false })
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.render('index', { msg:'login failed: please try again', layout:false })
})

app.get( '/main.html', ( req, res) => {
    res.render( 'main', { msg:'success you have logged in', layout:false })
})

app.post('/create', (req, res) => {
  
})


app.listen(process.env.PORT);
