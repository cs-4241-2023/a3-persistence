/*const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
 
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
  const clientData = JSON.parse( dataString )
  console.log( clientData )

    // ... do something with the data here!!!
    if (clientData.Player1Guess === clientData.ComputerGuess && clientData.Player2Guess === clientData.ComputerGuess){
     appdata.push({ 'Player': '1', 'PlayerGuess': clientData.Player1Guess, 
                    'CompGuess': clientData.ComputerGuess, 'isWinner': true },
                    { 'Player': '2', 'PlayerGuess': clientData.Player2Guess, 
                    'CompGuess': clientData.ComputerGuess, 'isWinner': true } )
                    console.log(appdata)
    } else if (clientData.Player1Guess === clientData.ComputerGuess && clientData.Player2Guess !== clientData.ComputerGuess){
      appdata.push({ 'Player': '1', 'PlayerGuess': clientData.Player1Guess, 
                    'CompGuess': clientData.ComputerGuess, 'isWinner': true },
                    { 'Player': '2', 'PlayerGuess': clientData.Player2Guess, 
                    'CompGuess': clientData.ComputerGuess, 'isWinner': false } )
                    console.log(appdata)
    } else if(clientData.Player1Guess !== clientData.ComputerGuess && clientData.Player2Guess === clientData.ComputerGuess){
      appdata.push({ 'Player': '1', 'PlayerGuess': clientData.Player1Guess, 
                    'CompGuess': clientData.ComputerGuess, 'isWinner': false },
                    { 'Player': '2', 'PlayerGuess': clientData.Player2Guess, 
                    'CompGuess': clientData.ComputerGuess, 'isWinner': true } )
                    console.log(appdata)
    } else {
      appdata.push({ 'Player': '1', 'PlayerGuess': clientData.Player1Guess, 
                    'CompGuess': clientData.ComputerGuess, 'isWinner': false },
                    { 'Player': '2', 'PlayerGuess': clientData.Player2Guess, 
                    'CompGuess': clientData.ComputerGuess, 'isWinner': false } )
                    console.log(appdata)
    }
    console.log(JSON.stringify(appdata))


    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    
    response.end(JSON.stringify(appdata))
  })
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
}*/

//To run on Glitch keep 102 commented out, to run locally uncomment it
//require('dotenv').config()
const express = require("express"),
      { MongoClient } = require("mongodb"),
      app = express(),
      appData     = [],
      port = 3000

app.use("/", express.static("public"))
app.use( express.json() )
//console.log(process.env.USER, process.env.PASS, process.env.HOST)
app.use(express.urlencoded({extened:true}))
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let client = new MongoClient(uri);
let serverConn = async function(){
try {
  client.connect()
  listAllDatabases(client);
} catch (error) {
  console.error(error)
} finally {
  await client.close()
}

}

const listAllDatabases = async function(client) { 
  const dbList = await client.db('admin').admin().listDatabases();
  dbList.databases.forEach(db => {
    //console.log(`${db.name}`)
  })
}

serverConn();


async function createListing(client, newListing){
  const result = await client.db("numbergame").collection("dbcollection").insertOne(newListing);
  console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function handlePost (client, req, res){
  if (req.body.Player1Guess === req.body.ComputerGuess){
    await createListing(client,
    {
      'Player': req.body.UserName, 
      'Player1Guess': req.body.Player1Guess, 
      'CompGuess': req.body.ComputerGuess, 
      'isWinner': true, 
      
    })
  } else {
    await createListing(client,
      {
        'Player': req.body.UserName,  
        'Player1Guess': req.body.Player1Guess, 
        'CompGuess': req.body.ComputerGuess, 
        'isWinner': false, 
        
      })
      //console.log(`${req.body.Player1Guess}`)
  }
}



app.post( '/submit', express.json(), async ( req, res ) => {
  handlePost(client,req,res)
  let collection = client.db("numbergame").collection("dbcollection")
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    res.json( docs )
    //console.log(JSON.parse(docs))
  }
}), 


app.post('/delete', async (req,res)=>{
  const collection = client.db("numbergame").collection("dbcollection")
  console.log(req.body.UserName)
  const result = await collection.deleteOne({
    Player:req.body.UserName
  })
  const docs = await collection.find({}).toArray()
    res.json( docs )
}), 

app.post('/modify', async (req,res)=>{
  const collection = client.db("numbergame").collection("dbcollection")
  console.log(req.body.UserName)
  const result = await collection.updateOne({ Player: req.body.UserName }, { $set: {isWinner: true} });
  const docs = await collection.find({}).toArray()
    res.json( docs )
})
    
app.listen( 3000 )
