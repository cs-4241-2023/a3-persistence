
const appdata = [
  { 'id': 0, 'yourName': 'Bright', 'yourKills': 10, 'yourDeaths': 5, 'yourAssists': 1, 'KDA': 2.2},
  { 'id': 1, 'yourName': 'Nelson', 'yourKills': 20, 'yourDeaths': 50, 'yourAssists': 3, 'KDA': .46 }
]


require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);
let collection = null

async function run() {
  await client.connect()
  collection = await client.db("a3").collection("score")
  loginCollection = await client.db("a3").collection("login")
}
run();



const express = require('express'),
      cookie = require ('cookie-session'),
      app = express(),
      port = process.env.PORT || 3000


app.use(express.json())


app.use( express.urlencoded({ extended:true }) )

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))



app.post( '/login', async (req,res)=> {
  let username = req.body.username;
  let password = req.body.password;

  console.log(await loginCollection.findOne({username, password}))
  
  if(await loginCollection.findOne({username, password})) {
    req.session.login = true
    req.session.username = username

    res.redirect( 'index.html' )
  }else{
    res.sendFile( __dirname + '/public/login.html' )
  }
})



app.use( function( req,res,next) {
let robot = req.url.includes('robots.txt')

  if( req.session.login === true || robot)
    next()
  else
    res.sendFile( __dirname + '/public/login.html' )
})

// serve up static files in the directory public
app.use( express.static('public') )





app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})



app.get('/start', async (req, res) => {
  let username = req.session.username
  const data = await collection.find({username}).toArray();
  res.json(data)
})




// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/delete', async (req,res) => {
  const result = await collection.deleteOne({ 
    id:req.body.id
  })

  res.json( result )
})





app.post( '/modify', async (req,res) => {
 
  const result = await collection.updateOne(
    { id: req.body.id },
    { $set:{ yourName:req.body.yourName, yourKills:req.body.yourKills, yourDeaths:req.body.yourDeaths, yourAssists:req.body.yourAssists, KDA:(req.body.yourKills + req.body.yourAssists) / req.body.yourDeaths } }
  )

    let data = req.body
    data.KDA = (req.body.yourKills + req.body.yourAssists) / req.body.yourDeaths

  res.json( data )
})




app.post('/submit', async (req, res) => {
  let data = req.body
  // KDA = (kills + assists)/ deaths 
  let kills = data.yourKills
  let deaths = data.yourDeaths
  let assists =  data.yourAssists
  let kda = (kills + assists) / deaths
  
  data.KDA = kda
  data.username = req.session.username

  const result = await collection.insertOne( data )
  res.json( data )
})






app.listen(port, (error) =>{
  if(!error){
    console.log("Server is Successfully Running, and App is listening on port", port);
  }else{
    console.log("Error occurred, server can't start", error);
  }
});
