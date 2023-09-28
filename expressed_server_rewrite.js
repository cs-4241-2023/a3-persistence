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
const groceryList = [];

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
    /**
     * duplicate account creation logic
     */
    if (usr === null) {
      let newusr = await client
        .db("GroceryList")
        .collection("Users")
        .insertOne({
          uname: req.body.uname,
          pw: req.body.pw,
        });
      req.session.login = true;

      res.redirect("/index");
    } else {
      res.sendFile(__dirname + "/views/index.html");
    }
  });

  app.post("/submit", async (req, res) => {
    groceryList.push(req.body.item);
    console.log("Printing session: ", req.session)
    //const rst = await collection.insertOne(req.body.item);
    //console.log(await rst);
    calcTotalPrice();
    retObject = { groceryList, totalPrice };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(retObject));
  });

  app.post("/modify", (req, res) => {
    modifyPrice(req.body);
    calcTotalPrice();
    retObject = { groceryList, totalPrice };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(retObject));
  });

  app.delete("/reset", (req, res) => {
    console.log(req);
    groceryList.splice(0, groceryList.length);
    calcTotalPrice();
    retObject = { groceryList, totalPrice };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(retObject));
  });

  app.delete("/del", (req, res) => {
    console.log(req);
    deleteItems(req.body);
    calcTotalPrice();
    retObject = { groceryList, totalPrice };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(retObject));
  });

}

const calcTotalPrice = function () {
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
};

const modifyPrice = function (data) {
  data.items.forEach((idx) => {
    console.log(groceryList[idx]);
    groceryList[idx].price = data.price;
  });
};

const deleteItems = function (data) {
  for (let i = groceryList.length - 1; i >= 0; i--) {
    data.every((idx) => {
      if (idx === i) {
        groceryList.splice(i, 1);
        return false;
      }
      return true;
    });
  }
};

run();

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
