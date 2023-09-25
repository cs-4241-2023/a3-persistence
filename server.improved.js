const http = require('http'),
  fs = require('fs'),
  mime = require('mime'),
  dir = 'public/',
  port = 3000
  const express = require('express')
  const app = express(),
    {MongoClient} =require('mongodb')

   process.env.USER
   process.env.PASS 
  const uri = 'mongodb+srv://${process.env.USER}:${process.env.PASS}@cs4341a3.sqkz12t.mongodb.net/?retryWrites=true&w=majority';
app.use(express.static('./'))
app.use(express.json())


app.use(express.static("public") )
app.use(express.json() )
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient( uri )

let collection = null
let userCollection = null;
let user = null;

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null ) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
    userCollection = await client.db("datatest").collection("userCollection");
  })
}

run()

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/add', async (req,res) => {
  let result = await collection.insertOne({
    user: user,
    assignment: req.body.assignment,
  });

  const userList = await collection.find({ user: user }).toArray();
  userList.forEach((assignment) => {
    console.log("add: " + JSON.stringify(Object.values(assignment)));
  });
  res.json(userList);
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/remove', async (req,res) => {
  const result = await collection.deleteOne({ 
    _id:new ObjectId( req.body._id ) 
  })
  const userList = await collection.find({ user: user }).toArray();
  res.json( result )
})

app.post( '/update', async (req,res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId( req.body._id ) },
    { $set:{ name:req.body.name } }
  )

  res.json( result )
})

app.post('/login', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  const userAlreadyCreated = await userCollection.findOne({ user: user });

})

app.listen(3000)













let appdata = [
  {
    'course': 'CS4241',
    'assignment': 'A2',
    'dueDate': '2023-09-12',
    'dueTime': '11:59',
    'daysLeft': '0',
  },
]

/* const server = http.createServer(function (request, response) {
  if (request.method === 'GET') {
    handleGet(request, response)
  } else if (request.method === 'POST') {
    handlePost(request, response)
  }
  else if (request.method === 'DELETE') {
    handleDelete(request, response)
  }
})
/* app.get('/', (request, response)) => {
  const filename = dir + request.url.slice(1)
  if (request.url === '/') {
    sendFile(response, 'public/index.html')
  }
  else if (request.url === '/data') {
    response.writeHeader(200, { "Content-type": "text/json" });
    response.end(JSON.stringify(appdata));
  }
  else {
    sendFile(response, filename)
  }
} 
const handlePost = function (request, response) {
  console.log("request URL" + request.url);
  let dataString = ''
  request.on('data', function (data) {
    dataString += data
  })
  request.on('end', function () {
    let postResponse = JSON.parse(dataString);


    let daysLeft = calculateDaysLeft(postResponse.dueDate)
    appdata.push({ course: postResponse.course, assignment: postResponse.assignment, dueDate: postResponse.dueDate, dueTime: postResponse.dueTime, daysLeft: daysLeft })
    response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(appdata))
  })
}

const handleDelete = function (request, response) {
  let dataString = ''
  request.on('data', function (data) {
    dataString += data
  })
  request.on('end', function () {
    let assignmentToRemove = JSON.parse(dataString).assignmentToRemove
    appdata = appdata.filter(function (n, i) {
      return n.title !== assignmentToRemove;
    })
    response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata))
  })
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename)

  fs.readFile(filename, function (err, content) {

    // if the error = null, then we've loaded the file successfully
    if (err === null) {

      // status code: https://httpstatuses.com
      response.writeHeader(200, { 'Content-Type': type })
      response.end(content)

    } else {

      // file not found, error code 404
      response.writeHeader(404)
      response.end('404 Error: File Not Found')

    }
  })
}

const calculateDaysLeft = function (dueDate){
    //2023-09-12
    dueDate= new Date(dueDate)
    console.log(dueDate)
    
    let today = new Date()
    
    let time = dueDate.getTime() - today.getTime()
    console.log(time)
    time= Math.floor(time / (1000 * 3600 * 24))+1 //days
    console.log(time)
    return time
  } */
