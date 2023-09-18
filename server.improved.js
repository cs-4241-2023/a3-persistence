const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.json() )

require("dotenv").config()

//const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const uri = 'mongodb+srv://aszadaphiya:aarsh@a3-aarshzadaphiya.rnuxw22.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("a3-aarshzadaphiya").collection("User")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run()