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

const client = new MongoClient( uri )

let collection = null


async function run() {
    await client.connect()
    collection = await client.db("testA3").collection("testList")
  
    // route to get all docs
    app.get("/docs", async (req, res) => {
      if (collection !== null) {
        const docs = await collection.find({}).toArray()
        res.json( docs )
      }
    })
  }
  
  run()
  
  app.listen(3000)

  app.use( (req,res,next) => {
    if( collection !== null ) {
      next()
    }else{
      res.status( 503 ).send()
    }
  })

  app.post( '/add', async (req,res) => {
    const result = await collection.insertOne( req.body )
    console.log( 'Req.body: ' + req.body );

    res.json( result )
    console.log( 'Result: ' + result );
  })







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

// // Rank Players sorts playerList and gives each player a rank
// function rankPlayers(playerList) {
//     playerList.sort((a, b) => (a.score < b.score) ? 1 : -1)
//     playerList.forEach((player, index) => {
//         player.rank = index + 1;
//     })
//     return playerList;
// }

// // Respond to client with playerList
// function respond(res, playerList) {
//     rankPlayers(playerList); // Rank players before sending to client
//     res.writeHead(200, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify(playerList));
// }
