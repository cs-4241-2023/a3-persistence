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
  //console.log(users)
} catch(err){
  console.error("database failed:", err)
}
}


app.post("/login", async (req, res) => {
  const user = req.body.username;
  const pass = req.body.password;
  let dis = await users.findOne({$and: [{ username: user }, { password: pass }]});
  console.log(dis)
  if (dis == null) {
    res.render("login", {
      message: "username not found, login failed!",
      layout: false,
    });
    req.session.login = false;
  } else {
    if (dis != null) {
      req.session.login = true;
      res.redirect("index.html");
    } else {
      res.render("login", {
        message: "username not found, login failed!",
        layout: false,
      });
       req.session.login = false; 
    }
  }
});

app.post("/submit", async (req, res) => {
  const result = await collection.insertOne(req.body);
  res.json(result);
});

app.get("/display", async (req,res)=>{
  const results= await collection.find({}).toArray()
  res.json(results);
});

app.post("/delete", async (req,res)=>{
  const results= await collection.deleteOnce({
    _id:new ObjectId(req.body._id)
  })
  res.json(results)
})

app.get("/", function (req, res) {
    res.render("login", { msg: "", layout: false });
  });
  
  app.use(function (req, res, next) {
    if (req.session.login === true) next();
    else
      res.render("login", {
        msg: "login failed, please try again",
        layout: false,
      });
  });
  
  app.get("/index.html", (req, res) => {
    res.render("index", { msg: "success you have logged in", layout: false });
  });
run()
app.listen(process.env.PORT || 3000);

