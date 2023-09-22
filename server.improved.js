const { time } = require('console')


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://ngheineman:assignment3@fictiontracker.wlfu0nv.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



const express = require("express");

const app = express();

const port = 3000


let characterData = [
  { 'name': 'Aragorn', 'start': 1065, 'end': 1403, 'era': "" }
]

let timelineData = [
  { 'era': 'First Age', 'date': 1000, 'description': 'The beginning' },
  { 'era': 'Second Age', 'date': 1567, 'description': 'The defeat of the witch-king of Angmar' },
  { 'era': 'The Space Age', 'date': 2552, 'description': 'The Fall of Reach' }
]



app.use(express.static('public'));


//get functions

// app.get('/', (req, res) => {
//   console.log(req);
//   const filename = "public/index.html"
//   const options = {
//     root: path.join(__dirname)
//   };
//   res.sendFile(filename, options, function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('Sent:', filename);
//     }
//   });
// });

 app.get('/timelineData', async (req, res) => {

  const cursor = client.db('world_data').collection('timelineData').find().sort({date: 1});
  const timelineData = await cursor.toArray()

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(timelineData));
});

app.get('/characterData', async (req, res) => {
  await RecheckCharacters();

  const cursor = client.db('world_data').collection('characterData').find().sort({start: 1});
  const characterData = await cursor.toArray()
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(characterData));
});


//add functions

app.post('/timelineData', (request, response) => {
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', async function () {

    let value = JSON.parse(dataString);

    const x = await client.db('world_data').collection('timelineData').insertOne(value);
    const cursor = client.db('world_data').collection('timelineData').find().sort({date : 1});


    await RecheckCharacters()
    const timelineData = await cursor.toArray()

    response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(timelineData))
  })

})

app.post('/characterData', (request, response) => {
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', async function () {

    let value = JSON.parse(dataString);

    const x = await client.db('world_data').collection('characterData').insertOne(value);
    await RecheckCharacters();

    const cursor = client.db('world_data').collection('characterData').find().sort({start : 1});
    const characterData = await cursor.toArray()

    


    response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(characterData))
  })

})

app.post('/', (request, response) =>{
  response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
  response.end('test')
})

//delete functions

app.delete('/timelineData', (request, response) => {
  console.log("Handle Delete");
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  console.log(dataString);

  request.on('end', async function () {
    let data = JSON.parse(dataString);

    const x = await client.db('world_data').collection('timelineData').deleteOne({era: data.era});

    const cursor = client.db('world_data').collection('timelineData').find().sort({date : 1});
    const timelineData = await cursor.toArray();

    await RecheckCharacters();

    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(timelineData));
  })
})

app.delete('/characterData', (request, response) => {
  console.log("Handle Delete");
    let dataString = ''

    request.on('data', function (data) {
      dataString += data
    })

    console.log(dataString);

    request.on('end', async function () {
      let data = dataString;


      const x = await client.db('world_data').collection('characterData').deleteOne({name: data});

      const cursor = client.db('world_data').collection('characterData').find().sort({start : 1});
      const characterData = await cursor.toArray();
      response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
      response.end(JSON.stringify(characterData));
    })
})

//modify functions


app.post('/modifyTimelineData', (request, response) => {
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', async function () {

    const json = JSON.parse(dataString);
    const id = new ObjectId(json._id);

    const modified = await client.db('world_data').collection('timelineData').updateOne(
      {_id: id},
      {$set: 
        { era: json.era,
          date: json.date,
          description: json.description
        }
      }
    );

    await RecheckCharacters()
    
    const cursor = client.db('world_data').collection('timelineData').find().sort({date : 1});
    const timelineData = await cursor.toArray();

    response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(timelineData))
  })

})

app.post('/modifyCharacterData', (request, response) =>{
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', async function () {
    const json = JSON.parse(dataString);
    const id = new ObjectId(json._id);

    const modified = await client.db('world_data').collection('characterData').updateOne(
      {_id: id},
      {$set: 
        { name: json.name,
          start: json.start,
          end: json.end
        }
      }
    );



    await RecheckCharacters()

    const cursor = client.db('world_data').collection('characterData').find().sort({start : 1});
    const characterData = await cursor.toArray();

    response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(characterData))
   
  })

})






//passed a json object with date and era, assigns era based on given timeline info, returns new json object

async function RecheckCharacters() {

  const cursor = client.db('world_data').collection('characterData').find();
  const characterData = await cursor.toArray();

  const cursor2 = client.db('world_data').collection('timelineData').find().sort({date: 1});
  const timelineData = await cursor2.toArray();

  for (let i = 0; i < characterData.length; i++) {
    await client.db('world_data').collection('characterData').updateOne(
      { name: characterData[i].name},
      {$set: {era: AssignEra(timelineData, characterData[i])}})
    
  }

  const cursor3 = client.db('world_data').collection('characterData').find();
  const characterData2 = await cursor3.toArray();
  const c = 10;

}

//passed in timeline data in array form, and specific character value, returns a string which is the eras
function AssignEra(timelineData, value) {
  value.era = "unknown"

  if (timelineData.length === 0) {
    return;
  }
  for (let i = 0; i < timelineData.length - 1; i++) {
    //check if incoming character is contained in each age
    let total = value.end - value.start;
    if ((value.start >= timelineData[i].date && value.start <= timelineData[i + 1].date - 1) || (timelineData[i].date >= value.start && timelineData[i + 1].date - 1 <= value.end) || (value.end >= timelineData[i].date && value.end <= timelineData[i + 1].date - 1)) {
      if (value.era === "unknown") {
        value.era = "";
        value.era += timelineData[i].era;
      } else {
        value.era += ", " + timelineData[i].era;
      }
    }
  }

  if ((value.start >= timelineData[timelineData.length - 1].date) || (value.end >= timelineData[timelineData.length - 1].date)) {
    if (value.era === "unknown") {
      value.era = "";
      value.era += timelineData[timelineData.length - 1].era;
    } else {
      value.era += ", " + timelineData[timelineData.length - 1].era;
    }
  }
  return value.era;
}



app.listen(process.env.PORT || port, () => console.log("server running"));
