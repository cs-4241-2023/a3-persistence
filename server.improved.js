const express = require("express"),
      { MongoClient } = require("mongodb"),
      app = express()

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) ) 
app.use(express.static("./") )
app.use(express.json() )

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.bwtfi1j.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")
}
run()

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})


app.get("/docs", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    res.json( docs )
  }
})

app.post("/login", async (req, res) => {
    const docs = await collection.find({newUsername:req.body.username, newPassword:req.body.password}).toArray()
    res.json(docs);
  console.log(docs);
})

app.post( '/submit', async (req,res) => {
  const result = await collection.insertOne( req.body )
  const docs = await collection.find({}).toArray()
  res.json( docs )
})

app.post( '/create', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
  console.log(result);
  
})

app.post( '/delete', async (req,res) => {
  const result = await collection.deleteOne({
    mTitle: req.body.mTitle,
    mYear: req.body.mYear
  })
  const docs = await collection.find({}).toArray()
  res.json( docs )
})

app.post( '/modify', async (req, res) => {
  const result = await collection.updateOne({
    mTitle: req.body.mTitle
  },
    {
    $set: { mLength: req.body.mLength, mYear: req.body.mYear}
  })
  const docs = await collection.find({}).toArray()
  res.json(docs)
})

app.listen(3000);
