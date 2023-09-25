const express = require("express"),
	dotenv = require("dotenv").config(),
    app = express(),
    { MongoClient, ObjectId } = require("mongodb"),
	cookie = require('cookie-session'),
    port = 3000,
    data = [];

app.use(express.urlencoded({extended:true}))
app.use( cookie({
	name: 'session',
	keys: ['key1', 'key2']
}))

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient( uri )

let collection = null

async function run() {
	await client.connect()
	collection = await client.db("Project3").collection("Project3Data")

	const pipeline = [ { $match: { runtime: { $lt: 15 } } } ];
	const changeStream = collection.watch(pipeline);
	changeStream.on("change", ()=> {updateTable()});
}

run().catch(console.dir);

app.post( '/login', async (req, res) => {
	// express.urlencoded will put your key value pairs
	// into an object, where the key is the name of each
	// form field and the value is whatever the user entered
	let accessType;
	let logCorrect = false;
	try {
		const users = await client.db("Project3").collection("Users");
		const result = await users.find({User:req.body.username}).toArray();
		logCorrect = result[0].Pass === req.body.password
		accessType = result[0].Access;
	} catch (error) {
		console.error(error);
	}
	if (logCorrect) {
		// define a variable that we can check in other middleware
		// the session object is added to our requests by the cookie-session middleware
		req.session.login = true

		switch (accessType) {
			case "DungeonMaster":
				res.redirect('dm.html')
				break;
			case "Player":
				res.redirect('player.html')
				break;
			default:
				res.sendFile(__dirname + '/public/index.html')
				break;
		}
	} else {
		// password incorrect, redirect back to login page
		console.log("Log in details incorrect");
		//res.sendFile( __dirname + '/public/index.html' )
	}
})

// add some middleware that always sends unauthenticated users to the login page
app.use( function( req,res,next) {
	if( req.session.login === true )
		next()
	else
		res.sendFile( __dirname + '/public/index.html' )
})

app.use( express.static( 'public' ) )
app.use( express.json() )

app.use( (req,res,next) => {
	if( collection !== null ) {
		next()
	}else{
		res.status( 503 ).send()
	}
})

app.post( '/submit', (req, res) => {
  data.push( req.body._id )
  res.writeHead( 200, { 'Content-Type': 'application/json' })
  res.end( JSON.stringify( data ) )
})

app.post( '/add', async (req,res) => {
	const result = await collection.insertOne( req.body )
	res.json( result )
})

app.post( '/remove', async (req,res) => {
	const result = await collection.deleteOne({
		_id:new ObjectId(req.body._id)
	})
	res.json( result )
})

app.post( '/update', async (req,res) => {
	const result = await collection.updateOne(
		{ _id: new ObjectId( req.body._id ) },
		{ $set:{ name:req.body.name } }
	)

	res.json( result )
})

app.get("/docs", async (req, res) => {
	if (collection !== null) {
		const docs = await collection.find({}).toArray()
		res.json( docs )
	}
})

app.listen( process.env.PORT || port )
