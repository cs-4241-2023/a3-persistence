
// server (express code)
const express = require('express'),
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

const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      db = express()

db.use(express.static("public") )
db.use(express.json() )

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")

  // route to get all docs
  db.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run()

db.listen(3000)
