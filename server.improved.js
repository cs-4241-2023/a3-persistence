const express = require('express'),
  { MongoClient, ObjectId } = require("mongodb"),
  app = express()

require('dotenv').config()
let last_updated = Date.now()


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.vfm3cn4.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = client.db("a3_persistence").collection("inventory")
}
run()


app.use( express.static( 'public' ) )
app.use( express.json() )

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.get( '/last_updated', (req, res) => {
  res.json({ last_updated })
})

app.get( '/data', async (req, res) => {
  const docs = await collection.find({}).toArray()
  res.json( docs )
})

app.post( '/add', async (req, res) => {
  const data = req.body
  data['total_value'] = parseFloat((data['amount'] * data['unit_value']).toFixed(2))
  await collection.insertOne( data )
  data['_id'] = data['_id']

  console.log('ADD:', data)
  last_updated = Date.now()

  res.json( data )
})

app.post( '/delete', async (req, res) => {
  const data = req.body
  const response = await collection.deleteOne( { _id: new ObjectId(data['_id']) } )

  if(response.deletedCount == 1) {
    res.status( 200 ).send()
    console.log('DELETE:', data)
    last_updated = Date.now()
  } else {
    console.log(`Delete Failed: ID not found. (${data['_id']})`)
    res.status( 412 ).send()
  }
})

app.post( '/modify', async (req, res) => {
  const data = req.body
  data['total_value'] = parseFloat((data['amount'] * data['unit_value']).toFixed(2))
  data['_id'] = new ObjectId(data['_id'])
  
  const response = await collection.replaceOne( { _id: data['_id'] }, data )
  
  if(response.modifiedCount == 1) {
    res.json( data )
    console.log('MODIFY:', data)
    last_updated = Date.now()
  } else {
    console.log(`Modify Failed: ID not found. (${data['_id']})`)
    res.status( 412 ).send()
  }
})

app.listen( process.env.PORT || 3000 )
