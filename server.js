const express    = require('express'),
    app          = express(),
    mongodb      =require("mongodb"),
    bodyParser   =require("body-parser"),
    appData      = []

app.use(bodyParser.urlencoded({extended:true}))
app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )


const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST;
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true });

//Grabs Json body and puts it in req
app.post( '/submit', (req, res) => {
    appData.push( req.body.newdata )
    res.writeHead( 200, { 'Content-Type': 'application/json' })
    res.end( JSON.stringify( appData ) )
})

app.listen( 3000,()=>{
    console.log("Connected");
} )