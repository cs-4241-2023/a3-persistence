const express = require("express"),
     {mongodb, ObjectId, MongoClient} = require("mongodb"),
    dotenv= require('dotenv').config(),
   app = express();

app.use(express.json());
app.use(express.static("public"));


const url= `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}/retryWrites=true&w=majority&appName=AtlasApp`

const dbconnect= new MongoClient(url)

let collection = null;
let users = null;


async function run() {
 await dbconnect.connect().then(()=>console.log("DB works"))
  collection = await dbconnect.db("a3-Persistence").collection("a3");
  users = await dbconnect.db("a3-Persistence").collection("users");  
}


app.post("/login", async (req, res) => {
  const user = req.body.username;
  let dis = await users.find(
    { username: user },
    { username: 1, password: 1, _id: 0 }
  );
  if (dis === "") {
    res.render("login", {
      message: "username not found, login failed!",
      layout: false,
    });
  //  req.session.login = false;
  } else {
    if (dis.password === req.body.password) {
      //req.session.login = true;
      res.redirect("index.html");
    } else {
      res.render("login", {
        message: "username not found, login failed!",
        layout: false,
      });
     // req.session.login = false;
    }
  }
});

app.post("/submit", async (req, res) => {
  const result = await collection.insertOne(req.body);
  res.json(result);
});

app.get("/display", async (req,res)=>{
  const results= await collection.find({}).toArray()
  res.json(results);
});

app.post("/delete", async (req,res)=>{
  const results= await collection.deleteOnce({
    _id:new ObjectId(req.body._id)
  })
  res.json(results)
})

run()
app.listen(process.env.PORT || 3000);


/*


const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require("mime"),
  dir = "public/",
  port = 3000;

let appdata = [];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  }
  if (request.url === "/display") {
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(appdata));
  } else {
    sendFile(response, filename);
  }
};


const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    if (request.url === '/submit') {
      appdata.push(JSON.parse(dataString));
      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end(JSON.stringify(appdata));
    } else if (request.url === '/delete'){
      let dataDel = JSON.parse(dataString)
      if(dataDel.number >= 0){
        appdata.splice(dataDel.number,1);
       response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end(JSON.stringify({sucess: "Deletion completed"}));
      }
     
    }
  });
};

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

server.listen(process.env.PORT || port);
*/