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

// // POST attempt 01
// app.post('/submit', express.json(), (req, res) => {

//   // Add new player to database
//   collection.insertOne( req.body )


//   // Sort all plaryers in database and give them a rank

//   // Respond to client with full list of players in database
//   res.writeHead(200, { 'Content-Type': 'application/json' });
//   res.end(JSON.stringify(collection.find({}).toArray()));

// })

// working POST attempt 02
app.post('/submit', express.json(), async (req, res) => {
  try {
    // Add new player to the database
    await collection.insertOne(req.body);

    // Retrieve all players from the database
    const players = await collection.find({}).toArray();

    // Call rank players function here:
    rankPlayers(collection);

    // Respond to the client with a JSON string of players
    res.status(200).json(players);
  } catch (error) {
    // Handle error
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST attempt 02
// app.post('/submit', express.json(), async (req, res) => {
//   try {
//     // Add new player to the database
//     await collection.insertOne(req.body);

//     // Call rank players function here:
//     const rankedPlayers = rankPlayers(collection);

//     // Respond to the client with a JSON string of players
//     res.status(200).json(rankedPlayers);
//   } catch (error) {
//     // Handle error
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// // DELETE
// app.delete('/delete', express.json(), (req, res) => {
//     deletePlayer(playerList, req.body)
//     respond(res, playerList);
// })

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

// Rank Players sorts playerList and gives each player a rank
// function rankPlayers(playerList) {
//     playerList.sort((a, b) => (a.score < b.score) ? 1 : -1)
//     playerList.forEach((player, index) => {
//         player.rank = index + 1;
//     })
//     return playerList;
// }

// // progress Rank fxn for MongoDB
async function rankPlayers(collection) {
  try {
    // Retrieve all players from the database and sort them by score in descending order
    const sortedPlayers = await collection.find({}).sort({ score: -1 }).toArray();

    // Give each player a rank
    sortedPlayers.forEach((player, index) => {
      player.rank = index + 1;
    });
    

    // Return the sorted and ranked players
    return sortedPlayers;
  } catch (error) {
    throw error;
  }
}



// // Respond to client with playerList
// function respond(res, playerList) {
//     rankPlayers(playerList); // Rank players before sending to client
//     res.writeHead(200, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify(playerList));
// }
