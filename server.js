'use strict';
const express = require('express');
const app = express();
const { MongoClient } = require("mongodb");
const PORT = process.env.PORT || 3000;

require('dotenv').config()
// console.log(process.env) // remove this after you've confirmed it is working

app.use(express.static('public')) // Static files from public directory
app.use(express.json()) // For parsing application/json

const uri = `mongodb+srv://${process.env.TESTER}:${process.env.PASS}@${process.env.HOST}`
console.log("uri: " + uri);
// const uri = "mongodb+srv://tester0:pass0@cluster0.pt7vcfa.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";

const client = new MongoClient(uri)

let collection = null


async function run() {
  await client.connect()
  collection = client.db("testA3").collection("testList")
}

run()

// Start server
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});


// Database connection check middleware
app.use((req, res, next) => {
  if (collection !== null) {
    next()
  } else {
    res.status(503).send()
  }
})


// route to get all docs
app.get("/docs", async (req, res) => {
  const docs = await collection.find({}).toArray()
  // find is how you search the database
  res.json(docs)
})

// POST works to add rank in mongodb
app.post('/submit', express.json(), async (req, res) => {
  try {
    // Add new player to the database
    await collection.insertOne(req.body);

    // Retrieve all players from the database and sort them by score in descending order
    const players = await collection.find({}).sort({ score: -1 }).toArray();

    // Assign ranks to players based on their position in the sorted list
    players.forEach((player, index) => {
      player.rank = index + 1;
    });

    // Update the rank for each player in the database (optional)
    players.forEach(async (player) => {
      await collection.updateOne({ _id: player._id }, { $set: { rank: player.rank } });
    });

    // Respond to the client with a JSON string of players
    res.status(200).json(players);
  } catch (error) {
    // Handle error
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE
app.delete('/delete', express.json(), async (req, res) => {
  try {
    const playerName = req.body.name;

    // Use MongoDB's deleteOne method to remove the player by name
    await collection.deleteOne({ name: playerName });

    // Retrieve all players from the database and sort them by score in descending order
    const players = await collection.find({}).sort({ score: -1 }).toArray();

    // Assign ranks to players based on their position in the sorted list
    players.forEach((player, index) => {
      player.rank = index + 1;
    });

    // Update the rank for each player in the database 
    players.forEach(async (player) => {
      await collection.updateOne({ _id: player._id }, { $set: { rank: player.rank } });
    });
    res.status(200).json(players);
  } catch (error) {
    // Handle error
    res.status(500).json({ error: 'Internal server error' });
  }
});


// PUT
app.put('/edit', express.json(), async (req, res) => {
  try {
    const playerName = req.body.name;
    const newPlayerName = req.body.newName

    // Update the player's name in the MongoDB collection
    await collection.updateOne({ name: playerName } , { $set: {name: newPlayerName }});

   // Retrieve all players from the database and sort them by score in descending order
   const players = await collection.find({}).sort({ score: -1 }).toArray();

   // Assign ranks to players based on their position in the sorted list
   players.forEach((player, index) => {
     player.rank = index + 1;
   });

   // Update the rank for each player in the database 
   players.forEach(async (player) => {
     await collection.updateOne({ _id: player._id }, { $set: { rank: player.rank } });
   });
   res.status(200).json(players);
    
  } catch (error) {
    // Handle error
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});