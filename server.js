const express = require( 'express' ),
    mongodb = require( 'mongodb' ),
    cookie  = require( 'cookie-session' ),
    app = express()

require('dotenv').config();

app.use( express.static('./views/') )
app.use( express.json() )
app.use( express.urlencoded({ extended:true }) )



// #region Mongodb
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collectionID=process.env.DB_USERS;
let userID;
const db=client.db( process.env.DB );

client.connect()
    .then( () => {
        // will only create collection if it doesn't exist
        return db.collection( collectionID )
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



app.post( '/login', async (req, res) => {
    console.log("Login post");
    userID = await checkLoginInfo(req, res);

    if(userID !== null){
        req.session.login = true;
        res.redirect('app.html');
    }else{
        console.log("User ID is null")
        res.redirect('failedLogin.html');
    }
})


app.post( '/createAccount', async (req, res) => {
    console.log("Create Account");
    userID = await checkCreateAccount(req, res);

    if(userID !== null && userID !== undefined){
        req.session.login = true;
        res.redirect('app.html');
    }else{
        console.log("User ID is null")
    }
})

const checkCreateAccount=async (req,res)=>{
    let userCollection=db.collection( process.env.DB_USERS );
    let info=await userCollection.findOne({'username': req.body.Username});
    if(info === null || info === undefined){
        console.log("Account not found, making one")
        let acc = {'username': req.body.Username, 'password': req.body.Password};
        return await userCollection.insertOne(acc);
    }else{
        res.sendFile(__dirname+'/views/failedSignup.html');
    }
}

const checkLoginInfo=async (req, res)=>{
    let collection=db.collection( process.env.DB_USERS );
    let password = req.body.Password;
    let invalidInput = req.body.Username === null && password === null;
    if(!invalidInput){
        console.log(req.body.Username+" "+req.body.Password)
        let info=await collection.findOne({'username': req.body.Username});
        if(info !== null){
            if(password===info.password){
                return info._id;
            }else{
                console.log("Incorrect Password");
                res.sendFile(__dirname+'/views/createAccount.html');
                return null;
            }
        }else{
            console.log("No Account Found");
            return null;
        }
    }
}

//Load Table
app.get('/loadTasks',async (req, res) => {
    let collection=db.collection( process.env.DB_TASKS );
    if(userID!==null) {
        if (userID.toString() === process.env.ADMIN_ACCOUNT_ID) {
            console.log("ADMIN")
            collection.find().toArray().then( result => {
                res.json( result )
            } )
        }else{
            collection.find({userID:userID}).toArray().then( result => {
                res.json( result )
            }  )
        }
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



app.post( '/submit', express.json(), async (req, res) => {
    let collection=db.collection( process.env.DB_TASKS );
    if(userID !== process.env.ADMIN_ACCOUNT_ID){
        let info=req.body;
        await collection.insertOne(
            {userID:userID, task:info.task, creationDate: info.creationDate, deadline: info.deadline}
        )
    }
    res.end();
})

app.post('/update',express.json(),(req,res)=>{

})

app.listen( 3000 )