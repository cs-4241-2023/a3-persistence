const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.json() )

require("dotenv").config()

//port: process.env.PORT || 3000

//const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const uri = 'mongodb+srv://aszadaphiya:aarsh@a3-aarshzadaphiya.rnuxw22.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("a3").collection("Users")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

app.post("/login", async (req, res) => {
  const username= req.body.username;
  const password = req.body.password;
  const user = await collection.findOne({username : username },{ password: password });

  if (user) {
   //res.json({ success: true, message: "Login successful" });
   console.log("Login successful")
    res.redirect('/public/bmi.html');
  } else {
    res.status(401).json({ success: false, message: "Login failed" });
  }
});


app.listen(3000)

run()