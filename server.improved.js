const {MongoClient} = require('mongodb');
const express = require( 'express'),
app = express()
const dotenv = require('dotenv')
const cookie = require('cookie-session')
dotenv.config();

const http = require( 'http' ),
      fs   = require( 'fs' ),
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000,
      uri = process.env.DB_CONNECTION

let appdata = {};

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['ARU16WbGlq6ODG9b51uapdQ55mP1MmB2ZTHiU5d/D5uayFmKwOw8QX7W1cVF6u7G', 'ad7V3IFA9Io2Cq4LVkvD6PkvEgEL0ycldt8Yo77VX4Va3wUAXI4XOl2cMlqouDCpj']
}))

const addAcctList = function(acctName){
  if(!appdata[acctName]){
    appdata[acctName] = [];
    console.log("Acct list " + acctName + " created")
  }
}


const client = new MongoClient(uri);
let users = [{"username": "Admin", "password": "pass123"}];


async function insertDB(artist){
  try{
    await client.connect();

    const db = client.db('webwareProjects');
    const collection = db.collection('a3-tRaymodn')

    const result = await collection.insertOne(artist)

    console.log("result: " + result);
  }
  catch(err){
    console.log("Error inserting document: " + err);
  }
  finally{
    //await client.close();
  }

}

async function deleteDB(artist){ // Fix the issue where I cannot delete the last remaining entry from the database - Error deleting document: MongoExpiredSessionError: Cannot use a session that has ended
  try{
    await client.connect();

    const db = client.db('webwareProjects');
    const collection = db.collection('a3-tRaymodn')

    const filter = {Artist: artist.Artist, Account: artist.Account};
    const result = await collection.deleteOne(filter);

    console.log("result: " + result);
  }
  catch(err){
    console.log("Error deleting document: " + err);
  }
  finally{
    //await client.close(); // for some reason when I close the connections, the program gives me MongoNetworkError: connection establishment was cancelled but it is fine if I never close the connection on any of my functions
  }

}

// Replacement for http.createServer
const handleReq = (req, res) =>{
  console.log("url: " + req.url);
  if(req.method === 'GET'){
    handleGet(req, res);
  }
  else if( req.method === 'POST'){
    handlePost(req, res);
  }
}

app.use(handleReq);

const handleGet = function(request, response) {
  
  let filename = dir + request.url.slice(1);

  if (request.url === '/') {
    sendFile(response, 'public/login.html');
  } 
  else if (request.url.startsWith('/artists')) {
    loadDBData()
    const acct = request.session.username
    addAcctList(acct)
    console.log("acct:" + acct);
    console.log("appdata[admin]: " + appdata[acct]);
    response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
    response.end(JSON.stringify(appdata[acct]));
  } 
  else if(request.url === "/users"){
    const body = JSON.stringify(users)
    response.writeHead(200, "OK")
    response.end(body);
  }
  else {
    let file = filename.split("?")[0];
    sendFile(response, file);
  }
}

const loadDBData = async function(){
  await client.connect();

  const db = client.db('webwareProjects');
  const collection = db.collection('a3-tRaymodn')

  const result = await collection.find({}).toArray();

  console.log("result: " + result)

  for(let i = 0; i < result.length; i++){
    addAcctList(result[i].Account)
    let inList = false
    console.log(result[i].Account)
    for(let j = 0; j < appdata[result[i].Account].length; j++){
      console.log(JSON.stringify(result[i].Artist), JSON.stringify(appdata[result[i].Account][j].Artist))
      if(result[i].Artist === appdata[result[i].Account][j].Artist && result[i].Genre === appdata[result[i].Account][j].Genre){
        inList = true
      }
    }
    if(!inList){
      appdata[result[i].Account].push(result[i])
    }
  }
}

/**
 * This function handles post requests send to the server
 * @param {Promise<Request>} request 
 * @param {Promise<Response>} response 
 */
const handlePost = function( request, response ) {
  console.log("session: " + JSON.stringify(request.headers?.cookie))
  let dataString = ''

const acct = request.session.username

  console.log("acct: " + acct)

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    if(request.url.startsWith("/remove")){ // when an artist is deleted using the delete form
      let removed;
      for(let i = 0; i < appdata[acct].length; i++){
        if(dataString.toLowerCase() === appdata[acct][i].Artist.toLowerCase()){
          removed = appdata[acct][i];
          deleteDB(appdata[acct][i]);
          appdata[acct].splice(i, 1);
        }
      }
      if(removed === undefined){
        response.writeHead(400, "OK", {'Content-Type': 'text/plain'})
        response.end(JSON.stringify(appdata[acct]));
      }
      else{
        updateRankings(acct);
        response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
        response.end(JSON.stringify(appdata[acct]));
      }
     
    }
  else if(request.url.startsWith("/submit")){ // when a new artist is submitted using the submit form
    console.log("Parsed data input: " + JSON.parse( dataString ) )

    const jsonData = JSON.parse( dataString ); // JSON output from client
    addRanking(jsonData, request);
    console.log(appdata)
    for(let i = 0; i < appdata[acct].length; i++){
      console.log("appdata[acct]: " + JSON.stringify(appdata[acct][i]));
    }

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata[acct]));
  }
  else if(request.url === '/login'){ // handle login request
     
    let data = JSON.parse(dataString);
    validateLogin(data, response, request);
  }
  else if(request.url === '/newacct'){ // when creating new account
    let account = JSON.parse(dataString);
    if(checkAccounts(account)){
      users.push(account);
      response.writeHead(200, "OK");
      response.end(JSON.stringify(account));
    }
    else{
      response.writeHead(400);
      response.end("Account with that username already exists");
    }
    

  }
  })
}

const checkAccounts = function(account){
  for(let user of users){
    if(user.username === account.username){
      return false;
    }
  }
  return true;
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

function addRanking(artist, request) {
  const acct = request.session.username
  let newRanking = appdata[acct].length
  let newArtist = {
    Artist: artist.Artist,
    Genre: artist.Genre,
    Rating: artist.Rating,
    Ranking: newRanking,
    Account: acct
  };
  let flag = false;
  for(let i = 0; i < appdata[acct].length; i++){
    if(newArtist.Artist === appdata[acct][i].Artist && newArtist.Genre === appdata[acct][i].Genre){
      appdata[acct][i] = newArtist;
      flag = true;
    }
  }
  if(!flag){ // If the artist name and genre are not the same
    appdata[acct].push(newArtist);
    insertDB(newArtist);
  }
  else{ // artist is already replaced in the array here, so we just need to delete the entry from the database and add in the new one.
    deleteDB(newArtist)
    insertDB(newArtist)
  }
  updateRankings(acct);
}


function updateRankings(acct){
  appdata[acct].sort((a,b) => b.Rating - a.Rating);
  for(let i = 0; i < appdata[acct].length; i++){
    appdata[acct][i].Ranking = i+1;
  }
  updateDBRankings(acct);
}

async function updateDBRankings(acct){
  await client.connect();

  const db = client.db('webwareProjects');
  const collection = db.collection('a3-tRaymodn')
  let filter;
  let update;
  for(let i = 0; i < appdata[acct].length; i++){
    filter = {Artist: appdata[acct][i].Artist, Genre: appdata[acct][i].Genre};
    update = { $set: {Ranking: appdata[acct][i].Ranking}};
    const result = await collection.updateOne(filter, update);
  }
  
  //await client.close();
}

// Validate Login credentials
const validateLogin = function(user, response, request){
  if(user.username === process.env.BASE_USER && user.password === process.env.BASE_PASS){
    request.session.username = process.env.BASE_USER
    request.session.password = process.env.BASE_PASS
    response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
    response.end("Admin");
  }
  else if(findAccountMatch(user, users)){
    request.session.username = user.username
    request.session.password = user.password
    response.writeHead(200, "OK", {"Content-Type": "text/plain"});
    response.end(user.username);
  }
  else{
    response.writeHead(400)
    response.end('Login credentails do not match');
  }
}

const findAccountMatch = function(object, collection){
  for(const i of collection){
    let matchFound = true;

    for(const j in object){
      if(object[j] !== i[j]){
        matchFound = false;
        break;
      }
    }

    if(matchFound){
      return true;
    }
  }
  return false;
}

const listener = app.listen (process.env.PORT || port)

//server.listen( process.env.PORT || port )