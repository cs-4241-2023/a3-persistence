const http = require( 'http' ),
      fs   = require( 'fs' ),
      express = require('express'),
      cookie = require('cookie-session'),
      dotenv = require("dotenv"),
      { MongoClient, ObjectId } = require("mongodb"),
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000,
      app = express();

// allows use of environment variables
dotenv.config()

const handleLogin = function(request, response) {
  console.log('body: ' + JSON.stringify(request.body))
  console.log('un: ' + request.body.username + " pw: " +request.body.password)

  // check if the username matches a username in the database
  if( request.body.username == 'test' ) { // TODO
    // check if the password matches
    if(request.body.password == 'test') { // TODO
      // request.session.login == true
      response.redirect("https://www.google.com/") // check this out
      console.log('correct!')
    } else {
      // password incorrect, redirect back to login page
      response.sendFile( __dirname + '/public/index.html' )

      console.log('fail!')

    }
  } else {
    // password incorrect, redirect back to login page
    response.sendFile( __dirname + '/public/index.html' )
    console.log('fail!')
  }
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

    // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}


// express set up

// cookie set up

// use express.urlencoded to get data sent by default form actions
// or GET requests
app.use( express.urlencoded({ extended: true }) )

// public directory
app.use(express.static('./public'))
app.use(express.json())

let collection = null

// Database Connection
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")
}
run()


// route to get all docs
app.get("/docs", async (request, response) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    response.json( docs )
  }
})

app.post( '/add', async (request,response) => {
  const result = await collection.insertOne( request.body )
  response.json( result )
})

app.use( (request,response,next) => {
  console.log('idk what this function does but it just got called!')
  if( collection !== null ) {
    console.log('what does next do?')
    next()
  }else{
    console.log('503?')
    response.status( 503 ).send()
  }
})

// set up GET and POST requests

// GET requests
app.get('/', function (request, response) {
  console.log('getting index.html')
  response.sendFile( __dirname + '/public/index.html' )
})

// POST requests
app.post('/login', handleLogin)

// set up the server
app.listen(3000)