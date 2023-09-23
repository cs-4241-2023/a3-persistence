const express = require( 'express' ),
    mongodb = require( 'mongodb' ),
    cookie  = require( 'cookie-session' ),
    app = express(),
    appData=[]

require('dotenv').config();

app.use( express.static('./views/') )
app.use( express.json() )
app.use( express.urlencoded({ extended:true }) )



// #region Mongodb
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null;
let userID;
const db=client.db( process.env.DB );

client.connect()
    .then( () => {
        // will only create collection if it doesn't exist
        return db.collection( process.env.DB_TASKS )
    })
    .then( __collection => {
        // store reference to collection
        collection = __collection
        // blank query returns all documents
        return collection.find({ }).toArray()
    })

// route to get all docs
app.get( '/', (req,res) => {
    if( collection !== null ) {
        // get array and pass to res.json
        collection.find({ }).toArray().then( result => res.json( result ) )
    }
})
// #endregion

// Cookies
app.use( cookie({
    name: 'session',
    keys: ['key1', 'key2']
}))


app.post( '/login', async (req, res) => {
    console.log("Login post");
    // express.urlencoded will put your key value pairs
    // into an object, where the key is the name of each
    // form field and the value is whatever the user entered
    userID = await checkLoginInfo(req, res);

    if(userID !== null){
        req.session.login = true;
        res.redirect('app.html');
    }else{
        console.log("Fail")
        req.session.login = false;
    }
})
const checkLoginInfo=async (req, res)=>{
    let password = req.body.Password;
    let invalidInput = req.body.Username === null && password === null;
    if(!invalidInput){
        let info=await collection.findOne({'username': req.body.Username});

        /*
        for (let key in info){
            console.log(key);
        }*/
        if(info !== null){
            if(password===info.password){
                for(let userTask in info.tasks){
                    appData.push(userTask)
                }
                console.log("Successful Login");
                return info._id;
            }else{
                return null;
            }
        }else{
            //Account not found so make one
            console.log("Account not found, making one")
            let acc = {'username': req.body.Username, 'password': req.body.Password, 'tasks':JSON.stringify(appData)};
            return await collection.insertOne(acc);
        }
    }
}

//Load Table
app.get('/loadTasks',async (req, res) => {
    if (userID.toString() === process.env.ADMIN_ACCOUNT_ID) {
        collection.find({ }).toArray().then( result => res.json( result ) )
    }else{
        collection.find({_id:userID}).toArray().then( result => res.json( result ) )
    }
})


app.get( '/', (req,res) => {
    res.render( 'index', { msg:'', layout:false })
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
    if( req.session.login === true )
        next()
    else
        res.render('index', { msg:'login failed, please try again', layout:false })
})

app.get( './views/app.html', ( req, res) => {
    res.render( 'main', { msg:'success you have logged in', layout:false })
})



// Express dev

app.post( '/addTask', express.json(), ( req, res ) =>{
    appData.push( req.body.newData )
    res.writeHead( 200, { 'Content-Type': 'application/json'})
    res.end( JSON.stringify( appData ) )
})

app.post( '/signup', express.json(), ( req, res ) =>{
    appData.push( req.body.newData )
    res.writeHead( 200, { 'Content-Type': 'application/json'})
    res.end( JSON.stringify( appData ) )
})

app.listen( 3000 )