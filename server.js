const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();
const mongoDBPASSW = process.env.MONGOPASSW;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://msgarbaczonek:"+mongoDBPASSW+"@a3.zqvh72t.mongodb.net/?retryWrites=true&w=majority";

const axios = require('axios')

let appdata = [
  { TaskName: "Task 1", DueDate: "09/12/2023", Priority: 1, MyDay: true },
  { TaskName: "Task 2", DueDate: "09/12/2023", Priority: 1, MyDay: true },
]

function requestLog(req, res, next) {
  console.log(`Request: ${req.method}, ${req.url}`);
  next();
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(bodyParser.json());
app.use(requestLog);

app.post( '/submit', async ( req, res ) => {
  const json = req.body

  try {
    await client.connect();

    const db = client.db('A3'); 
    const collection = db.collection('AppData'); 
    let result;
  
    switch (json.type) {
      case "addTask":
        const newTaskData = json.taskData;
        result = await collection.insertOne(newTaskData);
        break;
      case "deleteTask":
        result = await collection.deleteOne({ _id: new ObjectId(json.deleteRow) });
        break;
      case "updateTask":
        result = await collection.replaceOne({ _id: new ObjectId(json.id) }, json.taskData );
        break;
    }

  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await client.close();
  }

  res.writeHead( 200, { 'Content-Type': 'application/json'})
  res.end( req.json )
})

app.get('/css/main.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'css', 'main.css'));
});

app.get('/js/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'js', 'main.js'));
});

app.get('/appdata', async (req, res) => {
  let documents;
  try {
    await client.connect();
    const db = client.db('A3');
    const collection = db.collection('AppData');
    documents = await collection.find().toArray();
  } finally {
    await client.close();
  }
  res.json(documents);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function errorHandler(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
}

app.use(errorHandler);

const listener = app.listen( process.env.PORT || 3000 )