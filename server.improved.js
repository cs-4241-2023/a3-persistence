const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const uri = 'mongodb+srv://aszadaphiya:aarsh@a3-aarshzadaphiya.rnuxw22.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient( uri )
const bcrypt = require('bcrypt');  
let collection = null

const dbConnect = async function() {
  await client.connect()
  collection = await client.db("a3").collection("Users")
 
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    } 
  })
 
  app.post("/login", async (req, res) => {
    try{
      const hashedPassword = await bcrypt.hash(req.body.password, 10)

      const username= req.body.username;
    const password = req.body.password;
    console.log(req.body)  
    const query = {$and: [{username: username, password: password}]}
    const user = await collection.findOne(query);
  
    if (user !== null) {    
      res.sendFile(__dirname + '/public/bmi.html');
    } else {
      res.status(401).json({ success: false, message: "Login failed" });
    }
    } catch {
      res.status(500).send()  
    }
    
  });
  
}

dbConnect()

app.listen(3000)