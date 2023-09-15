//Node.js should be kept in downlaods since it is system-wide

//Require dotenv for environment variables locally
require('dotenv').config()

const express = require('express'), //Express.js is a Node.js framework
{MongoClient} = require("mongodb"),
app = express()
//Express will fully qualify (create the full paths) all paths to JS, CSS, and HTML files using the below middleware.
//Serves all GET requests for files located in public and views folder
app.use(express.static(__dirname + '/public/js/account')) //JS files must be served first. CSS files must be served second if there are any
app.use(express.static(__dirname + '/public/js/music'))
app.use(express.static(__dirname + '/views/html')) //HTML files served last
app.use(express.json()) //Body-parser middleware for all incoming requests that will only take action if data sent to the server is passed with a Content-Type header of application/json

//MongoDB Connection
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri)

//Password encryption:
//Password hashing is turning a password into alphanumeric letters using specific algorithms
//Bcrypt allows us to create a salt and use that salt with the password to create a hashed password.
//We really only need password hashing server-side, not needed on the client-side.
const bcrypt = require('bcrypt')

//Database connection:
//For a given logged-in user, only music data associated with that user should be queried and persisted to the correct database table.
//It is inefficient to query all users and associated music data at the start of each server session since this would add unecessary data to the project build when a server session is started up
//Design server code based on structure of music data determined in database FIRST. Do not design server code based on data structure determined server-side as querying from the database and then storing data server-side will not be as straightforward.

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("MusicListeningBuilder").collection("MusicListeningDataForEveryUser")
}
run()

app.use((req,res,next) => {
  if(collection !== null) {
    next()
  } else{
    res.status(503).end("Database collection is null")
  }
})

//Server Data structure:
//Const defines a constant reference to an array

//userData = {
// uIdentifier:
// username:
// password:
// musicListeningList array
//}

let userData = {}

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
  userData.username = users.find(u => u.username === req.body.username)
  console.log(userData.username)

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

app.post('/createNewUser', async (req, res) => { //Can put use of bcrypt as a technical achievement for 5 points
  
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

app.get('/getMusicData', (req, res) => { //
  res.writeHead(200, {'Content-Type': 'application/json'})

  if(isUserInMusicData()) {
    res.end(JSON.stringify(musicListeningDataForUser[getUserIndex()][user.username]))
  } else {
    res.end(JSON.stringify([]))
  }
  
})

//Music submission helper functions:

function countDuplicatesInUserMusicListeningData(dataObject) { // 
  
  let counter = 0

  if(getUserIndex() >= 0) {
    musicListeningDataForUser[getUserIndex()][user.username].forEach(d => {        
      console.log((d.bandName === dataObject.bandname) && (d.albumName === dataObject.albumname) && (d.releaseYear === dataObject.releaseyear))
        
      if(((d.bandName === dataObject.bandname) && (d.albumName === dataObject.albumname) && (d.releaseYear === dataObject.releaseyear))) {
        counter++
      }
    })
  }

  return counter
}

function getDerivedAlbumAge(dataObject) { //
  const currentYear = 2023
  const albumReleaseYear = parseInt(dataObject.releaseyear)
  const albumAge = currentYear - albumReleaseYear

  return albumAge
}

//[{'luke': [{'ID': 0, 'bandName': 'D', 'albumName': 'D', 'releaseYear': '2001', 'albumAge': 22},
//{'ID': 1, 'bandName': 'A', 'albumName': 'A', 'releaseYear': '2002', 'albumAge': 21},
//{'ID': 2, 'bandName': 'B', 'albumName': 'B', 'releaseYear': '2003', 'albumAge': 20}]}]

function assignIDAndAdd(dataObject, albumAge) { //
  console.log(dataObject) //JSON.parse converts a JSON string into an object. To access object members, use the member names that make up the JSON.
  
  if(isUserInMusicData()) {

    if(getUserIndex() >= 0 && Object.values(musicListeningDataForUser[getUserIndex()]).length === 0) {
      musicListeningDataForUser[getUserIndex()][user.username].push({'ID': 0, 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': albumAge})
    } else {
      musicListeningDataForUser[getUserIndex()][user.username].push({'ID': ((musicListeningDataForUser[getUserIndex()][user.username].ID) + 1), 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': albumAge})
    }

  } else {
    console.log("About to push first object for user")
    musicListeningDataForUser.push({[user.username]: [{'ID': 0, 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': albumAge}]})
    console.log(musicListeningDataForUser)
    console.log(getUserIndex())
  }
}

//Music deletion helper functions:

function searchAndDelete(dataObject) { //

  musicListeningDataForUser[getUserIndex()][user.username].forEach(d => {
    if(((d.bandName === dataObject.bandname) && (d.albumName === dataObject.albumname) && (d.releaseYear === dataObject.releaseyear))) {
      let currentIndex = musicListeningDataForUser[getUserIndex()][user.username].indexOf(d)
      musicListeningDataForUser[getUserIndex()][user.username].splice(currentIndex, 1)
      console.log("Music previously at index " + currentIndex + " has been removed from musicListeningData for user " + user.username)
    }
  })

}

//Music modification helper functions:

function searchAndUpdate(dataObject) { //

  const IDToNumber = parseInt(dataObject.ID)
  let foundMatch = false

  console.log(typeof(IDToNumber))
  console.log(IDToNumber)

  musicListeningDataForEveryUser[getUserIndex()][user.username].forEach(d => {
    if(IDToNumber === d.ID) {
      musicListeningDataForEveryUser[getUserIndex()][user.username].splice(musicListeningDataForEveryUser[getUserIndex()][user.username].indexOf(d), 1, {'ID': IDToNumber, 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': getDerivedAlbumAge(dataObject)})
      foundMatch = true
    }
  })

  if(foundMatch === false) {
    console.log("No ID in musicListeningData for user " + user.username + " matches the ID of the input object.")
  }

  console.log(musicListeningDataForEveryUser[getUserIndex()][user.username])
}

app.post('/submitForAddition', (req, res) => { //
     
  const dataObject = req.body
    
  if(countDuplicatesInUserMusicListeningData(dataObject) === 0) { //
    console.log("0 duplicates")
    assignIDAndAdd(dataObject, getDerivedAlbumAge(dataObject)) //
  }

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(musicListeningDataForEveryUser[getUserIndex()][user.username]))
})

app.delete('/submitForDelete', (req, res) => { //
  
  const dataObject = req.body

  searchAndDelete(dataObject) //
  
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(musicListeningDataForEveryUser[getUserIndex()][user.username]))
})


app.put('/submitForModification', (req, res) => { //
  
  const dataObject = req.body

  searchAndUpdate(dataObject) //

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(musicListeningDataForEveryUser[getUserIndex()][user.username]))
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