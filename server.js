const express = require('express'),
  {MongoClient, ObjectId} = require('mongodb'),
  app = express(),
  mime = require( 'mime' ),
  dir  = 'public/',
  port = 3000

app.use(express.static('./'))
app.use(express.json())

process.env.USER
process.env.PASS

const url = `mongodb+srv://${process.env.USER}:${process.env.PASS}@a3-nsadlier.msxvlam.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient( url )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("A3").collection("Accounts")
}

run()

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post("/info", async (req, res) => {
  const account = await collection.find({ user: { $eq: req.body.user } }).toArray()
  res.json( account )
})

app.post( '/login', async (req,res) => {
  const result = null
  const account = await collection.find({ user: { $eq: req.body.user } }).toArray()
  if (account.length == 0) {
    const result = await collection.insertOne(req.body)
    const account = await collection.find({ user: { $eq: req.body.user } }).toArray()
    res.json( account[0] )
  } else {
    if (account[0].pass == req.body.pass) {
      res.json( account[0] )
    } else {
      res.sendStatus(401)
    }
  }  
})

app.post("/add", async (req, res) => {
  collection.updateOne({ user: { $eq: req.body.user } }, {$push: {projects: req.body.name}})
  const account = await collection.find({ user: { $eq: req.body.user } }).toArray()
  res.json( account )
})

app.post("/remove", async (req, res) => {
  const account = await collection.find({ user: { $eq: req.body.user } }).toArray()
  var index = account[0].projects.indexOf(req.body.name)
  if (index !== -1) {
    account[0].projects.splice(index, 1)
    collection.updateOne({ user: { $eq: req.body.user } }, {$set: {projects: account[0].projects}})
  }
  const account2 = await collection.find({ user: { $eq: req.body.user } }).toArray()
  res.json( account2 )
})

app.post("/update", async (req, res) => {
  const account = await collection.find({ user: { $eq: req.body.user } }).toArray()
  var index = account[0].projects.indexOf(req.body.name)
  if (index !== -1) {
    account[0].projects[index] = req.body.new
    collection.updateOne({ user: { $eq: req.body.user } }, {$set: {projects: account[0].projects}})
  }
  const account2 = await collection.find({ user: { $eq: req.body.user } }).toArray()
  res.json( account2 )
})

// collection.updateOne({ user: { $eq: req.body.user } },
//                     {$push: {projects: 'test'}})

// app.post( '/remove', async (req,res) => {
//   const result = await collection.deleteOne({ 
//     _id:new ObjectId( req.body._id ) 
//   })
  
//   res.json( result )
// })

// app.post( '/update', async (req,res) => {
//   const result = await collection.updateOne(
//     { _id: new ObjectId( req.body._id ) },
//     { $set:{ name:req.body.name } }
//   )

//   res.json( result )
// })

app.use( express.static('public') )

app.listen(port)
