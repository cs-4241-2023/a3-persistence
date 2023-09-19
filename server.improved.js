require('dotenv').config()
// server (express code)
const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express(),
      appdata = [
        {'yourname': 'Justin', 'username': 'Sombero', 'email': 'jwonoski2@wpi.edu', 'position': 'DPS'},
        {'yourname': 'Mason', 'username': 'Sneke', 'email': 'mSneke@wpi.edu', 'position': 'Support'},
        {'yourname': 'Tim', 'username': 'Robo', 'email': 'tRobo@wpi.edu', 'position': 'Tank'} 
      ]

      app.use( express.static( 'public' ) )
      app.use( express.static( 'views'  ) )
      app.use( express.json() )      

app.get( '/get',express.json(), ( req, res ) => {
  res.status( 200 ).json(appdata)
})

app.post( '/submit', express.json(), ( req, res ) => {
  // our request object now has a 'json' field in it from our previous middleware
  console.log( req.body )
  appdata.push( req.body )  
  res.writeHead( 200, { 'Content-Type': 'application/json'})
  res.end( req.json )
})

app.delete( '/delete', express.json(), ( req, res ) => {
    //This deserves to be pee. Don't debate with me.
    const pee = req.body
    const num = Number(pee.index)
    console.log(num)
      appdata.splice(num, 1)
  
  res.status( 200 ).json(appdata)
})

app.put( '/edit', express.json(),( req, res ) => {
  const playerinfo = req.body
  const index = playerinfo.index
    appdata[index] = playerinfo.playerdata
  res.status( 200 ).json(appdata)
});


const listener = app.listen( process.env.PORT || 3000 )

//MongoDB Database Code:

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  //Replace datatest and test with our own from MongoDB
  collection = await client.db("Users").collection("users")

  app.use( (req,res,next) => {
    if( collection !== null ) {
      next()
    }else{
      res.status( 503 ).send()
    }
  })

  run()


  // route to get all docs
  app.get("/docs", async (req, res) => {
      const docs = await collection.find({}).toArray()
      res.json( docs )
  })
}

app.post( '/add', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/remove', async (req,res) => {
  const result = await collection.deleteOne({ 
    _id:new ObjectId( req.body._id ) 
  })
  
  res.json( result )
})

app.post( '/update', async (req,res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId( req.body._id ) },
    { $set:{ name:req.body.name } }
  )

  res.json( result )
})

app.listen(3000)
