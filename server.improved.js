const express = require('express'),
    mongodb = require('mongodb'),
    cookie = require('cookie-session'),
    app = express()


app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(express.json())
app.set('trust proxy', 1)
app.use(cookie({
    name: 'session',
    keys:["key1","key2"]
}))
// app.get( '/', ( req, res ) => res.send( 'test') )


const { MongoClient, ServerApiVersion } = require('mongodb');
const {response} = require("express");
const uri = "mongodb+srv://adedejisultan02:sultan@cluster0.xpt23wq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
let collection = null
let id


client.connect()
    .then( () => {
        // will only create collection if it doesn't exist
        return client.db( 'a3-persistence' ).collection( 'table' )
    })
    .then( __collection => {
        // store reference to collection
        collection = __collection
        // blank query returns all documents
        return collection.find({ }).toArray()
    })
    // .then( console.log )

// route to get all docs
app.get( '/currentdb', async (req,res) => {
    req.body.username = req.session.username
    req.body.password = req.session.password
    if( collection !== null ) {
        // get array and pass to res.json
        collection.find({"username": req.body.username}).toArray().then( result => res.json( result ) )
    }
})

//add
app.post('/add',(req,res)=>{
    req.body.username = req.session.username
    req.body.password = req.session.password
    collection.insertOne( req.body )
    collection.find({"username": req.body.username}).toArray().then(result => res.json(result))
})
app.post('/delete',(req,res)=>{
    req.body.username = req.session.username
    req.body.password = req.session.password
    collection.deleteOne({"Task": req.body.Task}).then(result => res.json(result))
})
app.post('/edit',(req,res)=>{
    req.body.username = req.session.username
    req.body.password = req.session.password
    collection.findOne({"Task": req.body.Task}).then(result => res.json(result))
})

app.post('/login', async (req, res) => {
    try {
        req.session.username = req.body.username
        req.session.password = req.body.password
        let query = {$and: [{username: req.session.username}, {password: req.session.password}]}
        let result = await collection.findOne(query)
        if (result !== null)
            res.sendFile(__dirname + '/public/login.html')
        else {
            //Deny access
            if (req.session.username !== '' && req.session.password !== '') {
                const newUser = {
                    username: req.session.username,
                    password: req.session.password,
                    task: '',
                    date: '',
                    priority: ''
                }
                const result = await collection.insertOne(newUser)
                // obj = await collection.find({"username": req.session.username})
                // console.log(obj)
                res.sendFile(__dirname + '/public/login.html')
            }
            res.sendFile(__dirname + '/public/index.html')
        }
    } catch {
        res.status(500).json({ message: 'Server error during login' })
    }
  })

// add some middleware that always sends unauthenicaetd users to the login page


app.post('/save',(req,res)=>{
    req.session.username = req.body.username
    req.session.password = req.body.password
    console.log(req.body)
    result = collection.updateOne(
        {"Task": req.body.Task},{$set: {
                Task: req.body.Task,
                Date: req.body.Date,
                Priority: req.body.Priority
            }})

    console.log()
   // ).then(result => res.json(result))
})

app.listen( 3000 )

