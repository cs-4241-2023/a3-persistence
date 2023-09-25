require('dotenv').config()

const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      cookie  = require( 'cookie-session' ),
      app = express()

const port = 3000;
const appdata = [];
app.use(express.urlencoded({ extended: true }));



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@clusteraj.9ts6s0b.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient( uri )
// let collection = null
// let username = null
// let password = null
let userC = null
let taskC = null

console.log("Pinged your deployment. You successfully connected to MongoDB!1");
async function run() {
  console.log("Pinged your deployment. You successfully connected to MongoDB!2");
  await client.connect();
  userC = client.db("webwareProj").collection("users");
  taskC = client.db("webwareProj").collection("tasks");
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!3");
}
run().catch(console.dir)

app.use(express.json() )
app.use(express.static("public") ) //might need to change


// app.use( cookie({
//   name: 'session',
//   keys: ['key1', 'key2']
// }))
// app.post('/login', async (req, res) => {
//   const user = req.body.username
//   const password = req.body.password
//   // Check if user exists
//   const exists = await userCollection.findOne({ user: user });
//   // If user exists, check password
//   if (exists) {
//     console.log(exists.password)
//     if (exists.password === password) {
//       res.json({ success: true });
//       res.redirect( '/index.html' )
//     } 
//     else {
//       console.log('incorrect password')
//       res.sendFile( __dirname + '/public/index.html' )
//       res.json(null);

//     }
//   } 
//   else {
//     // If user does not exist, create new user
//     const newUser = {
//       user,
//       password
//     }
//     const result = await userCollection.insertOne(newUser);
//     res.json(result);
//   }
// });

// Handle POST requests
app.post('/login', async (req, res) => {
  const user = req.body.username
  const password = req.body.password
  // Check if user exists
  const exists = await userC.findOne({ user: user });
  // If user exists, check password

  if (exists) {
    //console.log(exists.pass)
    if (exists.password === password) {
      
      res.json({ success: true });
      //res.redirect( '/index.html' )
    } 
    else {
      res.json(null);
    }
  } 
  else {
    console.log("Username or Password does not exist")
  }
});

app.post('/register', async (req, res) => {
  
  const user = req.body.username
  const password = req.body.password
  // Check if user exists
  const exists = await userC.findOne({ user: user });
  // If user exists, check password

  if (exists) {
    //console.log(exists.pass)
    console.log('User Already Exists')
  } 
  else {
    // If user does not exist, create new user
    const newUser = {
      user,
      password
    }
    const result = await userC.insertOne(newUser);
    console.log('Succesfully Registered')
    res.json(result);
  }
});

app.get('/get-list/:user', async (req, res) => {
  const user = req.params.user;
  console.log('getting')
  if (taskC !== null) {
    const docs = await taskC.find({ user: user }).toArray()
    res.json(docs)
  }
});

app.post('/submit', async (req, res) => {
  const data = req.body;
  console.log(data);
  // add to appropriate collection
  const result = await taskC.insertOne(data);
  res.json(result);
});

// Handle DELETE requests
app.delete('/delete-row/:id', async (req, res) => {
  // Get id from URL params
  const id = req.params.id;
  const result = await taskC.deleteOne({ 
    id: id
  })
  res.json(result);
});

// Handle PUT requests
app.put('/edit-row/:id', async (req, res) => {
  // Get id from URL params
  const id = req.params.id;
  const result = await taskC.updateOne({
    id: id
  }, {
    $set: req.body
  })
  res.json(result);

});


// app.use( function( req,res,next) {
//   if( req.session.login === true )
//     next()
//   else
//     res.sendFile( __dirname + '/public/index.html' )
// })

// async function run() {
//   await client.connect()
//   collection = await client.db("Mydata").collection("Mydata")
// }
// run()


// app.use( (req,res,next) => {
//     if( collection !== null ) {
//       next()
//     }else{
//       res.status( 503 ).send()
//     }
// })

// const path = require('path');

// // app.post('/submit', async (req, res) => {
// //     const result = await collection.insertOne( req.body )
// //     res.json( result )
// // });


// app.post('/submit', async (req, res) => {
//   console.log(req.body)
//   const result = await collection.updateOne(
//     {'Username': username},
//     { $push: { ToDo: {
//       id: req.body.id,
//       task: req.body.task,
//       date: req.body.date}
//     }})
//     console.log(result.matchedCount, result.modifiedCount, username)
//     console.log(result)
//   res.json( result )
// });

// app.get("/get-list", async (req, res) => {
//     console.log("get")
//     // const docs = await collection.find({'Username': username})//.ToDo.toArray()
//     // doc = docs.ToDo.toArray
//     const cursor = await collection.find({'Username': username});
//     const docs = await cursor.toArray();
    
//     const todos = docs.map(doc => doc.ToDo).flat(); 

//     //console.log(docs, todos)
//     res.json( todos )  
//     //res.json( docs )    
// })

// app.post( '/delete-row/:id', async (req,res) => {
//     const result = await collection.deleteOne({ 
//     id: req.params.id
//   })
//   // const cursor = await collection.find({'Username': username});
//   // const docs = await cursor.toArray();  
//   // const todos = docs.map(doc => doc.ToDo).flat(); 
//   // const result = await todos.deleteOne({
//   //   id: req.params.id
//   // })

//   //   const id = req.params.id;
//     res.json( result )
// })

// // app.post( '/delete-row/:id', async (req,res) => {
// //   const doc = find({'Username': username});
// //   const result = await doc.updateOne(

// //   )
// //   const result = await collection.updateOne(
// //   {id: req.params.id},
// //   { $set: 
// //       {
// //           task: req.body.task,
// //           date: req.body.date
// //    }},
// //   )
// //   res.json( result )
// // })

// app.post( '/edit-row/:id', async (req,res) => {
  
//   console.log('result')
  
//   console.log(req.body)
//   console.log(req.body.id)
//   const result = await collection.updateOne(
//     { 'Username': username, 'ToDo.id': req.body.id },
//     {
      
//     $set: {
      
//       'ToDo.$.task': req.body.task,
//       'ToDo.$.date': req.body.date
//     }}
    
//     )
//     //console.log(ToDo.$.task)
//     //console.log(result)
//     //const doc = find({'Username': username});
//   // const result = await doc.updateOne(
//   // {id: req.params.id},
//   // { $set: 
//   //     {
//   //         task: req.body.task,
//   //         date: req.body.date
//   //  }},
//   // )
//   res.json( result )
// })

// // app.post( '/edit-row/:id', async (req,res) => {
// //     console.log(req.body.task)
// //     console.log(req.body.date)
// //     const result = await collection.updateOne(
// //     {id: req.params.id},
// //     { $set: 
// //         {
// //             task: req.body.task,
// //             date: req.body.date
// //      }},
// //     )
// //     res.json( result )
// //   })

app.listen(process.env.PORT || port, () => {
    console.log(`Server listening at ${port}`);
});

