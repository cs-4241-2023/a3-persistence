'use strict';
const express = require('express');
const app = express();
const { MongoClient } = require("mongodb");
const PORT = process.env.PORT || 3000;

require('dotenv').config()

app.use(express.static('public')) // Static files from public directory
app.use(express.json()) // For parsing application/json

const uri = `mongodb+srv://${process.env.TESTER}:${process.env.PASS}@${process.env.HOST}`

const client = new MongoClient(uri);
let collection = undefined;

// Set collection global value with database
async function run() {
  await client.connect()
  collection = client.db("testA3").collection("testList")
}
run();

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

// POST works to add rank in mongodb
// app.post('/submit', express.json(), async (req, res) => {
//   try {
//     // Add new player to the database
//     await collection.insertOne(req.body);

//     // Retrieve all players from the database and sort them by score in descending order
//     const players = await collection.find({}).sort({ score: -1 }).toArray();

//     // Assign ranks to players based on their position in the sorted list
//     players.forEach((player, index) => {
//       player.rank = index + 1;
//     });

//     // Update the rank for each player in the database (optional)
//     players.forEach(async (player) => {
//       await collection.updateOne({ _id: player._id }, { $set: { rank: player.rank } });
//     });

//     // Respond to the client with a JSON string of players
//     res.status(200).json(players);
//   } catch (error) {
//     // Handle error
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// CLEANER ATTEMPT POST 
app.post('/submit', express.json(), async (req, res) => {
    await collection.insertOne(req.body); // Add new player to the database
    await updatePlayersAndRespond(res);
});

// DELETE
// app.delete('/delete', express.json(), async (req, res) => {
//   try {
//     const playerName = req.body.name;

//     // Use MongoDB's deleteOne method to remove the player by name
//     await collection.deleteOne({ name: playerName });

//     // Retrieve all players from the database and sort them by score in descending order
//     const players = await collection.find({}).sort({ score: -1 }).toArray();

//     // Assign ranks to players based on their position in the sorted list
//     players.forEach((player, index) => {
//       player.rank = index + 1;
//     });

//     // Update the rank for each player in the database 
//     players.forEach(async (player) => {
//       await collection.updateOne({ _id: player._id }, { $set: { rank: player.rank } });
//     });
//     res.status(200).json(players);
//   } catch (error) {
//     // Handle error
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// DELETE CLEAN ATTEMPT
app.delete('/delete', express.json(), async (req, res) => {
    const playerName = req.body.name;
    // Use MongoDB's deleteOne method to remove the player by name
    await collection.deleteOne({ name: playerName });
    await updatePlayersAndRespond(res);
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

async function updatePlayersAndRespond(res) {
  try {
    // Retrieve all players from the database and sort them by score in descending order
    const players = await collection.find({}).sort({ score: -1 }).toArray();

    // Assign ranks to players based on their position in the sorted list
    players.forEach((player, index) => {
      player.rank = index + 1;
    });

    // Update the rank for each player in the database (optional)
    const updatePromises = players.map(async (player) => {
      await collection.updateOne({ _id: player._id }, { $set: { rank: player.rank } });
    });

    await Promise.all(updatePromises);

    // Respond to the client with a JSON string of players
    res.status(200).json(players);
  } catch (error) {
    // Handle error
    res.status(500).json({ error: 'Internal server error' });
  }
}
