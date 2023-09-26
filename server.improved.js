const express    = require('express'),
      { MongoClient, ServerApiVersion } = require("mongodb"),
      app        = express(),
      logdata    = []
let userdata = null
app.use( "/", express.static( 'public' ) )
app.use( "/", express.static( 'views'  ) )
app.use( express.json() )
require("dotenv").config()

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("workoutlogdb").collection("workoutlog")
    const docs = await collection.find({}).toArray()
    console.log(docs)

  app.get("/fetchData", async (req, res) => {
    if (collection !== null) {
      //replace with github userid
      const docs = await collection.find({"userid":"admin"}).toArray()
      userdata = docs
      //console.log(userdata[0]['workoutdata'])
      res.json( docs )
    }
  })
}

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

//submit
app.post( '/submit', async (req,res) => {
  //add the body to the workoutdata array
  userdata[0]['workoutdata'].push(req.body)

  console.log(userdata)
  const result = await collection.replaceOne({"userid": "admin" }, userdata[0])
  res.json( result )
})

//delete
app.post( '/delete', async (req,res) => {
   //splice the index from the array in userdata
    userdata[0]['workoutdata'].splice(req.body.deleteResponse, 1);
    const result = await collection.replaceOne({"userid": "admin" }, userdata[0])
    res.json( result )
})

app.post( '/update', async (req,res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId( req.body._id ) },
    { $set:{ name:req.body.name } }
  )

  res.json( result )
})

run()

app.listen( 3000 )

const calculateVolume = function (sets, reps, weight) {
  return sets * reps * weight;
}

// app.post("/delete", async function (request, response) {
//   //only deletes the top one
//   const index = request.body.deleteResponse;
//   logdata.splice(response.json(logdata)[index], 1);

// })



// const http = require("http"),
//   fs = require("fs"),
//   mime = require("mime"),
//   dir = "public/",
//   port = 3000;

// const appdata = [];

// const server = http.createServer(function (request, response) {
//   if (request.method === "GET") {
//     handleGet(request, response);
//   } else if (request.method === "POST") {
//     handlePost(request, response);
//   }
// });

// const handleGet = function (request, response) {
//   const filename = dir + request.url.slice(1);

//   if (request.url === "/") {
//     sendFile(response, "public/index.html");
//   } else if (request.url === "/fetchData") {
//     response.writeHeader(200, { "Content-Type": "text/plain" });
//     response.end(JSON.stringify(appdata));
//   } else {
//     sendFile(response, filename);
//   }
// };

// const handlePost = function (request, response) {
//   let dataString = "";

//   request.on("data", function (data) {
//     dataString += data;
//   });

//   request.on("end", function () {
//     if (request.url === "/submit") {
//       appdata.push(JSON.parse(dataString));
//     } else if (request.url === "/delete") {
//       handleDelete(JSON.parse(dataString));
//     }
//     for (let i = 0; i < appdata.length; i++) {
//       let response = appdata[i];
//       response.volume = calculateVolume(
//         response.sets,
//         response.reps,
//         response.weight
//       )
//     }
//     response.writeHead(200, "OK", { "Content-Type": "text/plain" });
//     response.end();
//   });
// };

// const handleDelete = function (data) {
//   appdata.splice(data["deleteResponse"], 1);
// };

// const sendFile = function (response, filename) {
//   const type = mime.getType(filename);

//   fs.readFile(filename, function (err, content) {
//     // if the error = null, then we've loaded the file successfully
//     if (err === null) {
//       // status code: https://httpstatuses.com
//       response.writeHeader(200, { "Content-Type": type });
//       response.end(content);
//     } else {
//       // file not found, error code 404
//       response.writeHeader(404);
//       response.end("404 Error: File Not Found");
//     }
//   });
// };

// server.listen(process.env.PORT || port);

// const calculateVolume = function (sets, reps, weight) {
//   return sets * reps * weight;
// }
