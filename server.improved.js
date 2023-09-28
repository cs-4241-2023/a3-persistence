const express    = require('express'),
      { MongoClient, ServerApiVersion } = require("mongodb"),
      app        = express(),
      axios      = require('axios'),
      logdata    = []

var access_token = "";

let userdata = null
let userid = ""

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

app.get('/callback', (req, res) => {

  const requestToken = req.query.code
  
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${process.env.clientID}&client_secret=${process.env.clientSecret}&code=${requestToken}`,
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    access_token = response.data.access_token
    res.redirect('/success');
  })
})

app.get('/success', function(req, res) {

  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token
    }
  }).then((response) => {
    userid = response.data.login
    res.redirect('/main.html')
  })
});

async function run() {
  await client.connect()
  collection = await client.db("workoutlogdb").collection("workoutlog")

  app.get("/fetchData", async (req, res) => {
    const docs = await collection.find({"userid":userid}).toArray()
    if (docs.length !== null) {
      userdata = docs
      //console.log(userdata[0]['workoutdata'])
      //res.json( docs )
    }
    else {
      console.log("no data")
      //insert empty workoutdata
      userdata = [{"userid": userid, "workoutdata": []}]
      res = await collection.insertOne(userdata)
      console.log(userdata)
    }
    res.json(userdata)
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
  console.log(userdata)
  userdata[0]['workoutdata'].push(req.body)

  console.log(userdata)
  const result = await collection.replaceOne({"userid": userid }, userdata[0])
  res.json( result )
})

//delete
app.post( '/delete', async (req,res) => {
   //splice the index from the array in userdata
    userdata[0]['workoutdata'].splice(req.body.deleteResponse, 1);
    const result = await collection.replaceOne({"userid": userid }, userdata[0])
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
