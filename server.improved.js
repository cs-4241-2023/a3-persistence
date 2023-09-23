require('dotenv').config();

const express = require('express'),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient( uri )

let task_collection = null;
let account_collection = null;

async function run() {
  await client.connect();
  task_collection = await client.db("todo_db").collection("tasks");
  account_collection = await client.db("todo_db").collection("accounts");
}

app.use(express.static('public'));

app.use( (req,res,next) => {
  if(task_collection !== null && account_collection !== null) {
    next()
  }else{
    res.status( 503 ).send()
  }
});

app.post('/login', (req, res) => {
  let dataString = "";

  req.on('data', function(data) {
    dataString += data;
  });

  req.on('end', async function() {
    let info = JSON.parse(dataString);

    const account = await account_collection.find({ username: info.username, password: info.password }).toArray();

    if (account.length < 1) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end("Incorrect username or password");
    }
    else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ username: info.username }));
    }
  });
});

app.post('/signup', (req, res) => {
  let dataString = "";

  req.on('data', function(data) {
    dataString += data;
  });

  req.on('end', async function() {
    let info = JSON.parse(dataString);

    const account = await account_collection.find({ username: info.username }).toArray();

    if (account.length >= 1) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end("User already exists");
    }
    else {
      const result = await account_collection.insertOne(info);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ username: info.username }));
    }
  });
});

app.get('/getTasks/', async (req, res) => {
  const tasks = await task_collection.find({ user: "" }).toArray();

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(tasks));
}); 

app.get('/getTasks/:userId', async (req, res) => {
  const userId = req.params.userId;
  const tasks = await task_collection.find({ user: userId }).toArray();

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(tasks));
}); 

app.post('/submitTasks', (req, res) => {
  let dataString = '';

  req.on('data', function(data) {
    dataString += data;
  });

  req.on('end', async function() {
    let info = JSON.parse(dataString);

    const currentDate = new Date();
    const objDate = new Date(info.dueDate);
    if (currentDate <= objDate) {
      const timeDifferenceInMilliseconds = objDate - currentDate;
      const daysDifference = Math.ceil(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));

      info.daysRemaining = daysDifference > 1 ? `${daysDifference} days` : "1 day";
    }
    else {
      info.daysRemaining = "Overdue";
    }

    const result = await task_collection.insertOne(info);
    console.log(info);

    res.writeHead(200, "OK", {'Content-Type': 'text/plain' });
    res.end('Submit Success');
  });

});

app.post('/deleteTask', (req, res) => {
  let dataString = '';

  req.on( 'data', function(data) {
      dataString += data;
  })

  req.on('end', async function() {
    let info = JSON.parse(dataString);
    const result = await task_collection.deleteOne({
      _id: new ObjectId(info._id)
    });

    res.writeHead(200, "OK", {'Content-Type': 'text/plain' });
    res.end('Delete Success');
  })
});

app.post('/updateTask', (req, res) => {
  let dataString = "";

  req.on('data', function(data) {
    dataString += data;
  });

  req.on('end', async function() {
    let info = JSON.parse(dataString);

    const currentDate = new Date();
    const objDate = new Date(info.dueDate);
    if (currentDate <= objDate) {
      const timeDifferenceInMilliseconds = objDate - currentDate;
      const daysDifference = Math.ceil(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));

      info.daysRemaining = daysDifference > 1 ? `${daysDifference} days` : "1 day";
    }
    else {
      info.daysRemaining = "Overdue";
    }

    const result = await task_collection.updateOne(
      { _id: new ObjectId(info._id) },
      { $set: { taskName: info.taskName, dueDate: info.dueDate, priority: info.priority, daysRemaining: info.daysRemaining }}
    );

    res.writeHead(200, "OK", {'Content-Type': 'text/plain' });
    res.end('Update Success');
  });
});

run();
app.listen(process.env.PORT || 3000);