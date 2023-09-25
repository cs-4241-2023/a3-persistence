const express    = require('express'),
      app        = express(),
      { MongoClient, ObjectId } = require('mongodb')
  
let cardata    = []
let nextId = 1

const url = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.kxz0njx.mongodb.net/?retryWrites=true&w=majority`

app.use( express.static( 'public' ) )
app.use( express.json() )


const client = new MongoClient( url )

let cardata2 = null

async function run() {
  await client.connect()
  cardata2 = await client.db("data").collection("cardata")
}

run()

// route to get all docs
app.get("/docs", async (req, res) => {
  if (cardata2 !== null) {
    const docs = await cardata2.find({}).toArray()
    res.json( docs )
  }
})

app.post( '/docs', async (req,res) => {
  console.log("POST 2: ")
  console.log(req.body)
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