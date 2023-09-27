const fs = require('fs');
const url = require('url');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mamcinerney:EwhFOBSVH4lK5Vqd@a3-michael-mcinerney.ni2hcmg.mongodb.net/?retryWrites=true&w=majority";

const express    = require('express'),
      app        = express(),
      dreams     = [];

const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github').Strategy;

app.use( express.static( 'public' ) );
app.use( express.static( 'views'  ) );
app.use( express.json() );

app.use(session({ secret: '12ae5b66bdaf441303a523a91383232b3bfd6aec', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Configure GitHub OAuth strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: 'bf022ca9ac7240af6588',
      clientSecret: '12ae5b66bdaf441303a523a91383232b3bfd6aec',
      callbackURL: 'https://a3-michael-mcinerney.glitch.me/github-callback', // Update with your callback URL
    },
    (accessToken, refreshToken, profile, done) => {
      // You can save the user's profile data or perform other actions here.
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.post( '/delete', async (req, res) => {
  res.writeHead( 200, { 'Content-Type': 'application/json' });
  const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  
  try {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    await client.connect();
    
    // Database querying code here
    const dbName = "training-sessions";
    const colName = "Test";
    // fetch records from db
    const db = client.db(dbName);
    const collection = db.collection(colName);
    
    // match record with id for deletion
    const query = { 
      _id: new ObjectId(req.body.id),
    }; console.log("query: "+query);
    const result = await collection.deleteOne(query);
    console.log(`Deleted ${result.deletedCount} document(s)`);
    
    
    
  } finally {
    // Ensures that the client will close when you finish/error
    client.close();
  } res.end( JSON.stringify( dreams ) );
});



app.post( '/update', async (req, res) => {
  res.writeHead( 200, { 'Content-Type': 'application/json' });
  const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  
  try {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    await client.connect();
    
    // Database querying code here
    const dbName = "training-sessions";
    const colName = "Test";
    // fetch records from db
    const db = client.db(dbName);
    const collection = db.collection(colName);
    
    // 
    const query = { 
      _id: new ObjectId(req.body.id),
    }; console.log("query: "+query);
    
    // update record in collection
    const records = {
      date:req.body.date,
      type:req.body.type,
      distance:req.body.distance,
      time:req.body.time,
      heartRate:req.body.heartRate,
      user:req.session.username
    }; const update = { 
      $set: records
    }; const result = await collection.updateOne(query, update);
     console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
    
    
    
  } finally {
    // Ensures that the client will close when you finish/error
    client.close();
  } res.end( JSON.stringify( dreams ) );
});

app.post( '/populate', async (req, res) => {
  const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  
  let username;
  if(req.session.username) {
    username = req.session.username;
    console.log("SESSION: "+username);
  } else {
    res.status(200).json([]);
    return;
  }
  
  try {
    // Connect the client to the server	(optional starting in v4.7)
      
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    await client.connect();
    
    // Database querying code here
    const dbName = "training-sessions";
    const colName = "Test";
    // fetch records from db
    const db = client.db(dbName);
    const collection = db.collection(colName);
    
    const documents = await collection.find({user:username}).toArray();
    console.log(documents);
    console.log(username);
    res.status(200).json({trainingData: documents});
    
  } finally {
    // Ensures that the client will close when you finish/error
    client.close();
  }
});

app.post( '/login', async (req, res) => {
  const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  
  try {
    // Connect the client to the server	(optional starting in v4.7)
      
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    await client.connect();
    
    // Database querying code here
    const dbName = "training-sessions";
    const colName = "Users";
    // fetch records from db
    const db = client.db(dbName);
    const collection = db.collection(colName);
    const documents = await collection.find({username:req.body.username}).toArray();
    console.log(documents);
    
    if(documents.length != 0) {
      console.log("User has been found. Validation in progress");
      const retrieved = documents[0].password;
      if(retrieved != req.body.password) {
        const responseObj = {
          htmlContent: "",
          authenticated: 0,
        };

        // Send the response as JSON
        res.status(200).json(responseObj);
        return;
      }
    } else {
      // validate against collection
        const responseObj = {
          htmlContent: "",
          authenticated: 0,
        };

        // Send the response as JSON
        res.status(200).json(responseObj);
        return;
    }
      
    
    
  } finally {
    // Ensures that the client will close when you finish/error
    console.log("pre-closure");
    client.close();
    console.log("post-closure");
  }
  
  // Read the HTML file content
  fs.readFile('views/tracker.html', 'utf8', (err, htmlContent) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Define additional data to send
      req.session.username = req.body.username;

      // Create a response object with both HTML content and additional data
      const responseObj = {
        htmlContent: htmlContent,
        authenticated: 1,
      };

      // Send the response as JSON
      res.status(200).json(responseObj);
    }
  });
});

app.post( '/add-data', async (req, res) => {
  res.writeHead( 200, { 'Content-Type': 'application/json' });
  const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  
  try {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    await client.connect();
    
    // Database querying code here
    const dbName = "training-sessions";
    const colName = "Test";
    // fetch records from db
    const db = client.db(dbName);
    const collection = db.collection(colName);
    
    //add to collection
    const records = {
      date:req.body.date,
      type:req.body.type,
      distance:req.body.distance,
      time:req.body.time,
      heartRate:req.body.heartRate,
      user:req.session.username
    }; await collection.insertOne(records);
    
    
  } finally {
    // Ensures that the client will close when you finish/error
    client.close();
  } res.end( JSON.stringify( dreams ) );
});

app.post( '/register', async (req, res) => {
  console.log( "[ONBOARD]: "+ req.body.username + " " + req.body.password );
  res.writeHead( 200, { 'Content-Type': 'application/json' });
  const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  
  try {
    // Connect the client to the server	(optional starting in v4.7)
      
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    await client.connect();
    
    // Database querying code here
    const dbName = "training-sessions";
    const colName = "Users";
    // fetch records from db
    const db = client.db(dbName);
    const collection = db.collection(colName);
    const documents = await collection.find({username:req.body.username}).toArray();
    console.log(documents);
    
    if(documents.length != 0) {
      res.write("Username has already been taken. Please try again.");
    } else {
      //add to collection
      const records = {
        'username': req.body.username, 
        'password': req.body.password
      };
      await collection.insertOne(records);
    }
      
    
    
  } finally {
    // Ensures that the client will close when you finish/error
    client.close();
  } res.end( JSON.stringify( dreams ) );
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/github-callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  req.session.username = req.user.username;
  res.redirect('./auth-success.html');
//   fs.readFile('views/tracker.html', 'utf8', (err, htmlContent) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       // Define additional data to send
//       req.session.username = req.body.username;

//       // Create a response object with both HTML content and additional data
//       const responseObj = {
//         htmlContent: htmlContent,
//         authenticated: 1,
//       };

//       // Send the response as JSON
//       res.status(200).json(responseObj);
//     }
//   });
});

app.listen( process.env.PORT )