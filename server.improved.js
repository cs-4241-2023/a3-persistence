const express    = require('express'),
      app        = express(),
      { MongoClient, ObjectId } = require('mongodb'),
      cookie  = require( 'cookie-session' ),
      crypto = require('crypto')
  
let nextId = 1

const url = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.kxz0njx.mongodb.net/?retryWrites=true&w=majority`

app.use( express.static( 'public' ) )
app.use( express.json() )

const client = new MongoClient( url )

let cardata2 = null
let logins = null

async function run() {
  await client.connect()
  cardata2 = await client.db("data").collection("cardata")
  logins = await client.db("data").collection("logindata")
}

run()


app.use( express.urlencoded({ extended:true }) )

// Generate random keys
const key1 = crypto.randomBytes(32).toString('hex');
const key2 = crypto.randomBytes(32).toString('hex');

app.use(cookie({
  name: 'session',
  keys: [key1, key2]
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.get('/index', (req, res) => {
  if (req.session.login) {
    res.sendFile(__dirname + '/views/index.html');
  }
  else {
    res.redirect('/')
  }
  
});


app.post('/login', async (req, res) => {
  console.log("Login: ")
  console.log( req.body )
  
  const { username, password } = req.body;

  // Query the database to check if the username and password match
  const user = await logins.findOne({ username, password });

  if (user) {
    // Authentication successful
    req.session.login = true;
    req.session.username = username;
    res.redirect('/index');
  } else {
    // Authentication failed, redirect back to login page
    res.sendFile(__dirname + '/views/login.html');
  }
});


// route to get all docs
app.get("/docs", async (req, res) => {
  console.log("GET 2: ")
  console.log(req.session.username)
  if (cardata2 !== null) {
    const filter = { username: req.session.username };
    
    const docs = await cardata2.find(filter).toArray();
    
    res.json(docs);
  }
})

app.post( '/docs', async (req,res) => {
  console.log("POST 2: ")
  console.log(req.body)
  req.body.username = req.session.username
  if (req.body.hasOwnProperty('year') && req.body.hasOwnProperty('mpg')) {
      const year = Number(req.body.year); 
      const mpg = Number(req.body.mpg);   
      const currentYear = new Date().getFullYear();
      const rating = currentYear - year + mpg;

      // Create rating field in backend
      req.body.rating = rating;
        
      req.body.id = nextId++;
  }
  
  const result = await cardata2.insertOne( req.body )
  res.writeHead( 200, { 'Content-Type': 'application/json' })
  res.end( JSON.stringify( req.body ) )
})


app.delete( '/docs', async (req,res) => {
  console.log("DELETE 2: ")
  console.log(req.body)
  const result = await cardata2.deleteOne({ 
    _id:new ObjectId( req.body._id ) 
  })
  
  res.json( result )
})

app.put( '/docs2', async (req,res) => {
  console.log("PUT 2: ")
  console.log(req.body)
  const year = Number(req.body.year);
  const mpg = Number(req.body.mpg);
  const currentYear = new Date().getFullYear();
  const rating = currentYear - year + mpg;

  // Update the rating field in the updated data
  req.body.rating = rating;
  
  let bodyWithoutID = req.body
  delete bodyWithoutID._id
  
  const result = await cardata2.updateOne(
    { _id: new ObjectId( req.body._id ) },
    { $set: bodyWithoutID }
  )
  
  console.log("Result: ")
  console.log(result)
  
  res.writeHead( 200, { 'Content-Type': 'application/json' })
  res.end( JSON.stringify( req.body ) )
})

app.put('/docs', async (req, res) => {
  try {
    console.log("PUT 2: ");
    console.log(req.body);

    const { _id, ...updateData } = req.body;

    if (!_id) {
      return res.status(400).json({ error: 'Missing _id field' });
    }

    // Not allowed to overwrite _id
    delete updateData._id;

    // Calculate new rating field
    const year = Number(req.body.year);
    const mpg = Number(req.body.mpg);
    const currentYear = new Date().getFullYear();
    const rating = currentYear - year + mpg;
    
    updateData.rating = rating;
    req.body.rating = rating;

    // Find object with _id, and update with all data except _id
    const result = await cardata2.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    console.log("Result: ");
    console.log(result);

    if (result.modifiedCount === 1) {
      res.writeHead( 200, { 'Content-Type': 'application/json' })
      res.end( JSON.stringify( req.body) );
    } else {
      return res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen( process.env.PORT )