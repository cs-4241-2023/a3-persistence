const { dir } = require("console");

const express = require("express"),
     {mongodb, ObjectId,MongoClient} = require("mongodb"),
       cookie  = require( 'cookie-session' ),
      hbs     = require( 'express-handlebars' ).engine,
   app = express();

app.use( express.urlencoded({ extended:true }) )
app.use(express.json());
app.use(express.static("public"));
app.engine( 'handlebars', hbs() )
app.set('view engine', 'handlebars' )
app.set('views','./views' )

const algo='sha256';
const hash= crypto.createHash(algo);

app.use(cookie({
  name: 'session',
  keys: ['key1', 'key2']
}));

require('dotenv').config()
const url= `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}/?retryWrites=true&w=majority&appName=AtlasApp`
const dbconnect= new MongoClient(url)

let collection;
let users;


async function run() {
  try{
 await dbconnect.connect().then(()=>console.log("db works"))
  collection = await dbconnect.db("a3-Persistence").collection("a3");
  users = await dbconnect.db("a3-Persistence").collection("users");  
} catch(err){
  console.error("database failed:", err)
}
}

/*app.use( (req,res,next) => {
    if( (collection !== null) ||(users !== null)) {
      next()
    }else{
      res.status( 503 ).send()
    }
  })*/

app.post("/login", async (req, res) => {
  let user = req.body.username;
  //let pass = hash.update(req.body.password).digest('hex');
  //9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
  //console.log(pass)
  //console.log(pass)
  let pass = req.body.password;
  let dis = await users.findOne({$and: [{ username: user }, { password: pass }]});

 // console.log(dis)
    if (dis != null) {
      req.session.login = true;
      res.render('webpage', {message: "Login successful", layout: false})
      //It cannot index.handlebars

    } else {
      req.session.login = false; 
      res.render("index", {message: "incorrect username or password, login failed try again!", layout: false,}); 
    }
});

app.post("/submit", async (req, res) => {
  const result = await collection.insertOne(req.body);
  res.json(result);
});

app.get("/display", async (req,res)=>{
  const results= await collection.find({}).toArray()
  //console.log(results)
  res.json(results);
});

app.post("/delete", async (req,res)=>{

  const results= await collection.deleteOne({
    _id:new ObjectId(req.body._id)
  })
  res.json(results)
})

app.get("/", function (req, res) {
    res.render("index", { msg: "", layout: false });
  });

  app.post( '/update', async (req,res) => {
    const result = await collection.updateOne(
      { _id: new ObjectId( req.body._id ) },
      {$set: {
          Email: req.body.Email, 
          Name: req.body.Name,
          Birth: req.body.Birth,
          Age: req.body.Age,
        },
      }
    )
  
    res.json( result )
  })
  
  /*app.use(function (req, res, next) {
    if (req.session.login === true) {
        next();
    }
    else{
      res.render("index", {
        msg: "login failed, please try again",
        layout: false,
      });
    }
  });*/
/*  
  app.get("/index.html", (req, res) => {
    res.render("webpage", { msg: "success you have logged in", layout: false });
  });*/
run()
app.listen(process.env.PORT || 3000);

