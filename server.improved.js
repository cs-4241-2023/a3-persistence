const express = require("express");
const cookie  = require( 'cookie-session' )
const {MongoClient} = require('mongodb');
const app = express();
const  fs =  require("fs"),
mime = require("mime"),
dir = "public/",
port = 3000;
uri = "mongodb+srv://ethancatania:HelloWorld@a3clusterec.nhtdscq.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri);
client.connect();

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.get('/', (req, res) => {
    // Assuming 'login.html' is your login page
    sendFile(res, "public/newAccount.html");
});


app.use( express.urlencoded({ extended:true }) );


app.post('/login', (req,res) => {
  let dataString = "";

  req.on("data", function (data) {
    dataString += data;
  });

  req.on("end", function () {
    const userData = JSON.parse(dataString);
    const username = userData.username;
    const password = userData.password;
    const aUser = {
      username: username,
      password: password
    }
    loginHelper(aUser, res, req );
  });
});

async function loginHelper(aUser, res, req){
  try{
    
    const DB = client.db("a3DB");
    const collection =  DB.collection("Banking");

  const name = aUser.username
    const key = {username: name};
    const exists = await collection.findOne(key);
    
    
    
    if (exists === null) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ username: name }));
    } else if (exists.password === aUser.password){
      console.log("login Successful");
      req.session.username = aUser.username;
      res.redirect('/index.html');
      
      } else {
        res.writeHead(400, {"Content-Type": "application/json" });
        res.end(JSON.stringify({ username: name}));
      }
    }   
  catch (e) {
    console.log(e);
  }
}

app.post("/createUser", (request, response) => {
  
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const userData = JSON.parse(dataString);
    request.session.username = userData.username;
    if(userData.password == userData.REpassword){
    // If the username doesn't exist add a create a new user 
    const newUser = {
        username: request.session.username,
        password: userData.password,
        balance: userData.balance,
    };
    addToDb(newUser, response);
  } else {
    console.log("a");
    response.writeHead(301, {"Content-Type": "application/json"})
    response.end(JSON.stringify({ username: request.session.username }));
  }
  });
});

app.delete("/remove", (request, response) => {
 
  let dataString = "";
  
  request.on("data", function (data) {
    dataString += data;
  });
  
  request.on("end", function () {
    const username = request.session.username;
    const aUsername = { username: username };
        deleteFromDb(aUsername, response);
      });
});

app.post("/withdraw", (request, response) => {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
      const userData = JSON.parse(dataString);
      const username = request.session.username;
      const amount = userData.amount;
      withdrawHelper(username, response, amount);
  });
});

app.post("/deposit", (request, response) => {
 
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });
  

  request.on("end", function () {
    const userData = JSON.parse(dataString);
    const username = request.session.username;
    const amount = userData.amount;
    depositHelper(username,response, amount);
    }); 
});

async function withdrawHelper(name, res, amount){
try{
    
  const DB = client.db("a3DB");
  const collection =  DB.collection("Banking");

  const key = {username: name};
  console.log("Received username: " + name);
  const exists = await collection.findOne(key);
  
  
  if (exists === null) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ username: name }));
  } else {
    const balance = exists.balance;
    if (balance >= amount){
      const newBalance = balance - amount;
      updateBalance(name, res, newBalance);
    } else {
      res.writeHead(400, {"Content-Type": "application/json" });
      res.end(JSON.stringify({ username: name, balance: balance  }));
    }
  }   
} 
catch (e) {
  console.log(e);
}
}

async function depositHelper(name, res, amount){

  try{
    
    const DB = client.db("a3DB");
    const collection =  DB.collection("Banking");

    const key = {username: name};
    const exists = await collection.findOne(key);
    
    
    if (exists === null) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ username: name }));
    } else {
      const balance = exists.balance;
      const newBalance = balance + amount;

      updateBalance(name, res, newBalance);
    }   
  } 
  catch (e) {
    console.log(e);
  }
}
  
async function updateBalance(name, res, newBalance){

  try{

    const DB = client.db("a3DB");
    const collection =  DB.collection("Banking");

    const key = {username: name};
    res.writeHead(200, { "Content-Type": "application/json" });
    const update = {$set: {balance: newBalance }};
    await collection.updateOne(key, update );
    

    res.end(JSON.stringify({ username: name, balance: newBalance }));
  } catch (e) {
    console.log(e);
  }
}
async function deleteFromDb(account, res){
  try{
    
    const DB = client.db("a3DB");
    const collection =  DB.collection("Banking");

    const name = account.username;
    const key = {username: name};
    const exists = await collection.findOne(key);

  if (name !== "Admin") {
    if (exists !== null) {
    await collection.deleteOne(account);
    res.type('html');
    res.redirect('/login.html');
  } 
  else{
    res.writeHead(201,{ "Content-Type": "application/json" });
    res.end( JSON.stringify({ username: name }));
  }
}else {
  res.writeHead(202, { "Content-Type": "application/json" });
  res.end( JSON.stringify({ username: name }));
}
  

  }catch(e){
    console.log(e);
    }
}



async function addToDb(newUser, res){
  try{
    
    const DB = client.db("a3DB");
    const collection =  DB.collection("Banking");

    const name = newUser.username;
    const key = {username: name};
    const exists = await collection.findOne(key);
    
    if (exists === null) {
      await collection.insertOne(newUser);
      res.type('html');
      res.redirect('/index.html');

    }  else{
      res.writeHead(300, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ username: newUser.username }));
    }

    
  } catch (e) {
    console.log(e);
  }
}


const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

app.use( express.static( 'public' ) );
app.use( express.json() );

app.listen(process.env.PORT || port);
