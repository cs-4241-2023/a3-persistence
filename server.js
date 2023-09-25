require('dotenv').config();

const express = require("express"),
      { MongoClient, ServerApiVersion, ObjectId} = require("mongodb"),
      cookie = require("cookie-session"),
      app = express()

app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());

app.use(cookie({
  name: 'session',
  keys: ["key1", "key2", "key3"]
}))




const uri = 'mongodb+srv://' + process.env.MONGO_USER +':'+ process.env.MONGO_PASS +'@cluster0.q6euyls.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp';
const client = new MongoClient( uri , { 
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

const bcrypt = require('bcrypt');
const saltRounds = 12;


let collection = null;
let users = null;


async function run() {
  await client.connect()
  collection = await client.db("Assignment3").collection("gameData");
  users = await client.db("Assignment3").collection("users");
}
run()

//check connection
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status(503).send()
  }
})

app.get( '/reset', async (req,res) => {
  const result = await users.updateOne(
    {},
    { $set: { currentUser: "" } }
  );
  res.json(result);
})

app.post( '/login', async (req,res) => {
  const user = req.body.username;
  const pass = req.body.password;

  const userExists = await users.findOne({user: user});
  if (userExists) {
    if (await bcrypt.compare(pass, userExists.pass)) {
      const result = await users.updateOne(
        { currentUser: "" },
        { $set: { currentUser: user } }
      );
      res.json(result);
    }
    else{
      res.json(null);
    }
  }
  else {
    res.json(null);
  }
})

app.post( '/register', async (req,res) => {
  const user = req.body.username;
  const oldpass = req.body.password;

  const userExists = await users.findOne({user: user});
  if (userExists) {
    res.json(null);
  }
  else {
    const pass = await bcrypt.hash(oldpass, saltRounds);
    const newUser = {user,pass}
    const adding = await users.insertOne(newUser);
    if (adding) {
      const result = await users.updateOne(
        {},
        { $set: { currentUser: user } }
      );
      res.json(result);
    }
  }
})



app.get("/json", async (req, res) => {
  if (collection !== null) {
    const user = await users.findOne();
    const docs = await collection.find({user: user.currentUser}).toArray()
    res.json( docs )
  }
})

app.get("/user", async (req, res) => {
  const user = await users.findOne();
  res.json( user.currentUser )
})

//equivalent of handlePost
app.post( '/submit', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
})

app.delete( '/json', async (req,res) => {
  const result = await collection.deleteOne(
    req.body
  )
  
  res.json( result )
  });

//equivalent of handlePut
app.put( '/json', async (req,res) => {
  const result = await collection.updateOne(
    {
      user: req.body.user,
      game: req.body.game,
      highscore: req.body.highscore,
      notes: req.body.notes
    },
    [
      { $set: { game: req.body.ngame } },
      { $set: { highscore: req.body.nhighscore } },
      { $set: { notes: req.body.nnotes } }
    ]
  );
  res.json( result )

});


app.listen( process.env.PORT || 3000 );