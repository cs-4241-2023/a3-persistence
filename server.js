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

//Server Data structure:
//Const defines a constant reference to an array

//userData = {
// usern: (string)
// passw: (string)
// musiclisteninglist (array)
//}

let userData = {}

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

//User data operations and helper functions:

async function verifyUniqueUsername(newUsername) { //
  
  const allUsers = await collection.find({}, {usern: 1, _id: 0}).toArray()

  let duplicateUsernameCounter = 0
  
  allUsers.forEach(u => {
    if(u.usern === newUsername) {
      duplicateUsernameCounter++
    }
  })

  return duplicateUsernameCounter
}

app.post('/userLogin', async (req, res) => { //
  
  userData = await collection.find(({usern: req.body.username},{_id: 0}))

  console.log(userData.usern)

  if(typeof userData.usern === 'undefined') {
    return res.status(400).end(JSON.stringify("UserNotFound")) //send function just sends the HTTP response.
  }

  try {
    if(await bcrypt.compare(req.body.password, userData.passw)) { //prevents timing attacks
      return res.end(JSON.stringify("SuccessfulLogin"))
    } else {
      return res.end(JSON.stringify("NoPasswordMatch")) //Convert value into JSON String
    }
  } catch {
    return res.status(500).end(JSON.stringify("InternalServerError")) //500 status indicates an internal server error
  }
})

app.post('/createNewUser', async (req, res) => { //Can put use of bcrypt as a technical achievement for 5 points
                                                        //
  if(verifyUniqueUsername(req.body.username) === 0) {
    
    try {
      const salt = await bcrypt.genSalt(10) //A salt is a random data that is used as an additional input to a one-way function that hashes data
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      
      console.log(salt)
      console.log(hashedPassword)
      
      await collection.insertOne({usern: req.body.username, passw: hashedPassword, musiclisteninglist: []})
      
      return res.status(201).end(JSON.stringify("SuccessfulUserCreation"))
    } catch {
      return res.status(500).end(JSON.stringify("ErrorCreatingNewUser"))
    }
  } else {
      return res.end(JSON.stringify("UsernameTakenByPreviousUserCreation"))
  }

})

//Music data CRUD operations

app.get('/getMusicData', async (req, res) => { //
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(userData.musiclisteninglist))
})

//Music submission helper functions:

function countDuplicatesInUserMusicListeningData(dataObject) { //
  
  let counter = 0
  
  userData.musiclisteninglist.forEach(d => {        
    console.log((d.bandName === dataObject.bandname) && (d.albumName === dataObject.albumname) && (d.releaseYear === dataObject.releaseyear))
        
    if(((d.bandName === dataObject.bandname) && (d.albumName === dataObject.albumname) && (d.releaseYear === dataObject.releaseyear))) {
      counter++
    }
  })
  
  return counter
}

function getDerivedAlbumAge(dataObject) { //
  const currentYear = 2023
  const albumReleaseYear = parseInt(dataObject.releaseyear)
  const albumAge = currentYear - albumReleaseYear

  return albumAge
}

function assignMusicIDAndAdd(dataObject, albumAge) { //
  console.log(dataObject) //JSON.parse converts a JSON string into an object. To access object members, use the member names that make up the JSON.
  
  if(userData.musiclisteninglist.length === 0) {
    userData.musiclisteninglist.push({'ID': 0, 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': albumAge})
  } else {
    userData.musiclisteninglist.push({'ID': (((userData.musiclisteninglist[userData.musiclisteninglist.length - 1]).ID) + 1), 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': albumAge})
  }
}

//Music deletion helper functions:

function searchAndDelete(dataObject) { //

  userData.musiclisteninglist.forEach(d => {
    if(((d.bandName === dataObject.bandname) && (d.albumName === dataObject.albumname) && (d.releaseYear === dataObject.releaseyear))) {
      let currentIndex = userData.musiclisteninglist.indexOf(d)
      userData.musiclisteninglist.splice(currentIndex, 1)
      console.log("Music previously at index " + currentIndex + " has been removed from musicListeningData for user " + userData.usern)
    }
  })

}

//Music modification helper functions:

function searchAndUpdate(dataObject) { //

  const IDToNumber = parseInt(dataObject.ID)
  let foundMatch = false

  console.log(typeof(IDToNumber))
  console.log(IDToNumber)

  userData.musiclisteninglist.forEach(d => {
    if(IDToNumber === d.ID) {
      userData.musiclisteninglist.splice(userData.musiclisteninglist.indexOf(d), 1, {'ID': IDToNumber, 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': getDerivedAlbumAge(dataObject)})
      foundMatch = true
    }
  })

  if(foundMatch === false) {
    console.log("No ID in musicListeninglist for user " + userData.usern + " matches the ID of the input object.")
  }

  console.log(userData.musiclisteninglist)
}

app.post('/submitForAddition', async (req, res) => { //
     
  const dataObject = req.body
    
  if(countDuplicatesInUserMusicListeningData(dataObject) === 0) { 
    console.log("0 duplicates")
    assignMusicIDAndAdd(dataObject, getDerivedAlbumAge(dataObject)) 
    await collection.updateOne({usern: userData.usern}, {$set: {musiclisteninglist: userData.musiclisteninglist}})
  }

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(userData.musiclisteninglist))
})

app.delete('/submitForDelete', async (req, res) => { //
  
  const dataObject = req.body

  searchAndDelete(dataObject) 
  await collection.updateOne({usern: userData.usern}, {$set: {musiclisteninglist: userData.musiclisteninglist}})
  
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(userData.musiclisteninglist))
})


app.put('/submitForModification', async (req, res) => { //
  
  const dataObject = req.body

  searchAndUpdate(dataObject)
  await collection.updateOne({usern: userData.usern}, {$set: {musiclisteninglist: userData.musiclisteninglist}})

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(userData.musiclisteninglist))
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