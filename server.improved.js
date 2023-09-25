const express = require("express"),
  { MongoClient, ObjectId } = require("mongodb"),
  cookie = require("cookie-session"),
  hbs = require("express-handlebars").engine,
  app = express(),
  mime = require("mime"),
  dir = "public/",
  port = 3000,
  bcrypt = require("bcrypt"),
  saltRounds = 10,
  groceryList = [];

app.use(express.static(dir));
app.use(express.static("views"));
app.use(express.json());

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use(express.urlencoded({ extended: true }));
//app.use( express.json() )

// handlebars template engine
app.engine("handlebars", hbs());
app.set("view engine", "handlebars");
app.set("views", "./views");

// cookie middleware! The keys are used for encryption and should be changed
app.use(
  cookie({
    name: "session",
    keys: ["JcGkmidI6fmHVsI4YdaZCnVOEMCKynt2", "25nced2PvdXTiIjVa165IoPt7PdeyvuE"],
  })
);

const url = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.xm5g03c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url);

let collection = null;
let userCollection = null;
let user = null;

async function run() {
  await client.connect();
  collection = await client.db("datatest").collection("test");
  userCollection = await client.db("datatest").collection("userCollection");
}

run();

// middleware that makes sure the collection link has been established/authenticated correctly
// wasteful to check collection before every route so creating function before
// all routes means middleware will get called before all routes are called
// and check will be completed before it tries to execute any of the routes
app.use((req, res, next) => {
  if (collection !== null && userCollection != null) {
    next();
  } else {
    res.status(503).send();
  }
});

// route to get all docs
app.get("/docs", async (req, res) => {
  const docs = await collection.find({}).toArray();
  res.json(docs);
});

// to insert document into database
app.post("/add", async (req, res) => {
  let result = await collection.insertOne({
    user: user,
    item: req.body.item,
  });

  let update = await collection.updateOne(
    {
      user: user,
      item: req.body.item,
    },
    {
      $set: {
        user: user,
        item: req.body.item,
        quantity: Number(req.body.quantity),
        price: Number(req.body.price),
        cost: Number(getCost(req.body.price, req.body.quantity)),
        productType: req.body.productType,
        productDetails: req.body.productDetails,
      },
    }
  );

  const userList = await collection.find({ user: user }).toArray();
  userList.forEach((item) => {
    console.log("add: " + JSON.stringify(Object.values(item)));
  });
  res.json(userList);
});

// delete by passing new object ID
// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post("/remove", async (req, res) => {
  const result = await collection.deleteOne({
    _id: new ObjectId(req.body._id),
  });

  const userList = await collection.find({ user: user }).toArray();
  res.json(userList);
});

// update by passing new object ID
app.post("/update", async (req, res) => {
  console.log(req.body.updateId);
  let update = await collection.updateOne(
    {
      user: user,
      item: req.body.item,
    },
    {
      $set: {
        item: req.body.item,
        quantity: Number(req.body.quantity),
        price: Number(req.body.price),
        cost: Number(getCost(req.body.price, req.body.quantity)),
        productType: req.body.productType,
        productDetails: req.body.productDetails,
      },
    }
  );

  const userList = await collection.find({ user: user }).toArray();
  userList.forEach((item) => {
    console.log("updated list: " + JSON.stringify(Object.values(item)));
  });
  res.json(userList);
});

app.get("/data", async (req, res) => {
  const userList = await collection.find({ user: user }).toArray();
  res.json(userList);
});

const getCost = function (price, quantity) {
  let priceItem = parseFloat(price).toFixed(2);
  return parseFloat(quantity * priceItem)
    .toFixed(2)
    .toString();
};

app.get("/", (req, res) => {
  res.render("login", { msg: "", layout: false });
});

app.get("/main.html", (req, res) => {
  res.render("main", { msg: "success you have logged in", layout: false });
});

app.post("/main.html", (req, res) => {
  res.render("main", { msg: "success you have logged in", layout: false });
});

app.post("/login", async (req, res) => {
  user = req.body.username;
  let password = req.body.password;
  const userAlreadyCreated = await userCollection.findOne({ user: user });
  if (userAlreadyCreated) {
    // await bcrypt.compare(password, userAlreadyCreated.password, (err, res) => {
    //   if (res) {
    if ((userAlreadyCreated.password === password)) {
      req.session.login = true;
      res.render("main", {
        msg: "Successful login. Welcome back " + `${user}`,
        layout: false,
      });
    } else {
      req.session.login = false;
      res.render("login", {
        msg: "Login failed, please try again",
        layout: false,
      });
    }
    // });
  } else {
    // bcrypt.hash(password, saltRounds, (err, hash) => {
    const newUser = {
      user,
      password,
    };
    const result = userCollection.insertOne(newUser);
    req.session.login = true;
    res.render("main", {
      msg: "Success you have created an account. Welcome " + `${user}`,
      layout: false,
    });
    // });
  }
});

app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.render("login", { msg: "Invalid login", layout: false });
})

app.listen(process.env.PORT || port);
