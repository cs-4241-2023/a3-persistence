// server
const express = require("express"),
  { MongoClient, ObjectId } = require("mongodb"),
  app = express(),
  playlists = [
    { season: "fall", title: "1901", artist: "Phoenix", length: "2:00" },
  ];

app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.il1hxgz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

let collection = null;

async function run() {
  //debugger;
  await client.connect();
  collection = await client.db("a3-database").collection("playlists");
}

app.use((req, res, next) => {
  if (collection !== null) {
    next();
  } else {
    res.status(503).send();
  }
});

//calling run
run();

app.post( '/submit', async (req,res) => {
  const length = req.body.length;
  const minutes = Math.floor(length / 60).toString();

  const seconds = (length % 60).toString();

  let finalTime = "";

  if (seconds < 10) {
    finalTime = minutes + ":0" + seconds;
  } else {
    finalTime = minutes + ":" + seconds;
  }

  req.body.length = finalTime;
  const result = await collection.insertOne( req.body )

  const playlistData = await client.db("a3-database").collection("playlists").find().toArray();
  
  res.status(200).json(playlistData);
  
})


app.post("/remove", async (req, res) => {
  
  const { id } = req.body
  const query = { _id: new ObjectId(id) }

  const collection = client.db("a3-database").collection("playlists");
  let result = await collection.deleteOne(query);
  
  const playlistData = await client.db("a3-database").collection("playlists").find().toArray();
  
  res.status(200).json(playlistData);
  
});

app.listen(process.env.PORT);
