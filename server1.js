require('dotenv').config()

const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      cookie  = require( 'cookie-session' ),
      app = express()

const port = 3000;
const appdata = [];
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public") ) //might need to change
app.use(express.json() )

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@clusteraj.9ts6s0b.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient( uri )
let collection = null
let username = null
let password = null


app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))


app.post( '/login', async (req,res)=> {
  const actionType = req.body.action;
  if(actionType === 'login'){
    const query = {
      $and: [
        { 'Username': req.body.username },
        { 'Password': req.body.password }
      ]
    }
    result = await collection.findOne(query)
    //console.log(req.body.username, req.body.password, result.matchedCount)
    if( result != null ) { //need to change for all passwords

      req.session.login = true
      console.log('login succesful')
      res.redirect( '/login.html' )
      console.log('login succesful')
      username = req.body.username
      password = req.body.password
    }else{
      console.log('incorrect password')
      res.sendFile( __dirname + '/public/index.html' )
    }
  } else if (actionType === 'create'){
    const result = await collection.insertOne( { Username: req.body.username , Password: req.body.password, ToDo: [] } )
    res.json( result )
    //console.log(req.body)
  }

  else{
    console.log('didnt work')
  }
})

app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/index.html' )
})

async function run() {
  await client.connect()
  collection = await client.db("Mydata").collection("Mydata")
}
run()


app.use( (req,res,next) => {
    if( collection !== null ) {
      next()
    }else{
      res.status( 503 ).send()
    }
})

const path = require('path');

// app.post('/submit', async (req, res) => {
//     const result = await collection.insertOne( req.body )
//     res.json( result )
// });


app.post('/submit', async (req, res) => {
  console.log(req.body)
  const result = await collection.updateOne(
    {'Username': username},
    { $push: { ToDo: {
      id: req.body.id,
      task: req.body.task,
      date: req.body.date}
    }})
    console.log(result.matchedCount, result.modifiedCount, username)
    console.log(result)
  res.json( result )
});

app.get("/get-list", async (req, res) => {
    console.log("get")
    // const docs = await collection.find({'Username': username})//.ToDo.toArray()
    // doc = docs.ToDo.toArray
    const cursor = await collection.find({'Username': username});
    const docs = await cursor.toArray();
    
    const todos = docs.map(doc => doc.ToDo).flat(); 

    //console.log(docs, todos)
    res.json( todos )  
    //res.json( docs )    
})

app.post( '/delete-row/:id', async (req,res) => {
    const result = await collection.deleteOne({ 
    id: req.params.id
  })
  // const cursor = await collection.find({'Username': username});
  // const docs = await cursor.toArray();  
  // const todos = docs.map(doc => doc.ToDo).flat(); 
  // const result = await todos.deleteOne({
  //   id: req.params.id
  // })

  //   const id = req.params.id;
    res.json( result )
})

// app.post( '/delete-row/:id', async (req,res) => {
//   const doc = find({'Username': username});
//   const result = await doc.updateOne(

//   )
//   const result = await collection.updateOne(
//   {id: req.params.id},
//   { $set: 
//       {
//           task: req.body.task,
//           date: req.body.date
//    }},
//   )
//   res.json( result )
// })

app.post( '/edit-row/:id', async (req,res) => {
  
  console.log('result')
  
  console.log(req.body)
  console.log(req.body.id)
  const result = await collection.updateOne(
    { 'Username': username, 'ToDo.id': req.body.id },
    {
      
    $set: {
      
      'ToDo.$.task': req.body.task,
      'ToDo.$.date': req.body.date
    }}
    
    )
    //console.log(ToDo.$.task)
    //console.log(result)
    //const doc = find({'Username': username});
  // const result = await doc.updateOne(
  // {id: req.params.id},
  // { $set: 
  //     {
  //         task: req.body.task,
  //         date: req.body.date
  //  }},
  // )
  res.json( result )
})

// app.post( '/edit-row/:id', async (req,res) => {
//     console.log(req.body.task)
//     console.log(req.body.date)
//     const result = await collection.updateOne(
//     {id: req.params.id},
//     { $set: 
//         {
//             task: req.body.task,
//             date: req.body.date
//      }},
//     )
//     res.json( result )
//   })

app.listen(process.env.PORT || port, () => {
    console.log(`Server listening at ${port}`);
});

