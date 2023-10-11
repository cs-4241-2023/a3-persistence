const express = require("express"),
      cookie  = require( 'cookie-session' ),
  { MongoClient, ObjectId } = require("mongodb"),
  app = express();

app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());
app.use( express.urlencoded({ extended:true }) )

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.zq9b5is.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

let collection = null;

async function run() {
  await client.connect();
  collection = await client.db("cluster0").collection("assignmenttracker");

  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray();
      res.json(docs);
    }
  });
}

run();

app.use((req, res, next) => {
  if (collection !== null) {
    next();
  } else {
    res.status(503).send();
  }
});


app.post("/submit", async (req, res) => {
  req.body.priority = calculateDerivedField(req.body.date, req.body.msg);
  req.body.mail = req.session.mail;
  const add = await collection.insertOne(req.body);
  
  const result = await collection.find({mail: req.session.mail, pwd: ''}).toArray();
  
  
  res.json(result);
});

app.post("/remove", async (req, res) => {
  const del = await collection.deleteOne({
    _id: new ObjectId(req.body._id),
  });
  
  const result = await collection.find({ mail: req.session.mail, pwd: '' }).toArray();
  
  res.json(result);
});

app.post("/modify", async (req, res) => {
debugger
  const mod = await collection.updateOne(
    { _id: new ObjectId(req.body._id) },
    { $set: { name: req.body.name, asnmt: req.body.asnmt, msg: req.body.msg, date: req.body.date,
              priority: calculateDerivedField(req.body.date, req.body.msg) } }
  );

  const result = await collection.find({ mail: req.session.mail, pwd: '' }).toArray();
  
  res.json(result);
});

const calculateDerivedField = function (date, msg) {
  if (date < 5 && msg != "") {
    return "High";
  } else if (date >= 5 && date <= 10 && msg != "") {
    return "Medium";
  } else if (date > 10 && msg != "") return "Medium";
  else return "Low";
};


app.post( '/login', async(req,res)=> {
  const user = await collection.find({ mail: req.body.mail }).toArray();
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  // below is *just a simple authentication example* 
  // for A3, you should check username / password combos in your database

  if(!user.length) {
    const result = collection.insertOne(req.body);
    req.session.login = true;
    req.session.mail = req.body.mail
    res.redirect( 'login.html' );
   }
  else if(user[0].pwd === req.body.pwd){
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.login = true
    req.session.mail = req.body.mail
    res.redirect( 'login.html' )
    
  }else {
    // password incorrect, redirect back to login page
    
    res.sendFile( __dirname + '/public/index.html' )
    
  }
})

app.post("/login", (req, res) => {
     // in a real request handler, this would be some sort of username
     // and password comparison in a database and using appropriate crypto
     if (req.body.username === "John" && req.body.password === "foobar99") {
         res.send("login successful");
     } else {
         res.status(401).send("Login failed");
     }
});

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.redirect('index.html')
})

const listener = app.listen(process.env.PORT || 3000);
