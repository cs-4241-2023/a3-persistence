const express = require('express'), //Express.js is a Node.js framework
app = express()

let musicListeningData = [
  {'bandName': 'Dry Kill Logic', 'albumName': 'The Darker Side of Nonsense', 'releaseYear': '2001', 'albumAge': 22},
  {'bandName': 'Dry Kill Logic', 'albumName': 'The Dead and Dreaming', 'releaseYear': '2004', 'albumAge': 19},
  {'bandName': 'Killswitch Engage', 'albumName': 'Alive or Just Breathing', 'releaseYear': '2002', 'albumAge': 21} 
]

app.use(express.static('public')) //Serves all GET requests for static files located in public folder
app.use(express.static('views')) //Serves all GET requests for static files located in views folder
app.use(express.json()) //Middleware function used to parse incoming JSON from HTTP requests

app.post('submitForAddition', express.json(), (req, res) => {
  musicListeningData.push(req.body)
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(musicListeningData))
})

app.delete('/submitForDelete', express.json(), (req, res) => {
  musicListeningData.push(req.body)
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(musicListeningData))
})

app.patch('/submit', express.json(), (req, res) => {
  musicListeningData.push(req.body)
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(musicListeningData))
})

app.listen(process.env.PORT)

//Personal notes:
//HTTP requests allow interaction between frontend and backend of websites
//There must be an interaction betwwen a server and client to modify data
//HTTP methods to request data allows us to perform CRUD operations on servers: POST, GET, PUT/PATCH, and DELETE.
//Every request includes an endpoint and a type of request being sent.
//The endpoint is the path between the client and server.
//Server sends back a response depending on the validity of the request
  //If the request is successful, the server sends back data in the form of JSON.
  //If the request fails, then an error message is sent back to the client.
  //Responses are associated with status codes:
    //A status code of 200 means that the request was successful.
//Client sends the request, server recieves the request.

//GET: GET Request is used to retrieve data from the server.
//POST: POST Request sends new data to the server as an object.
//PATCH: PATCH Request is used to update certain properties of an object.
//PUT: PUT Request updates all properties of an object.
//DELETE: DELETE Request deletes data from a server.