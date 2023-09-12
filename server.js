const express = require('express'), //Express.js is a Node.js framework
app = express()
//Express will fully qualify (create the full paths) all paths to JS, CSS, and HTML files using the below middleware.
//Serves all GET requests for files located in public and views folder
app.use(express.static(__dirname + '/public/js')) //JS files must be served first. CSS files must be served second if there are any
app.use(express.static(__dirname + '/views/html')) //HTML files served last
app.use(express.json()) //Body-parser middleware for all incoming requests that will only take action if data sent to the server is passed with a Content-Type header of application/json

let musicListeningData = [
  {'ID' : 0, 'bandName': 'Dry Kill Logic', 'albumName': 'The Darker Side of Nonsense', 'releaseYear': '2001', 'albumAge': 22},
  {'ID' : 1, 'bandName': 'Dry Kill Logic', 'albumName': 'The Dead and Dreaming', 'releaseYear': '2004', 'albumAge': 19},
  {'ID' : 2, 'bandName': 'Killswitch Engage', 'albumName': 'Alive or Just Breathing', 'releaseYear': '2002', 'albumAge': 21} 
]

app.get('/getMusicData', (req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(musicListeningData))
})

//Music submission helper functions:

function countDuplicatesInMusicListeningData(dataObject) {  
  
  let counter = 0
  musicListeningData.forEach(d => {        
    console.log((d.bandName === dataObject.bandname) && (d.albumName === dataObject.albumname) && (d.releaseYear === dataObject.releaseyear))
    
    if(((d.bandName === dataObject.bandname) && (d.albumName === dataObject.albumname) && (d.releaseYear === dataObject.releaseyear))) {
      counter++
    }
  })

  return counter

}

function getDerivedAlbumAge(dataObject) {
  const currentYear = 2023
  const albumReleaseYear = parseInt(dataObject.releaseyear)
  const albumAge = currentYear - albumReleaseYear

  return albumAge
}

function assignIDAndAdd(dataObject, albumAge) {
  console.log(dataObject) //JSON.parse converts a JSON string into an object. To access object members, use the member names that make up the JSON.
  musicListeningData.push({'ID': (musicListeningData[musicListeningData.length - 1].ID + 1), 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': albumAge})
}

//Music deletion helper functions:

function searchAndDelete(dataObject) {

  musicListeningData.forEach(d => {
    if(((d.bandName === dataObject.bandname) && (d.albumName === dataObject.albumname) && (d.releaseYear === dataObject.releaseyear))) {
      let currentIndex = musicListeningData.indexOf(d)
      musicListeningData.splice(currentIndex, 1)
      console.log("Music previously at index " + currentIndex + " has been removed from musicListeningData")
    }
  })

}

//Music modification helper functions:

function searchAndUpdate(dataObject) {

  musicListeningData.forEach(d => {
    if(dataObject.ID === d.ID) {
      musicListeningData.splice(musicListeningData.indexOf(d), 1, {'ID': dataObject.ID, 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': getDerivedAlbumAge(dataObject)})
    }
    else {
      console.log("No ID in musicListeningData matches the ID of the input object.")
    }
  })
}

app.post('/submitForAddition', (req, res) => {
     
  const dataObject = req.body
    
  if(countDuplicatesInMusicListeningData(dataObject) === 0) {
    assignIDAndAdd(dataObject, getDerivedAlbumAge(dataObject))
  }

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(musicListeningData))
})

app.delete('/submitForDelete', (req, res) => {
  
  const dataObject = req.body

  searchAndDelete(dataObject)
  
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(musicListeningData))
})


app.put('/submitForModification', (req, res) => {
  
  const dataObject = req.body

  searchAndUpdate(dataObject)

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(musicListeningData))
})


app.listen(3000, () => {console.log('Server is running on port 3000')})

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