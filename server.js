const express = require('express'), //Express.js is a Node.js framework
app = express()
//Express will fully qualify (create the full paths) all paths to JS, CSS, and HTML files using the below middleware.
//Serves all GET requests for files located in public and views folder
app.use(express.static(__dirname + '/public/js/account')) //JS files must be served first. CSS files must be served second if there are any
app.use(express.static(__dirname + '/public/js/music'))
app.use(express.static(__dirname + '/views/html')) //HTML files served last
app.use(express.json()) //Body-parser middleware for all incoming requests that will only take action if data sent to the server is passed with a Content-Type header of application/json

//User Login/Creation Plan:
//1. Give user option to login or create account
//2. Store a list of objects where each object:
//   a. Contains a key: value pair of username: password
//   b. Contains an array of music associated with that username/password
//3. Display music for each user by grabbing the array of music in the list of objects associated with the logged-in user.
//4. Persist music data for the associated user to the MongoDB music table also associated with that user during each server session. 
//   a. Also need to persist all new created users to a table of users
//5. Server-side data and MongoDB data need to be the same by the end of server session:
    //At the start of each server session, all server-side data from a previous session is going to be wiped from the server.
    //And so at the start of each server session, all music data must be queried from MongoDB for the logged-in user and stored server-side.
    //During a session, all updates/deletes to/from server-side data must be immediately reflected in the MongoDB table associated with the logged-in user.


//Password encryption:
//Password hashing is turning a password into alphanumeric letters using specific algorithms
//Bcrypt allows us to create a salt and use that salt with the password to create a hashed password.
//We really only need password hashing server-side, not needed on the client-side.
const bcrypt = require('bcrypt')

//Server Data:
let musicListeningData = []
let users = []

//User data operations and helper functions:

function verifyUniqueUsername(newUsername) {
  
  let duplicateUsernameCounter = 0
  
  users.forEach(u => {
    if(u.username === newUsername) {
      duplicateUsernameCounter++
    }
  })

  return duplicateUsernameCounter
}

app.post('/userLogin', async (req, res) => {
  const user = users.find(u => u.username === req.body.username)
  console.log(user)

  if(typeof user === 'undefined') {
    return res.status(400).end(JSON.stringify("UserNotFound")) //send function just sends the HTTP response.
  }

  try {
    if(await bcrypt.compare(req.body.password, user.password)) { //prevents timing attacks
      return res.end(JSON.stringify("SuccessfulLogin"))
    } else {
      return res.end(JSON.stringify("NoPasswordMatch")) //Convert value into JSON String
    }
  } catch {
    return res.status(500).end(JSON.stringify("InternalServerError")) //500 status indicates an internal server error
  }
})

app.post('/createNewUser', async (req, res) => {
  
  if(verifyUniqueUsername(req.body.username) === 0) {
    
    try {
      const salt = await bcrypt.genSalt(10) //A salt is a random data that is used as an additional input to a one-way function that hashes data
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      
      console.log(salt)
      console.log(hashedPassword)
      
      const newUser = {username: req.body.username, password: hashedPassword}
      users.push(newUser)
      return res.status(201).end(JSON.stringify("SuccessfulUserCreation"))
    } catch {
      return res.status(500).end(JSON.stringify("ErrorCreatingNewUser"))
    }
  } else {
      return res.end(JSON.stringify("UsernameTakenByPreviousUserCreation"))
  }

})

//Music data CRUD operations

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
  
  if(musicListeningData.length === 0) {
    musicListeningData.push({'ID': 0, 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': albumAge})
  } else {
    musicListeningData.push({'ID': (musicListeningData[musicListeningData.length - 1].ID + 1), 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': albumAge})
  }
  
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

  const IDToNumber = parseInt(dataObject.ID)
  let foundMatch = false

  console.log(typeof(IDToNumber))
  console.log(IDToNumber)

  musicListeningData.forEach(d => {
    if(IDToNumber === d.ID) {
      musicListeningData.splice(musicListeningData.indexOf(d), 1, {'ID': IDToNumber, 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': getDerivedAlbumAge(dataObject)})
      foundMatch = true
    }
  })

  if(foundMatch === false) {
    console.log("No ID in musicListeningData matches the ID of the input object.")
  }

  console.log(musicListeningData)
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