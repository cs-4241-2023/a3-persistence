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
  collection = await client.db("testA3").collection("testList")
}

run()


// Middelware to check if link to collection has been created properly
// This way we don't have to check that database is connected in every route
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

// Prof's code to add a new doc to database in chrome dev tools
// const response = await fetch('/add', {
//   method:'POST',
//   headers:{'Content-Type': 'application/json'},
//   body: JSON.stringify({name:'charlie'})
// });
// const data = await response.json();
// console.log(data);


// Add a new doc to database
// app.post( '/submit', async (req,res) => {
//   const result = await collection.insertOne( req.body )
//   res.json( result )
// })


app.listen(3000)



// // List of Players on Server
// let playerList = [
//     { name: 'example-player', color: 'red', score: 0, rank: 0 }
// ]

// // GET
// app.get('/', (req, res) => res.send('Handled GET request'))

// // POST 
// app.post('/submit', express.json(), (req, res) => {
//     playerList.push(req.body) // Add player to  playerList 
//     respond(res, playerList);
// })

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

// // DELETE
// app.delete('/delete', express.json(), (req, res) => {
//     deletePlayer(playerList, req.body)
//     respond(res, playerList);
// })

app.delete('/delete', express.json(), async (req, res) => {
  try {
    const playerName = req.body.name;
    console.log(playerName);

    // // Use MongoDB's deleteOne method to remove the player by name
    const result = await collection.deleteOne({ name: playerName });

    if (result.deletedCount === 1) {
  //   //   // Player with the specified name has been deleted
  //   //   // You can also respond with a success message or updated player list here
  //   //   // Example: res.status(200).json({ message: 'Player deleted successfully' });
  //   //   // Retrieve all players from the database and respond with the updated list
      const players = await collection.find({}).toArray();
      res.status(200).json(players);
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  } catch (error) {
  //   // Handle error
    res.status(500).json({ error: 'Internal server error' });
  }
});


// // PUT
// app.put('/edit', express.json(), (req, res) => {
//     editPlayer(playerList, req.body)
//     respond(res, playerList);
// })

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running on Port ${PORT}`);
// });

// // Delete player function
// function deletePlayer(playerList, playerToDelete) {
//     playerList.forEach(player => {
//         if (playerToDelete.name === player.name) {
//             playerList.splice(playerList.indexOf(player), 1)
//         }
//     })
//     return playerList;
// }

// // Edit player function
// function editPlayer(playerList, playerToEdit) {
//     playerList.forEach(player => {
//         if (player.name === playerToEdit.name) {
//             player.name = playerToEdit.newName;
//         }
//     })
//     return playerList;
// }
