const { render } = require('ejs')

require('dotenv').config()


// server (express code)
const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      hbs     = require("express-handlebars").create({ extname: ".handlebars" }),
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
//Dev note: Change this to possibly fix view issue. 
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");


// Serve the login page at the root path ("/")
app.get("/", (req, res) => {
  res.render('login', { msg: '', layout: false });
});

app.get('/get', express.json(), async (req, res) => {
  const username = req.query.username; // Retrieve the username from query parameter

  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  const filter = { username: username };
  const docs = await collection.find(filter).toArray();
  res.json(docs);
})

app.post('/submit', express.json(), async (req, res) => {
  const { yourname, gamertag, email, position, username } = req.body;

  const result = await collection.insertOne({
    yourname: yourname,
    gamertag: gamertag,
    email: email,
    position: position,
    username: username // Insert the username into the database
  });
  res.json(result);
});



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
  keys: ['OEF9GeGgAd0G', 'LQR7wKtsRx1y']
}))

//KEEP THESE UP HERE, I they're below Login it wont work until authenticated.
app.get('/swap', (req, res) => {
  res.render('register', { msg: '', layout: false });
});

app.get('/back', (req, res) => {
  res.render('login', { layout: false });
});

app.post( '/login', express.json(), async(req,res)=> {
  debugger
  const { login, password } = req.body;
  //This will find the inputted user and password in the database.
  const user = await collection.findOne({username: login, password: password});
  console.log( req.body )

  if(user) {
    console.log('login successful')
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.login = true
    res.cookie('username', login)
    
    // since login was successful, send the user to the main content
    // use redirect to avoid authentication problems when refreshing
    res.redirect( '/index' )
  }else{
    // cancel session login in case it was previously set to true
    req.session.login = false
    // password incorrect, send back to login page
    res.render('login', { msg:'login failed, please try again', layout:false })
  }
})

app.post('/register', express.json(), async (req, res) => {
  const { login, password} = req.body;

  // Check if the username is already empty and or taken.

  if (login === '' || password === '') {
    res.render('register', { msg:'Please fill out all fields', layout:false })
    return;
  }
  console.log(login, password)
  const user = await collection.findOne({username: login});

  if(user){
    res.render('register', { msg:'Username already taken', layout:false })
    return;
  }

  // If the username is available, insert the new user into your database
  const newUser = {
    username: login,
    password: password, 
  };

  try {
    const result = await collection.insertOne(newUser);
    console.log('User registered!')
    res.redirect( 'index' )
  } catch (error) {
    console.error('Error registering user!!!!')
    res.render('register', { msg:'Error registering user', layout:false })
  }
});


// add some middleware that always sends unauthenicaetd users to the login page
// app.use(function (req, res, next) {
//   if (req.session.login === true)
//     next();
//   else
//     res.redirect('views/login.handlebars');
// });


app.get('/index', ( req, res) => {
    res.render( 'index', { msg:'success you have logged in', layout:false })
})

const listener = app.listen( process.env.PORT || 3000 )