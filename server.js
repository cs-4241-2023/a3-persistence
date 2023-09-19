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
let username=null;
let password=null;
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
    .then( console.log )

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
    console.log(req.body)


    const result = await checkLoginInfo(req, res);

    if(result !== null){
        req.session.login = true;
        res.redirect('app.html')
        console.log("Login Success")
    }else{
        console.log("Fail")
    }


})

let Username;
const checkLoginInfo=async (req, res)=>{
    Username=req.body.Username;
    let password = req.body.Password;
    let invalidInput = req.body.Username === null && password === null;
    if(!invalidInput){
        let userAcc = {'username': Username};
        let info=await collection.findOne({'username': Username});
        if(info !== null){
            if(password===info.password){
                console.log("Successful Login");
            }else{
                console.log("Incorrect password");
            }
        }else{
            //Account not found
        }
    }
}



app.post( '/signup', (req,res)=> {
    let collection = client.db( process.env.DB ).collection(process.env.DB_USERS)
    let acc = {'username': req.body.Username, 'password': req.body.Password};

    db.collection(process.env.DB_USERS).findOne(acc).then( (data) => {
        if( data !== null ) {
            //TODO: Add encryption
            collection.insertOne(acc).then(()=> {
                res.redirect('app.html')
            });
        }else{
            console.log("Fail")
        }
    })
})


//Load Table
app.get('/loadTasks',(req,res)=>{
    //If the collection isn't null, return the corresponding tasks
    if(true){

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

// server
const middleware_post = ( req, res, next ) => {
    let dataString = ''

    req.on( 'data', function( data ) {
        dataString += data
    })

    req.on( 'end', function() {
        const json = JSON.parse( dataString )
        appData.push( json )

        // add a 'json' field to our request object
        // this field will be available in any additional
        // routes or middleware.
        req.json = JSON.stringify( appData )

        // advance to next middleware or route
        next()
    })
}

app.use( middleware_post )

app.post( '/signup', express.json(), ( req, res ) =>{
    appData.push( req.body.newData )
    res.writeHead( 200, { 'Content-Type': 'application/json'})
    res.end( JSON.stringify( appData ) )
})

app.use( (req,res,next) => {
    if( collection !== null ) {
        next()
    }else{
        res.status( 503 ).send()
    }
})

const logger = (req,res,next) => {
    console.log( 'url:', req.url )
    next()
}

app.use( logger )

app.listen( 3000 )