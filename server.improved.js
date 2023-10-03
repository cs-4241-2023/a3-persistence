const express = require("express"),
  bodyParser = require("body-parser"),
  cookie = require("cookie-session"),
  app = express(),
  { MongoClient, ObjectId, ServerApiVersion } = require("mongodb"),
  appdata = [],
  port = 3000;

app.use(
  cookie({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.get("/index.html", (request, response, next) => {
  const name = request.session.user;
  if (request.session.user === undefined) {
    response.redirect("login.html");
  } else {
    next();
  }
});

app.get("/", (request, response, next) => {
  if (request.session.user === undefined) {
    response.redirect("login.html");
  } else {
    response.redirect("index.html");
  }
});

var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.0en6ash.mongodb.net/?authSource=admin&retryWrites=true&w=majority&appName=AtlasApp`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let collection = null;
let users = null;

async function run() {
  await client.connect();
  collection = await client.db("runData").collection("main");
  users = await client.db("runData").collection("users");
}

run();

app.use(express.static("public"));
app.use(express.json());

app.post("/newInput", async (req, res) => {
  const user = req.session.user;
  const input = await collection.insertOne({
    username: req.session.user,
    ...req.body,
  });
  const result = await collection
    .find({ username: req.session.user })
    .toArray();
  res.status(200).json(result);
});

app.post("/getRun", async (req, res) => {
  debugger;
  const input = req.body;
  const user = req.session.user;
  let result = await collection.findOne({
    username: user,
    distance: input.distance,
    time: input.time,
    description: input.description,
  });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).send({
      message: "This is an error!",
    });
  }
});

app.post("/fetch", async (req, res) => {
  if (collection !== null) {
    const user = req.session.user;
    const data = await collection
      .find({ username: req.session.user })
      .toArray();
    res.status(200).json(data);
  }
});

app.post("/register", async (req, res) => {
  const thisUser = await users.findOne({ username: req.body.username });
  if (thisUser == null) {
    const input = await users.insertOne({
      username: req.body.username,
      password: req.body.password,
    });
    res.status(200).json(true);
  } else {
    res.status(200).json(false);
  }
});

app.post("/login", async (req, res) => {
  const thisUser = await users.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (thisUser == null) {
    res.status(200).json(false);
  } else {
    req.session.user = req.body.username;
    res.status(200).json(true);
  }
});

app.post("/update", async (req, res) => {
  debugger;
  const updateInfo = req.body;
  const user = req.session.user;
  const targetId = new ObjectId(updateInfo.oldId);
  const newDistance = updateInfo.distance;
  const newTime = updateInfo.time;
  const newDescription = updateInfo.description;
  const oldRun = await collection.updateOne(
    { _id: targetId, username: user},
    {
      $set: {
        distance: newDistance,
        time: newTime,
        description: newDescription,
      },
    }
  );
  const data = await collection.find({ username: req.session.user }).toArray();
  res.status(200).json(data);
});

app.delete("/deleteRun", async (req, res) => {
  const targetId = new ObjectId(req.body);
  const user = req.session.user;
  const oldRun = await collection.deleteOne({
    _id: targetId,
    username: req.session.user,
  });
  const data = await collection.find({ username: user }).toArray();
  res.status(200).json(data);
});

app.listen(process.env.PORT || port);
