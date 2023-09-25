const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      express = require('express'),
      { MongoClient, ObjectId } = require('mongodb'),
      app = express(),
      port = 3000

app.use(express.static("public") )
app.use(express.json() )


process.env.USER
process.env.PASS
process.env.HOST
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null




async function run() {
await client.connect()
collection = await client.db("Meetings").collection("AllMeetings")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run()
app.listen(3000)


app.post( '/add', async (req,res) => {
  let dataString = JSON.stringify(req.body)
  let firstPos = dataString.split('\"');
        const today = new Date()
        const date = firstPos[15].split('/')
        let months = parseInt(date[0]) - today.getMonth() - 1
        let days = parseInt(date[1]) - today.getDate()
        const totalDays = months * 30 + days
        let data = { 'name' : firstPos[7], 'location' : firstPos[11], 'date' : firstPos[15], 'daysTill' : totalDays} 
        const result = await collection.insertOne( data )
        const docs = await collection.find({}).toArray()
        res.json(docs)
  
  //const result = await collection.insertOne( req.body )
  //res.json( result )
})

app.post( '/remove', async (req,res) => {
  const result = await collection.deleteOne(req.body)
  //const result = await collection.deleteOne({ 
  //  _id:new ObjectId( req.body._id ) 
  //})
  
  const docs = await collection.find({}).toArray()
  res.json(docs)
})

app.post( '/update', async (req,res) => {
  let dataString = JSON.stringify(req.body)
  let firstPos = dataString.split('\"');
  
        const today = new Date()
        const date = firstPos[15].split('/')
        let months = parseInt(date[0]) - today.getMonth() - 1
        let days = parseInt(date[1]) - today.getDate()
        const totalDays = months * 30 + days
        let data = { 'name' : firstPos[7], 'location' : firstPos[11], 'date' : firstPos[15], 'daysTill' : totalDays} 
        const result = await collection.updateOne(
        {name: data.name},
        {$set:{name:data.name, location:data.location, date: data.date, daysTill:data.daysTill}})
        const docs = await collection.find({}).toArray()
        res.json(docs)
  
  
  //const result = await collection.updateOne(
   // { _id: new ObjectId( req.body._id ) },
  //  { $set:{ name:req.body.name } }
 // )
 // res.json( result )
})

app.post( '/login', async (req,res) => {
  let users = await client.db("Meetings").collection("Users")
  const result = await users.findOne(req.body)
  const docs = await collection.find({}).toArray()
  if(result != null){
    res.json(docs)
  }
  else {
    res.json(result)
  }
})



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
   // console.log( JSON.parse( dataString ) )
     //for(let x = 3; x < 16; x+=4){
      //let firstPos = dataString.split('\"');
      //console.log(firstPos[x]);
    //}
    
    let firstPos = dataString.split('\"');
    const checker = firstPos[3].localeCompare('Paul Godinez');
    //console.log(checker)
    if(checker == 0){
        const today = new Date()
        const date = firstPos[15].split('/')
        let months = parseInt(date[0]) - today.getMonth() - 1
        let days = parseInt(date[1]) - today.getDate()
        const totalDays = months * 30 + days
        meetings.push({ 'name' : firstPos[7], 'location' : firstPos[11], 'date' : firstPos[15], 'daysTill' : totalDays})
      }
    //meetings.push({ 'name:' : firstPos[7], 'location' : firstPos[11], 'date' : firstPos[15]})
    //console.log(meetings)
    //console.log(JSON.stringify(meetings))
    // ... do something with the data here!!!
    //response.end(JSON.parse(JSON.stringify(meetings)))
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify(meetings))
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
}

//server.listen( process.env.PORT || port )
