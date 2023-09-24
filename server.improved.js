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
//const uri = `mongodb+srv://TestUser:Oe1wY0NZGom47CB5@cluster0.ffqniuy.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://TestUser:${process.env.PASSWORD}@cluster0.ffqniuy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    await listDatabases(client);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

const appdata = [
  {
    name: "Alex Marrinan",
    email: "ammarrinan@wpi.edu",
    type: "Undergrad Student",
    department: "IMGD",
    id: 0,
  },
  {
    name: "Dale Messer",
    email: "ammarrinan@wpi.edu",
    type: "Undergrad Student",
    department: "HUA",
    id: 1,
  },
  {
    name: "Charlie Roberts",
    email: "croberts@wpi.edu",
    type: "Professor",
    department: "IMGD",
    id: 2,
  },
  {
    name: "Michael Engling",
    email: "croberts@wpi.edu",
    type: "Professor",
    department: "CS",
    id: 3,
  },
];

var nextId = 4;

app.get('/getUsers', (request, response) => {
  response.writeHead(200, "OK", { "Content-Type": "text/json" });
  response.end(JSON.stringify(appdata));
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
  var len = appdata.length;
  appdata.splice(0, len);
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
    json.id = nextId;
    nextId += 1;
    appdata.push(json);
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
    for (var i = 0; i < appdata.length; i++) {
      if (appdata[i].id === data.id) {
        appdata.splice(i, 1);
        response.writeHead(200, "OK", { "Content-Type": "text/json" });
        response.end("deleted user!");
        return;
      }
    }
    response.writeHead(200, "OK", { "Content-Type": "text/json" });
    response.end("user not found!");
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