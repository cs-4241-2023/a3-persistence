// const http = require( 'http' ),
//       fs   = require( 'fs' ),
//       // IMPORTANT: you must run `npm install` in the directory for this assignment
//       // to install the mime library if you're testing this on your local machine.
//       // However, Glitch will install it automatically by looking in your package.json
//       // file.
//       mime = require( 'mime' ),
//       dir  = 'public/',
//       port = 3000

// const appdata = []



// const server = http.createServer( function( request,response ) {
//   if( request.method === 'GET' ) {
//     handleGet( request, response )    
//   }else if( request.method === 'POST' ){
//     handlePost( request, response ) 
//   }

// })

// const handleGet = function( request, response ) {
//   const filename = dir + request.url.slice( 1 ) 

//   if( request.url === '/' ) {
//     sendFile( response, 'public/index.html' )
//   }else{
//     sendFile( response, filename )
//   }
// }

// const handlePost = function( request, response ) {
//   let dataString = ''

//   request.on( 'data', function( data ) {
//       dataString += data 
//   })

//   request.on( 'end', function() {
//     // console.log("Server")
    
//     // console.log(appdata)
//     // ... do something with the data here!!!
//     // if /delete, then call delEntry
//     // console.log(request.url)
//     if(request.url === '/submit'){
//       // console.log( JSON.parse(dataString))
      
//       let newItem = JSON.parse(dataString)
//       if(newItem.toBeDeleted === true){
//         appdata.splice(0,1)
//       }
//       else {
//         appdata.push(newItem)
//       }

//     }

    
//     response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
//     response.write(JSON.stringify(appdata))
//     response.end()
//   })
// }



// const sendFile = function( response, filename ) {
//    const type = mime.getType( filename ) 

//    fs.readFile( filename, function( err, content ) {

//      // if the error = null, then we've loaded the file successfully
//      if( err === null ) {

//        // status code: https://httpstatuses.com
//        response.writeHeader( 200, { 'Content-Type': type })
//        response.end( content )

//      }else{

//        // file not found, error code 404
//        response.writeHeader( 404 )
//        response.end( '404 Error: File Not Found' )

//      }
//    })
// }

// server.listen( process.env.PORT || port )


const express    = require('express'),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()


app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )

require('dotenv').config()
const uri = `mongodb+srv://kg:1111@$cluster0.6ionqch.mongodb.net`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")
  

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run()

const dreams = []
app.post( '/submit', async (req, res) => {

  await client.connect()
  collection =  client.db("datatest").collection("test")
  collection.insertOne(req.body)
  // use insert one


  // dreams.push( req.body) //push into mongodb insteasd

  
  res.writeHead( 200, { 'Content-Type': 'application/json' })
  res.end( JSON.stringify( dreams ) )

  
})

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})



app.post( '/add', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
})

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.listen( 3000 )