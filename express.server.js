'use strict';
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public')) // Static files from public directory
app.use(express.json()) // for parsing application/json

// List of Players on Server
let playerList = [
    { name: 'example-player', color: 'red', score: 0, rank: 0 }
]

// GET
app.get('/', (req, res) => res.send('Handled GET request'))

// POST 
app.post('/submit', express.json(), (req, res) => {
    playerList.push(req.body) // Add player to  playerList 
    respond(res, playerList);
})

// DELETE
app.delete('/delete', express.json(), (req, res) => {
    deletePlayer(playerList, req.body)
    respond(res, playerList);
})

// PUT
app.put('/edit', express.json(), (req, res) => {
    editPlayer(playerList, req.body)
    respond(res, playerList);
})

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});

// Rank Players sort  playerList and gives each player a rank
function rankPlayers(playerList) {
    playerList.sort((a, b) => (a.score < b.score) ? 1 : -1)
    playerList.forEach((player, index) => {
        player.rank = index + 1;
    })
    return playerList;
}

// Send response json to client
function sendResponse(res, data) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

// respondToClient function
function respond(res, playerList) {
    rankPlayers(playerList);
    sendResponse(res, playerList);
}

// Delete player function
function deletePlayer(playerList, playerToDelete) {
    playerList.forEach(player => {
        if (playerToDelete.name === player.name) {
            playerList.splice(playerList.indexOf(player), 1)
        }
    })
    return playerList;
}

// Edit player function
function editPlayer(playerList, playerToEdit) {
    playerList.forEach(player => {
        if (player.name === playerToEdit.name) {
            player.name = playerToEdit.newName;
        }
    })
    return playerList;
}
