const {MongoClient} = require('mongodb');
const express = require( 'express'),
app = express()
const dotenv = require('dotenv')
dotenv.config();

const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000,
      uri = process.env.DB_CONNECTION

let appdata = [];
let newappdata = {};

const addAcctList = function(acctName){
  if(!newappdata[acctName]){
    newappdata[acctName] = [];
  }
}



const client = new MongoClient(uri);
let users = [];


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

    const filter = {Artist: artist.Artist};
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
const handleReq = (req, res, next) =>{
  console.log("url: " + req.url);
  if(req.method === 'GET'){
    handleGet(req, res);
  }
  else if( req.method === 'POST'){
    handlePost(req, res);
  }
}

app.use(handleReq);

const handleGet = function( request, response ) {
  let filename = dir + request.url.slice( 1 )
  const urlSplit = filename.split("?");
  filename = urlSplit[0];

  if( request.url === '/' ) { // login starts here
    sendFile( response, 'public/login.html' )
  }
  else if(request.url === '/artists') {
    response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
    response.end(JSON.stringify(appdata));
  }    
  else{
    sendFile( response, filename )
  }
}

/**
 * This function handles post requests send to the server
 * @param {Promise<Request>} request 
 * @param {Promise<Response>} response 
 */
const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    if(request.url === '/remove'){ // when an artist is deleted using the delete form
      let removed;
      for(let i = 0; i < appdata.length; i++){
        if(dataString.toLowerCase() === appdata[i].Artist.toLowerCase()){
          removed = appdata[i];
          deleteDB(appdata[i]);
          appdata.splice(i, 1);
        }
      }
      if(removed === undefined){
        response.writeHead(400, "OK", {'Content-Type': 'text/plain'})
        response.end(JSON.stringify(appdata));
      }
      else{
        updateRankings();
        response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
        response.end(JSON.stringify(appdata));
      }
     
    }
  else if(request.url === '/submit'){ // when a new artist is submitted using the submit form
    console.log("Parsed data input: " + JSON.parse( dataString ) )

    const jsonData = JSON.parse( dataString ); // JSON output from client
    addRanking(jsonData);
    for(let i = 0; i < appdata.length; i++){
      console.log("appdata: " + JSON.stringify(appdata[i]));
    }

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata));
  }
  else if(request.url === '/login'){ // handle login request
    data = JSON.parse(dataString);
    validateLogin(data, response);
  }
  else if(request.url === '/newacct'){ // 
    let account = JSON.parse(dataString);
    users.push(account);
    console.log("new user array: " + JSON.stringify(users));

    response.writeHead(200, "OK");
    response.end(JSON.stringify(account));
  }



  })
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

function addRanking(artist) {
  let artistRating = Number(artist.Rating);
  //let newRanking = fixRatings(artistRating);
  let newRanking = appdata.length
  newArtist = {
    Artist: artist.Artist,
    Genre: artist.Genre,
    Rating: artist.Rating,
    Ranking: newRanking,
    Account: artist.Account
  };
  let flag = false;
  for(let i = 0; i < appdata.length; i++){
    if(newArtist.Artist === appdata[i].Artist && newArtist.Genre === appdata[i].Genre){
      appdata[i] = newArtist;
      flag = true;
    }
  }
  if(!flag){
    appdata.push(newArtist);
    insertDB(newArtist);
  }
  updateRankings();
}


function updateRankings(){
  appdata.sort((a,b) => b.Rating - a.Rating);
  for(let i = 0; i < appdata.length; i++){
    appdata[i].Ranking = i+1;
  }
  updateDBRankings();
}

async function updateDBRankings(){
  await client.connect();

  const db = client.db('webwareProjects');
  const collection = db.collection('a3-tRaymodn')
  console.log("collection: " + collection);
  let filter;
  let update;
  for(let i = 0; i < appdata.length; i++){
    filter = {Artist: appdata[i].Artist, Genre: appdata[i].Genre};
    update = { $set: {Ranking: appdata[i].Ranking}};
    const result = await collection.updateOne(filter, update);
  }
  
  //await client.close();
}

// Validate Login credentials
const validateLogin = function(user, response){
  if(user.username === process.env.BASE_USER && user.password === process.env.BASE_PASS){
    response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
    response.end("Admin");
  }
  else if(findAccountMatch(user, users)){
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