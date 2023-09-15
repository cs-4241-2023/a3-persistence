const express = require('express'),
      { MongoClient, ObjectId } = require('mongodb');
      app = express(),
      port = 3000;
      require('dotenv').config();

app.use(express.static('public'));
app.use(express.static('public/css'));
app.use(express.static('public/js'));
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

let collection = null;

async function run() {
  await client.connect();
  collection = await client.db("appdata").collection("appdata");
}
run();

app.use((request, response, next) => {
  if (collection !== null) {
    next()
  } else {
    response.status(503).send();
  }
})

app.get('/getTable', async (request, response) => {
  if (collection !== null) {
    const appdata = await collection.find({}).toArray();
    response.json(appdata);
  }
})

app.post('/submit', async (request, response) => {
  if (collection !== null) {
    const body = request.body
    const kd = (parseInt(body.deaths) === 0) ? body.frags : (body.frags / body.deaths).toFixed(2);
    body['kd'] = parseFloat(kd);
    await collection.insertOne(body);
    const appdata = await collection.find({}).toArray();
    response.json(appdata);
  }
})

app.post('/deleteData', async (request, response) => {
  if (collection !== null) {
    await collection.deleteOne({
      _id: new ObjectId(request.body._id)
    })
    const appdata = await collection.find({}).toArray();
    response.json(appdata);
  }
})

app.post('/modifyData', async (request, response) => {
  if (collection !== null) {
    const body = request.body;
    const kd = (parseInt(body.newObj.deaths) === 0) ? body.newObj.frags : (body.newObj.frags / body.newObj.deaths).toFixed(2);
    body.newObj['kd'] = parseFloat(kd);
    await collection.updateOne(
      {_id: new ObjectId(body.obj._id)},
      {$set: {frags: body.newObj.frags, assists: body.newObj.assists, deaths: body.newObj.deaths, kd: kd}}
    )
    const appdata = await collection.find({}).toArray();
    response.json(appdata);
  }
})

app.listen(process.env.PORT || port);