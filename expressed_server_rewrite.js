const exp = require("express");
const denv = require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const auth = require("passport");
const ghauth = require("passport-github").Strategy;
const cookie = require("express-session");
const app = exp();
const port = process.env.PORT;
const connect_uri = process.env.connectionStr;
const sec = process.env.ghAuthClientSecret;
const cID = process.env.ghAuthClientId;

const client = new MongoClient(connect_uri);
let collection = null;

const totalPrice = { totalPrice: 0.0 };
let retObject;
let groceryList = [];

app.use(exp.static("views"));
app.use(exp.static("public"));
app.use(exp.json());

async function run() {
  await client.connect();
  collection = await client.db("GroceryList").collection("Grocery_Items");

  app.use(
    cookie({
      secret: "areyoureadytorumbleelelelelelele",
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(auth.initialize());

  auth.use(
    new ghauth(
      {
        clientID: cID,
        clientSecret: sec,
        callbackURL: "http://localhost:3000/auth/github/callback",
      },
      async (accessToken, refreshToken, gituser, done) => {
        let user = await client
          .db("GroceryList")
          .collection("Users")
          .findOne({ githubId: gituser.id });
        //console.log("In here");
        if (!user) {
          const newUsr = {
            githubId: gituser.id,
            username: gituser.username,
            displayName: gituser.displayName,
          };

          let dummy = await client
            .db("GroceryList")
            .collection("Users")
            .insertOne(newUsr);
          if (!dummy) return done(new Error("Could not insert"));
          return done(null, newUsr);
        } else {
          return done(null, user);
        }
      }
    )
  );

  auth.serializeUser((user, done) => {
    //console.log("In here2");
    done(null, user);
  });

  auth.deserializeUser(async (user, done) => {
    //console.log("In here3");
    let testusr = await client
      .db("GroceryList")
      .collection("Users")
      .findOne({ user: user });
    if (!testusr) {
      return done(new Error("user not found"));
    }
    done(null, testusr);
  });

  app.get(
    "/auth/github",
    auth.authenticate("github", { scope: ["user: email"] })
  );
  app.get(
    "/auth/github/callback",
    auth.authenticate("github", { failureRedirect: "/" }),
    (req, res) => {
      //console.log(req);
      //console.log(req.isAuthenticated());
      req.session.login = true;
      res.redirect("/index");
    }
  );

  app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
  });

  app.get("/index", async (req, res) => {
    res.sendFile(__dirname + "/views/main.html");
  });

  app.post("/auth", async (req, res) => {
    let usr = await client
      .db("GroceryList")
      .collection("Users")
      .findOne({ uname: req.body.uname });

    if (usr.pw === req.body.pw) {
      req.session.login = true;
      req.session.user = usr
      res.redirect("/index");
    } else {
      res.redirect("/");
    }
  });

  app.use(function (req, res, next) {
    if (req.session.login === true) next();
    else res.redirect("/");
  });

  app.post("/newAc", async (req, res) => {
    let usr = await client
      .db("GroceryList")
      .collection("Users")
      .findOne({ uname: req.body.uname });
    if (usr === null) {
      let newusr = await client
        .db("GroceryList")
        .collection("Users")
        .insertOne({
          uname: req.body.uname,
          pw: req.body.pw,
        });
      req.session.login = true;
      req.session.user = await client.db("GroceryList").collection("Users").findOne(newusr.insertedId);

      res.redirect("/index");
    } else {
      res.redirect("/");
    }
  });

  app.post("/submit", async (req, res) => {
    //groceryList.push(req.body.item);
    let newItem = req.body.item;
    newItem.user = (!req.session.passport.user._id)?req.session.user._id:req.session.passport.user._id;
    const rst = await client.db("GroceryList").collection("Grocery_Items").insertOne(newItem);
    console.log(await rst);

    newItem = await client.db("GroceryList").collection("Grocery_Items").findOne(rst.insertedId)
    console.log(await newItem);
    groceryList = await client.db("GroceryList").collection("Grocery_Items")
    .find({user: (!req.session.passport.user._id)?req.session.user._id:req.session.passport.user._id})
    .toArray();
    calcTotalPrice((!req.session.passport.user._id)?req.session.user._id:req.session.passport.user._id);
    retObject = { groceryList, totalPrice};
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(retObject));
  });

  app.post("/modify", async (req, res) => {
    console.log("Here's the modify body", req.body)
    modifyPrice(req.body);
    calcTotalPrice((!req.session.passport.user._id)?req.session.user._id:req.session.passport.user._id);
    groceryList = await client.db("GroceryList").collection("Grocery_Items")
      .find({user: (!req.session.passport.user._id)?req.session.user._id:req.session.passport.user._id})
      .toArray()
    retObject = { groceryList, totalPrice };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(retObject));
  });

  app.delete("/reset", async (req, res) => {
    console.log(req);
    groceryList.splice(0, groceryList.length);
    client.db("GroceryList").collection("Grocery_Items").deleteMany({user : (!req.session.passport.user._id)?req.session.user._id:req.session.passport.user._id})
    calcTotalPrice((!req.session.passport.user._id)?req.session.user._id:req.session.passport.user._id);
    retObject = { groceryList, totalPrice };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(retObject));
  });

  app.delete("/del", async (req, res) => {
    console.log(req);
    deleteItems(req.body);
    groceryList = await client.db("GroceryList")
      .collection("Grocery_Items")
      .find({user : (!req.session.passport.user._id)?req.session.user._id:req.session.passport.user._id})
      .toArray();
    calcTotalPrice((!req.session.passport.user._id)?req.session.user._id:req.session.passport.user._id);
    retObject = { groceryList, totalPrice };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(retObject));
  });

  app.get("/items", async (req, res) => {
    let items = await client.db("GroceryList").collection("Grocery_Items").find({user : (!req.session.passport.user._id)?req.session.user._id:req.session.passport.user._id}).toArray();
    console.log(items);
    res.writeHead(200, {"Content-Type": "application/json"})
    res.end(JSON.stringify(items));
  })

  app.get("/logout", async (req, res) => {
    req.session.destroy();
    console.log(req.session)
    res.redirect("/");
  });

}

const calcTotalPrice = async function (usrSes) {
  totalPrice.totalPrice = 0.0;
  if (groceryList.length !== 0) {
    groceryList.forEach((item) => {
      if (!isNaN(parseFloat(item.price))) {
        totalPrice.totalPrice += parseFloat(item.price);
      } else {
        totalPrice.totalPrice += 0.0;
      }
    });
  }
  const addPrice = {
    $set :{
      totalPrice
    }
  }

  let usr = await client.db("GroceryList").collection("Users").updateOne({_id: new ObjectId(`${usrSes}`)}, addPrice);
  if(!usr){
    return(new Error("Couldn't update user's total price"));
  }
};

const modifyPrice = async function (data) {
  console.log("New price: ", data.price)
  const updater = {$set: {
    price: data.price
  }};
  console.log(data)
  data.items.forEach(async (_updateId) => {
    let mod = await client.db("GroceryList").collection("Grocery_Items").updateOne({_id : new ObjectId(`${_updateId}`)}, updater)
    console.log(mod);
    if(!mod){
      return (new Error("Couldn't modify item pricing"))
    }
  });
};

const deleteItems = async function (data) {

  data.items.forEach(async (_delId) => {
    let del = await client.db("GroceryList").collection("Grocery_Items").deleteOne({_id : new ObjectId(`${delId}`)})
    if(!del){
      return (new Error("Couldn't delete item"))
    }
  });

};

run();

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
