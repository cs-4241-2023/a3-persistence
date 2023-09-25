import express, { json } from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieSession from "cookie-session";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

const app = express();

app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESS_KEY],
  })
);

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}`;
const client = new MongoClient(uri);

client.connect();
const db = client.db("whatToDo");
const usersCollection = db.collection("Users");
let collection = null;

app.post("/login", async (req, res) => {
  console.log(req.body)
  const response = await usersCollection.findOne({
    username: req.body.username,
  });
  if (response !== null) {
    // If we get an object back
    if (response.password === req.body.password) {
      // if the password is correct redirect and set the current collection to the one linked in the database
      req.session.login = true;
      collection = db.collection(response.collection)
      res.sendFile(__dirname + "/views/task.html");
    } else {
      // else the password was incorrect (realistically I think we would want to only show that the user/password was not found/incorrect)
      console.log("Incorrect password")
      res.status(401).sendFile(__dirname + "/views/index.html");
    }
  } else {
    // else we didn't get an object back now we want to automatically create the user account
    console.log("User not found")
    await db.createCollection(req.body.username)
    console.log("Created new user")
    usersCollection.insertOne({
      username: req.body.username,
      password: req.body.password,
      collection: req.body.username,
    })
    res.status(404).sendFile(__dirname + "/views/index.html");
  }
});

app.use(function (req, res, next) {
  if (req.session.login === true) {
    next();
  } else {
    res.sendFile(__dirname + "/views/login.html");
  }
});

// Middleware
app.get("/init", async (req, res) => {
  sendTasks(req, res);
});

app.post("/submit", async (req, res) => {
  let newTask = req.body;

  if (newTask.due === "") {
    const originalDate = new Date(newTask.date);
    switch (newTask.priority) {
      case "Low":
        newTask.due = addDays(originalDate, 5).toISOString().split("T")[0];
        break;
      case "Medium":
        newTask.due = addDays(originalDate, 3).toISOString().split("T")[0];
        break;
      case "High":
        newTask.due = addDays(originalDate, 1).toISOString().split("T")[0];
        break;
    }
  }

  const cloneNewTask = { ...newTask };

  delete cloneNewTask._id;

  await collection.replaceOne(
    { _id: new ObjectId(newTask._id) },
    { ...cloneNewTask }
  );

  sendTasks(req, res);
});

// A way to optimize this is to create the note client-side, then when the note is saved you push it to the server (works for now but I can optimize it later). This may be difficult because we will not have an associated ID with a new note until it is created within mongo, instead we might want to use our own id (nanoid package)?
app.post("/new", async (req, res) => {
  const newTask = {
    title: "New Note",
    date: new Date().toISOString().split("T")[0],
    priority: "Low",
    description: "",
    dueDate: "",
  };

  await collection.insertOne(newTask);

  sendTasks(req, res);
});

app.delete("/delete", async (req, res) => {
  await collection.deleteOne({ _id: new ObjectId(req.body.taskID) });

  sendTasks(req, res);
});

app.listen(process.env.PORT);

// Helper Functions
// async function initDB() {
//   await client.connect();
//   collection = await client.db("whatToDo").collection("dev");
//   await client.db("admin").command({ ping: 1 });
//   console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   return;
// }

// Simple function to add days to date
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function sendTasks(req, res) {
  if (collection !== null) {
    const docs = await collection.find({}).toArray();
    res.json(docs);
  }
}
