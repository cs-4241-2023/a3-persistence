require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb'),
      express = require( 'express' ),
      cookie = require ('cookie-session'),
      sqrl = require('squirrelly'),
      path = require('path'),
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
client.connect()

app.set('view engine', 'squirrelly')

app.use(express.urlencoded({ extended:true }))
app.use( cookie({
  name: 'session',
  keys: ['lksjhlkj', 'wajhebjhbe'],
  login: false
}))

app.post('/submit', handleManualScore);
app.post('/refresh', refresh);
app.post('/login', login)
app.post('/logout', logout)
app.post('/signup', signup)

app.use(express.static('public'));

app.get('/', async function(req, res) {
  //console.log(req.session);
  if (req.session === undefined || req.session.login === null || req.session.login === false) {
    res.sendFile(__dirname + "/views/no_pass.html")
  } else {
    const username = await getUserName(req.session.login);
    //console.log(username)
    res.render('index', {
      name: username.username
    })
  }
})

app.use(express.static('views'));
app.use(express.json());



async function newScore(name, score, session) {
  const dateSub = new Date()
  const userID = await getUserName(session.login);
  const newsc = {'name': name, 'score': score, 'date': dateSub, 'userID': userID};
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

async function login(request, response) {
  let dataString = '';
  request.on( 'data', function( data ) {
    dataString += data ;
    //console.log(data)
  })

  request.on('end', async function() {
    let req =  JSON.parse( dataString )

    const newToken = await findUserNamePass(req.username, req.password);
    //console.log(newToken)
    request.session.login = newToken;
    if (newToken === null) {
      const jsonStr = JSON.stringify({"success": false})
      response.end(jsonStr);
    } else {
      const jsonStr = JSON.stringify({"success": true})
      response.end(jsonStr);
    }
  })
  
}

async function signup(request, response) {
  let dataString = '';
  request.on( 'data', function( data ) {
    dataString += data ;
    //console.log(data)
  })

  request.on('end', async function() {
    let req =  JSON.parse( dataString )

    const newToken = await newUser(req.username, req.password);
    //console.log(newToken)
    request.session.login = newToken;
    if (newToken === null) {
      const jsonStr = JSON.stringify({"success": false})
      //console.log("running here");
      response.end(jsonStr);
    } else {
      const jsonStr = JSON.stringify({"success": true})
      //console.log("running here");
      response.end(jsonStr);
    }
  })
  
}

async function logout(request, response) {
  //console.log("logging out")
  const jsonStr = JSON.stringify({"success": true})
  request.session.login = null;
  response.end(jsonStr);
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

    let success = true;
    const user = await findUser(req.yourname, request.session);

    if (user === null) {
      await newScore(req.yourname, req.score, request.session);
    } else if (user === -1) {
      success = false;
    } else if (currscore >= 0) {
      await updateScore(req.yourname, currscore);
    } else {
      await deleteScore(req.yourname);
    }

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify({success: success}))
  })

}

async function findUser(name, session) {

  const database = client.db("cs4241"),
        collection = database.collection("subway-scores");
  
  const query = {'name': name};

  try {
    const cursor = await collection.findOne(query);
    //console.log(cursor);
    const userID = await getUserName(session.login);

    if (cursor === null || cursor === undefined) {
      return null;
    } else if (cursor.userID !== userID.username) {
      return -1;
    }
    return cursor;
  } catch (err) {
    throw "he angy";
  }

  
}

async function getAllScores() {
  //console.log("getting all scores")

    //console.log("connected")

  const database = client.db("cs4241"),
        collection = database.collection("subway-scores");

  const cursor = collection.find();
  const val = await cursor.toArray();
  //console.log(val);
  return val;

   
}

async function updateScore(name, newScore) {


  const database = client.db("cs4241"),
        collection = database.collection("subway-scores");
  
  await collection.updateOne(
    { 'name': name },
    { $set: { 'score': newScore } }
  );

}

async function deleteScore(name) {


  const database = client.db("cs4241"),
        collection = database.collection("subway-scores");
  
  await collection.deleteOne(
    {'name': name}
  );


}

async function findUserNamePass(username, password) {


    const database = client.db("cs4241"),
          collection = database.collection("users");
    
    const query = {
      'username': username,
      'password': password
    };
    try {
      const cursor = await collection.findOne(query);
      if (cursor === null) {
        return null;
      }
      
      const token = await getRandomToken(collection)

      await collection.updateOne(
        {'username': username},
        {'$set': {'token': token}}
      )
      return token;
    } catch (err) {
      throw "he angy";
    }

}

async function newUser(username, password) {


    const database = client.db("cs4241"),
          collection = database.collection("users");
    
    const query = {'username': username};

    try {
      const cursor = await collection.findOne(query);
      if (cursor !== null) {
        return null;
      }
      
      const token = await getRandomToken(collection)

      await collection.insertOne({
        'username': username,
        'password': password,
        'token': token
      })
      return token;
    } catch (err) {
      throw "he angy";
    }

}

async function getRandomToken(collection) {
  const number = Math.floor(Math.random() * 100000000)

  const cursor = await collection.findOne({'token': number})
  if (cursor !== null) return getRandomToken(collection)
  return number
}

async function getUserName(token) {

    const database = client.db("cs4241"),
          collection = database.collection("users");
    
    const query = {
      'token': token
    };
    try {
      const cursor = await collection.findOne(query);
      if (cursor === null || cursor === undefined) {
        return null;
      }
      //console.log(cursor)

      return cursor;
    } catch (err) {
      throw "he angy";
    }

}

app.listen( process.env.PORT || port )
 