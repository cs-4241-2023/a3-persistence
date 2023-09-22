//Node.js should be kept in downlaods since it is system-wide

//Require dotenv for environment variables locally
require('dotenv').config()

const express = require('express'), //Express.js is a Node.js framework
      cookie = require('cookie-session'),
      hbs = require('express-handlebars').engine,
      {MongoClient} = require('mongodb'),
      app = express()
//Express will fully qualify (create the full paths) all paths to JS, CSS, and HTML files using the below middleware.
//Serves all GET requests for files located in public and views folder
app.use(express.static(__dirname + '/public/js/music'))
app.use(express.static(__dirname + '/views/html')) //HTML files served last
app.use(express.json()) //Body-parser middleware for all incoming requests that will only take action if data sent to the server is passed with a Content-Type header of application/json

//Need to setup and configure the express app engine to use handlebars below:
//use express.urlencoded({extended: true}) to get data sent by defaut form actions or GET requests
app.use(express.urlencoded({extended: true}))
app.engine('handlebars',
  hbs({ //hbs configuration for app.engine
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: "views/html/layouts/"
  })
)
app.set('view engine', 'handlebars')
app.set('views', './views/html')

app.get('/', (req, res) => { //Express cannot handle '/' using the middleware above since index.handlebars does not use the HTML file extension. So we need to specify another middleware here to intercept "/" and redirect the browser to index, which the express app engine recognizes.
  res.render('index')
})

//Cookie middleware; the keys are used for encrypting the username and password submitted in login and user creation forms
app.use(cookie({
  name: 'session', //the name of the cookie to set
  keys: ['key1', 'key2', 'key3', 'key4'] //The list of keys to use to sign & verify cookie values. Set cookies are always signed with keys[0], while the other keys are valid for verification, allowing for key rotation.
}))

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

async function run() { //
  await client.connect()
  collection = await client.db("MusicListeningBuilder").collection("MusicListeningDataForEveryUser")
}
run()

app.use((req, res, next) => { //
  if(collection !== null) {
    console.log("Collection has been assigned.")
    next() //The next() function is a function in the Express router that, when invoked, executes the next middleware in the middleware stack. If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.
  }else{
    console.log("Collection is null.") //Middleware stack stops at this point
  }
})

//User data operations and helper functions:

//Server-side form validation for username and password

function userInputHasMissingField(un, pw) {
  if(un.trim().length === 0 || pw.trim().length === 0) {
    return true;
  } else {
    return false;
  }
}

function getFirstIndexOfWhiteSpaceInString(inputString) { //The indexOf() method returns the position of the first occurrence of a value in a string.
  return inputString.indexOf(' ')
}

function userInputHasWhiteSpace(un, pw) {
  if(getFirstIndexOfWhiteSpaceInString(un) >= 0 || getFirstIndexOfWhiteSpaceInString(pw) >= 0) {
    return true;
  } else {
    return false;
  }
}

function verifyUniqueUsername(newUsername, users) { //
  
  let duplicateUsernameCounter = 0
  
  console.log(users)
  console.log(newUsername)
  console.log(typeof(users))

  if(users.length !== 0) {
    users.forEach(u => {
      if(u.usern === newUsername) {
        duplicateUsernameCounter++
      }
    })
  }
  
  console.log(duplicateUsernameCounter)

  return duplicateUsernameCounter
}

//Express HTTP Middleware

app.post('/createNewUser', async (req, res) => { //Can put use of bcrypt as a technical achievement for 5 points //
       
  const allUsers = await collection.find({}, {usern: 1, _id: 0}).toArray() 
  
  if(userInputHasMissingField(req.body.newusername, req.body.newuserpassword)) {
    return res.render('index', {accountCreationMessage: `<strong>The new account information you submitted cannot be saved</strong>: Missing information in at least one input field.`, layout: false})
  }
  else if(userInputHasWhiteSpace(req.body.newusername, req.body.newuserpassword)) {
    return res.render('index', {accountCreationMessage:  `<strong>The new account information you submitted cannot be saved</strong>: Both the username and password cannot contain any whitespace.`, layout: false})
  }
  else if(verifyUniqueUsername(req.body.newusername, allUsers) === 0) {
    try {
      const salt = await bcrypt.genSalt(10) //A salt is a random data that is used as an additional input to a one-way function that hashes data
      const hashedPassword = await bcrypt.hash(req.body.newuserpassword, salt)
      
      console.log(salt)
      console.log(hashedPassword)
      
      await collection.insertOne({usern: req.body.newusername, passw: hashedPassword, musiclisteninglist: []})
      
      return res.status(201).render('index', {accountCreationMessage: `<strong>Your account has been successfully created</strong>. Now login with your new username and password to access Music Listening Builder features.`, layout: false})
    } catch {
      return res.status(500).render('index', {accountCreationMessage: `<strong>There was a server error that prevented the creation of a new account for you</strong>.`, layout: false})
    }
  } else {
      return res.render('index', {accountCreationMessage: `<strong>Your account could not be created as there is already a Music Listening Builder user with the same username as the one you entered. Choose a different username</strong>.`, layout: false})
  }

})

app.post('/userLogin', async (req, res) => { //
  
  if(userInputHasMissingField(req.body.username, req.body.password)) {
    return res.render('index', {loginStatusMessage: `<strong>The login information you submitted cannot be saved</strong>: Missing information in at least one input field.`, layout: false})
  }
  else if(userInputHasWhiteSpace(req.body.username, req.body.password)) {
    return res.render('index', {loginStatusMessage:  `<strong>The login information you submitted cannot be saved</strong>: Both the username and password cannot contain any whitespace.`, layout: false})
  } else {
    userData = await collection.find({usern: req.body.username}).toArray()

    if(typeof userData !== undefined && userData.length === 0) {
      return res.status(404).render('index', {loginStatusMessage: `<strong>User not found</strong>.`, layout: false})
    }

    try {
      if(await bcrypt.compare(req.body.password, userData[0].passw)) { //prevents timing attacks
        req.session.login = true
        return res.redirect('build_music_listening_list.html')
      } else {
        req.session.login = false
        return res.render('index', {loginStatusMessage: `<strong>Incorrect password entered for user </strong> ${req.body.username}.`, layout: false})
      }
    } catch {
      return res.status(500).render('index', {loginStatusMessage: `<strong>There was an internal server error that prevented successful login</strong>.`, layout: false}) //500 status indicates an internal server error
    }
  }
})

//Send unauthenticated users back to login page.
app.use(function(req, res, next) {
  if(req.session.login === true)
    next()
  else
    res.redirect('index')
})

//Music data CRUD operations and helper functions

app.get('/getMusicData', (req, res) => { //
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(userData[0].musiclisteninglist))
})

//Music submission helper functions:

function countDuplicatesInUserMusicListeningData(dataObject) { //
  
  let counter = 0
  
  userData[0].musiclisteninglist.forEach(d => {        
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
  
  if(userData[0].musiclisteninglist.length === 0) {
    userData[0].musiclisteninglist.push({'ID': 0, 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': albumAge})
  } else {
    userData[0].musiclisteninglist.push({'ID': (((userData[0].musiclisteninglist[userData[0].musiclisteninglist.length - 1]).ID) + 1), 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': albumAge})
  }
}

//Music deletion helper functions:

function searchAndDelete(dataObject) { //

  userData[0].musiclisteninglist.forEach(d => {
    if(((d.bandName === dataObject.bandname) && (d.albumName === dataObject.albumname) && (d.releaseYear === dataObject.releaseyear))) {
      let currentIndex = userData[0].musiclisteninglist.indexOf(d)
      userData[0].musiclisteninglist.splice(currentIndex, 1)
      console.log("Music previously at index " + currentIndex + " has been removed from musicListeningData for user " + userData[0].usern)
    }
  })

}

//Music modification helper functions:

function searchAndUpdate(dataObject) { //

  const IDToNumber = parseInt(dataObject.ID)
  let foundMatch = false

  console.log(typeof(IDToNumber))
  console.log(IDToNumber)

  userData[0].musiclisteninglist.forEach(d => {
    if(IDToNumber === d.ID) {
      userData[0].musiclisteninglist.splice(userData[0].musiclisteninglist.indexOf(d), 1, {'ID': IDToNumber, 'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': getDerivedAlbumAge(dataObject)})
      foundMatch = true
    }
  })

  if(foundMatch === false) {
    console.log("No ID in musicListeninglist for user " + userData[0].usern + " matches the ID of the input object.")
  }

  console.log(userData[0].musiclisteninglist)
}

app.post('/submitForAddition', async (req, res) => { //
     
  const dataObject = req.body
    
  if(countDuplicatesInUserMusicListeningData(dataObject) === 0) { 
    console.log("0 duplicates")
    assignMusicIDAndAdd(dataObject, getDerivedAlbumAge(dataObject)) 
    await collection.updateOne({usern: userData[0].usern}, {$set: {musiclisteninglist: userData[0].musiclisteninglist}})
  }

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(userData[0].musiclisteninglist))
})

app.delete('/submitForDelete', async (req, res) => { //
  
  const dataObject = req.body

  searchAndDelete(dataObject) 
  await collection.updateOne({usern: userData[0].usern}, {$set: {musiclisteninglist: userData[0].musiclisteninglist}})
  
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(userData[0].musiclisteninglist))
})


app.put('/submitForModification', async (req, res) => { //
  
  const dataObject = req.body

  searchAndUpdate(dataObject)
  await collection.updateOne({usern: userData[0].usern}, {$set: {musiclisteninglist: userData[0].musiclisteninglist}})

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(userData[0].musiclisteninglist))
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