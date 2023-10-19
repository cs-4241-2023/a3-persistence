
const express    = require('express'),
      server     = express(),
      { MongoClient, ObjectId } = require("mongodb"),
      PORT       = 3000

server.use( express.static( 'public' ) )
server.use( express.json() )
 
require('dotenv').config();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("InDanityA3Data").collection("bruh")
}

// route to get all docs
 server.get("/docs", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    res.json( docs )
  }
})

server.post( '/submit', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
})

server.post( '/delete', async (req,res) => {
  const result = await collection.deleteOne({ id:req.body.id })
  res.json( result )
})

server.post( '/update', async (req,res) => {
    const result = await collection.updateOne(
      { _id: new ObjectId( req.body._id ) },
      { $set:{ name:req.body.name } }
    )
  
    res.json( result )
})

run()
server.listen( 3000 )
console.log('server started...')