require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb'),
      express = require( 'express' ),
      cookie = require ('cookie-session'),
      app = express(),
      port = 3000,
      mongouser = process.env.MONGO_USERNAME,
      mongopass = process.env.MONGO_PASSWORD;
      
const uri = "mongodb+srv://" + mongouser + ":" + mongopass + "@cs4241.mwubspm.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";

//console.log("user: %s, password: %s", mongouser, mongopass);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());

app.post('/submit', handleManualScore);
app.post('/refresh', refresh);

async function newScore(name, score) {
  const dateSub = new Date()
  const newsc = {'name': name, 'score': score, 'date': dateSub};
  //console.log(newsc)
  //scores.push(newsc)

  try {
    await client.connect();

    const database = client.db("cs4241"),
          collection = database.collection("subway-scores");

    await collection.insertOne(newsc);

  } finally {
    client.close();
  }
}

async function refresh(request, response) {
  response.writeHeader(200, {'Content-Type': 'text/plain'})
  const jsonStr = JSON.stringify(await getAllScores());
  //console.log(jsonStr)
  response.end(jsonStr)
}

function handleManualScore(request, response) {
  let dataString = '';
  request.on( 'data', function( data ) {
    dataString += data ;
    //console.log(data)
  })

  request.on( 'end', async function() {
    //console.log(dataString)
    let req =  JSON.parse( dataString )
    //console.log(req)
    // ... do something with the data here!!!
    const currscore = parseInt(req.score);

    if (isNaN(currscore)) {
      response.writeHead(400)
      response.end('Score is not an integer value')
      return;
    }

    const user = await findUser(req.yourname);

    if (user === null) {
      await newScore(req.yourname, req.score);
    } else if (currscore >= 0) {
      await updateScore(req.yourname, currscore);
    } else {
      await deleteScore(req.yourname);
    }

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end('test')
  })

}

async function findUser(name) {
  try {
    await client.connect();

    const database = client.db("cs4241"),
          collection = database.collection("subway-scores");
    
    const query = {'name': name};

    try {
      const cursor = await collection.findOne(query);
      //console.log(cursor);

      return cursor;
    } catch (err) {
      throw "he angy";
    }

  } finally {
    client.close();
  }
}

async function getAllScores() {
  console.log("getting all scores")
  try {
    await client.connect();
    console.log("connected")

    const database = client.db("cs4241"),
          collection = database.collection("subway-scores");

    const cursor = collection.find();
    const val = await cursor.toArray();
    console.log(val);
    return val;

  } finally {
    console.log("closing")
    client.close();
  }
}

async function updateScore(name, newScore) {
  try {
    await client.connect();

    const database = client.db("cs4241"),
          collection = database.collection("subway-scores");
    
    await collection.updateOne(
      { 'name': name },
      { $set: { 'score': newScore } }
    );

  } finally {
    client.close();
  }
}

async function deleteScore(name) {
  try {
    await client.connect();

    const database = client.db("cs4241"),
          collection = database.collection("subway-scores");
    
    await collection.deleteOne(
      {'name': name}
    );

  } finally {
    client.close();
  }
}

app.listen( process.env.PORT || port )
 