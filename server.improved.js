const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const { ObjectId } = require("mongodb");
const cookieSession = require("cookie-session");

let un = "";
let ps = "";

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.use(express.urlencoded({ extended: true }));

app.use("/", express.static("public"));
app.use("/", express.static("views"));

app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.igmfru1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

let collection = null;

async function run() {
  await client.connect();
  collection = await client.db("Bucket_List").collection("bucket");
}

run();

app.use((req, res, next) => {
  if (collection !== null) {
    next();
  } else {
    res.status(503).send();
  }
});

app.get("/list", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({username: un, password: ps}).toArray();
    res.json(docs);
  }
});

app.post("/login", async (req, res) => {
  const users = await collection
    .find({ username: req.body.username, password: req.body.password })
    .toArray();
  if (users.length === 0) {
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    un = req.body.username;
    ps = req.body.password;
    return res.status(200).json({ message: "Succesfully Logged in"});
  } else {
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    un = req.body.username;
    ps = req.body.password;
    return res.status(200).json({ message: "Succesfully Logged in"});
    
  }
});

app.post("/submit", async (req, res) => {
  if (un === "" || ps === ""){
    return res.status(404).json({ message: "Please Login"});
  } else {
    const newAction = {
      username: un,
      password: ps,
      action: req.body.action,
      date: new Date(),
      complete: "No",
      dateCompleted: "Incomplete",
    };
  const result = await collection.insertOne(newAction);
  res.json(result);
  }
});

app.post("/remove", async (req, res) => {
  const result = await collection.deleteOne({
    _id: new ObjectId(req.body._id),
  });

  res.json(result);
});

app.post("/update", async (req, res) => {
  const { _id, complete, dateCompleted } = req.body;

  const updateFields = {};
  if (req.body.complete === "No") {
    updateFields.complete = "Yes";
    updateFields.dateCompleted = new Date().toLocaleString();
  }
  if (req.body.complete === "Yes") {
    updateFields.complete = "No";
    updateFields.dateCompleted = "Incomplete";
  }

  const result = await collection.updateOne(
    { _id: new ObjectId(req.body._id) },
    { $set: updateFields }
  );

  res.json(result);
});

app.post("/logout", async (req, res) => {
  un = "";
  ps = "";
  return res.status(200).json({ message: "Succesfully Logged out"});
});

app.listen(process.env.PORT || 3000);
