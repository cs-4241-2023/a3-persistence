require('dotenv').config();

const express = require('express'),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("todo_db").collection("tasks")
}

app.use(express.static('public'));

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.get('/getTasks', async (req, res) => {
  const tasks = await collection.find({}).toArray();

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

    const result = await collection.insertOne(info);
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
    const result = await collection.deleteOne({
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

    const result = await collection.updateOne(
      { _id: new ObjectId(info._id) },
      { $set: { taskName: info.taskName, dueDate: info.dueDate, priority: info.priority, daysRemaining: info.daysRemaining }}
    );

    res.writeHead(200, "OK", {'Content-Type': 'text/plain' });
    res.end('Update Success');
  });
});

run();
app.listen(process.env.PORT || 3000);