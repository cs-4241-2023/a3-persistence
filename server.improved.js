'use strict'

// SERVER CODE

const http = require('http'), // http server core module
  fs = require('fs'), // needed for loading static files
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require('mime'), // mime to determine file type from file name extension
  dir = 'public/', // directory where static files are stored
  port = 3000 // 3000 is the port where the server is listening

// serverPlayerLog is the test data that is stored on server
let serverPlayerLog = [
  { name: 'example-player', color: 'red', score: 0, rank: 0 }
]

// Create http server
const server = http.createServer(function (request, response) {
  if (request.method === 'GET') { // client requests a resource
    handleGet(request, response)
  } else if (request.method === 'POST') { // client is adding data to server
    handlePost(request, response)
  } else if (request.method === 'DELETE') { // client is deleting data
    handleDelete(request, response)
  } else if (request.method === 'PUT') { // client is editing data
    handlePut(request, response)
  }
})

// GET: Client requests a resource
const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1)  // remove leading '/' from URL
  if (request.url === '/') {
    sendFile(response, 'public/index.html') // send index.html to client
  } else {
    sendFile(response, filename) // send requested file to client
  }
}

// POST: Client is adding data to server
const handlePost = function (request, response) {
  let clientDataString = ''
  request.on('data', function (data) { // add data to clientDataString as it comes in
    clientDataString += data
  })

  request.on('end', function () { // end when client is done sending data
    let clientData = {}
    clientData = JSON.parse(clientDataString) // parse clientDataString into JSON object

    let newPlayer = {
      name: clientData.name,
      color: clientData.color,
      score: clientData.score,
      rank: 0,
    }

    serverPlayerLog.push(newPlayer) // add new player to serverPlayerLog array

    // Sort serverPlayerLog by score and add rank to each player
    serverPlayerLog.sort((a, b) => (a.score < b.score) ? 1 : -1)
    serverPlayerLog.forEach((player, index) => {
      player.rank = index + 1;
    })

    response.writeHead(200, "OK", { 'Content-Type': 'text/json' }) // send response to client
    response.end(JSON.stringify(serverPlayerLog))
  })
}

// DELETE: Client is deleting data from server
const handleDelete = function (request, response) {
  let clientDataString = ''
  request.on('data', function (data) { // add data to clientDataString as it comes in
    clientDataString += data
  })

  request.on('end', function () { // end when client is done sending data

    let clientData = {}
    clientData = JSON.parse(clientDataString) // parse clientDataString into JSON object
    let playerToDelete = clientData;

    // Delete player from serverPlayerLog
    serverPlayerLog.forEach(player => {
      if (playerToDelete.name === player.name) {
        serverPlayerLog.splice(serverPlayerLog.indexOf(player), 1)
      }
    })

    // Sort serverPlayerLog by score
    serverPlayerLog.sort((a, b) => (a.score < b.score) ? 1 : -1)
    serverPlayerLog.forEach((player, index) => {
      player.rank = index + 1;
    })

    response.writeHead(200, "OK", { 'Content-Type': 'text/json' }) // send response to client
    response.end(JSON.stringify(serverPlayerLog))
  })
}

// PUT: Client is editing data on server
const handlePut = function (request, response) {

  let clientDataString = ''

  request.on('data', function (data) { // add data to clientDataString as it comes in
    clientDataString += data
  })

  request.on('end', function () { // end when client is done sending data
    let clientData = {}
    clientData = JSON.parse(clientDataString) // parse clientDataString into JSON object

    let playerToEdit = clientData.name;
    let newName = clientData.newName;

    // loop through serverPlayerLog and edit player with matching name
    serverPlayerLog.forEach(player => {
      if (playerToEdit === player.name) {
        player.name = newName;
      }
    })

    response.writeHead(200, "OK", { 'Content-Type': 'text/json' }) // send response to client
    response.end(JSON.stringify(serverPlayerLog))
  })

}

// Send file to client (called by handleGet when client requests a resource)
const sendFile = function (response, fileName) {
  const type = mime.getType(fileName);

  fs.readFile(fileName, function (err, content) {
    if (err === null) { // No error means file exists
      // status code: https://httpstatuses.com
      response.writeHeader(200, { 'Content-Type': type })
      response.end(content);
    } else {
      response.writeHeader(404);
      response.end('404 Error: File Not Found');
    }
  })
}

server.listen(process.env.PORT || port)

