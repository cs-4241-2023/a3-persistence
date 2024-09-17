//SERVER SIDE
const express = require( 'express' ),
cookie=require('cookie-session'),
crypto=require('crypto'),
 dotenv = require('dotenv').config(),
{ MongoClient, ObjectId } = require('mongodb'),
      app = express(),
      port = 3000

const logger = (req,res,next) => {
  console.log( 'url:', req.url )
  next()
}
app.use( express.static( 'public' ) )

app.use( express.json() )
// use express.urlencoded to get data sent by defaut form actions

app.use( express.urlencoded({ extended:true }) )

const key1 = crypto.randomBytes(32).toString('hex')
const key2 = crypto.randomBytes(32).toString('hex')
// cookie middleware
app.use( cookie({
  name: 'session',
  keys: [key1, key2]
}))


app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.qsmz2rk.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`;
console.log(uri)

const client = new MongoClient( uri )

let collection = null
let userCollection = null
let username = '' //init username
async function run() {
  try {
    await client.connect();
    collection = await client.db("dbtest").collection("col1")
    userCollection = await client.db("dbtest").collection("users")
    console.log("Connected to MongoDB Atlas")
  } catch (error) {
    console.error("MongoDB connection error:", error)
  }

  // route to get all docs
  app.get("/docs/:username", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({username:username}).toArray()
      res.json( docs )
    }
  })
}

run()

app.listen( process.env.PORT || port )




//login stuff
app.post('/login', async (req, res) => {
  username = req.body.username
  const password = req.body.password

  try {
    const existingUsername = await userCollection.findOne({ username: username })
    if (existingUsername) {
      if (existingUsername.password === password) {
        req.session.login = true;
        res.status(200).json({ message: 'Successful Login' })
       // res.redirect('main.html')
      } else {
        res.render(__dirname + '/public/index.html')
        //res.status(404).json({ message: 'Password not found' })
      }
    } else {
      // create new user
      const newUser = {
        username,
        password,
      }
      const result = await userCollection.insertOne(newUser)
      console.log(result)
      res.json(result)
    }
  } catch (error) {
    console.error('Error during findOne operation:', error)
    res.status(500).json({ message: 'Server error during login' })
  }
})



app.post( '/add', async (req,res) => {
  try {
    const newItem = req.body;
    newItem.username = username 

    const existingItem = await collection.findOne(newItem)
    if (existingItem) {
      return res.status(409).json({message: "Duplicate entry. "})
    }

    const result = await collection.insertOne(newItem)

    res.status(200).json({ message: 'Data added to MongoDB', result })
  } catch (error) {
    console.error('Error adding data to MongoDB:', error)
    res.status(500).json({ message: 'Failed to add data to MongoDB' })
  }
}) 
app.put('/update/:id', async (req, res) => {
  try {
    const id = req.params.id
    const updatedData = req.body
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    )

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Item updated successfully' });
    }
    else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error('Error updating data in MongoDB:', error);
    res.status(500).json({ message: 'Failed to update data in MongoDB' })
  }
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.

app.delete('/remove/:id', async (req, res) => {
  
  console.log("received delete request")
  try {
    const id = req.params.id;
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Item deleted successfully' })
    }  
    else {
      res.status(404).json({ message: 'Item not found' })
    }
  } 
  catch (error) {
    console.error('Error deleting data from MongoDB:', error)
    res.status(500).json({ message: 'Failed to delete data from MongoDB' })
  }
})


app.post( '/update', async (req,res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId( req.body._id ) },
    { $set:{ name:req.body.name } }
  )

  res.json( result )
})


app.get('/docs/:username', async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({username:username}).toArray();
    res.json(docs);
  }
});


app.get('/', (request, response) => {
  response.render('public/index.html')
})