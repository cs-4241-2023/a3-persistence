const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  express = require('express'),
  dotenv = require('dotenv');
  app = express(),
  path = require('path'),
  dir = "public/",
  port = 3000;

dotenv.config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectID = require('mongodb').ObjectId

//const uri = `mongodb+srv://TestUser:Oe1wY0NZGom47CB5@cluster0.ffqniuy.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://TestUser:${process.env.PASSWORD}@cluster0.ffqniuy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/getUsers', (request, response) => {
    console.log('getting users...')
    client.connect();
    var db = client.db('usersDB');
    //console.log(db)
    var coll = db.collection('users');
    coll.find().toArray().then( result => {
      response.json( result )
    } )
})

app.get('/', (request, response) => {
  handleGet(request, response)
})
app.post('/newUser', (request, response) => {
  handlePost(request, response)
})

app.delete('/deleteUser', (request, response) => {
  handleDelete(request, response)
})

app.delete('/clearUsers', (request, response) => {
  var db = client.db('usersDB');
  var coll = db.collection('users');
  coll.deleteMany({})
  response.writeHead(200, "OK", { "Content-Type": "text/json" });
  response.end("deleted all users!");
})
const server = http.createServer(app)

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);
  if (request.url === "/") {
    sendFile(response, "public/index.html");
  }else{
    sendFile(response, filename);
  }
};

app.use(express.static('public'));

const handlePost = function (request, response) {
  console.log('posted!!')
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const json = JSON.parse(dataString);
    const email = `${json.name.charAt(0)}${json.email}@wpi.edu`.toLowerCase();
    json["name"] += ` ${json.email}`;
    json["email"] = email;
    var db = client.db('usersDB');
    var coll = db.collection('users');
    coll.insertOne(json);
    response.writeHead(200, "OK", { "Content-Type": "text/json" });
    response.end(JSON.stringify(json));
  });
};

const handleDelete = function (request, response) {
  console.log('deleted!!')
  let dataString = "";
  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    let data = JSON.parse(dataString);
    var db = client.db('usersDB');
    var coll = db.collection('users');
    console.log(data)
    coll.deleteOne({"_id" : new ObjectID(data._id)})
    response.writeHead(200, "OK", { "Content-Type": "text/json" });
    response.end("deleted user!");
    // for (var i = 0; i < appdata.length; i++) {
    //   if (appdata[i].id === data.id) {
    //     appdata.splice(i, 1);
    //     response.writeHead(200, "OK", { "Content-Type": "text/json" });
    //     response.end("deleted user!");
    //     return;
    //   }
    // }
    // response.writeHead(200, "OK", { "Content-Type": "text/json" });
    // response.end("user not found!");
  });
};

const sendFile = function (response, filename) {
  const options = {
      root: path.join(__dirname)
  };
  
  response.sendFile(filename, options, function (err) {
      if (err) {
          console.log('Error:', err);
      } else {
          console.log('Sent:', filename);
      }
  });
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})