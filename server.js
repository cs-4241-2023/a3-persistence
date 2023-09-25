const express = require("express"),
  { MongoClient, ObjectId } = require("mongodb"),
  cookie = require("cookie-session");

const fs = require("fs");
const mime = require("mime");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Configure app
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookie({
    name: "session",
    keys: ["key1", "key2"],
  })
);
const saltRounds = 10;

// Log all incoming requests
const logger = (req, res, next) => {
  console.log("url:", req.url);
  next();
};
app.use(logger);

// Configure MongoDB
const mongo_uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const mongo_client = new MongoClient(mongo_uri);
let users = null;
let tasks = null;

// Monitor MongoDB connection
app.use((req, res, next) => {
  if (users !== null && tasks !== null) {
    next();
  } else {
    res.status(503).send();
  }
});


// Handle GET requests
app.get("/", (req, res) => {
  if (req.session.userId) {
    console.log("Serving dashboard");
    res.sendFile(path.join(__dirname, "src/pages/dashboard.html"));
  } else {
    console.log("Serving login page");
    res.sendFile(path.join(__dirname, "src/pages/login.html"));
  }
});

app.get("/getTasks", async (req, res) => {
  const user_tasks = await tasks.find({ userID: req.session.userId }).toArray();

  console.log("Sending tasks:", user_tasks);
  res.json(user_tasks);
});

// Handle POST requests
app.post("/addTask", async (req, res) => {
  const data = req.body;
  console.log("Received task data for addition:", data);

  const currentDate = new Date();
  switch (data.priority) {
    case "high":
      currentDate.setDate(currentDate.getDate() + 1);
      break;
    case "medium":
      currentDate.setDate(currentDate.getDate() + 3);
      break;
    case "low":
      currentDate.setDate(currentDate.getDate() + 7);
      break;
  }
  data.dueDate = currentDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD

  data.userID = req.session.userId;

  const result = await tasks.insertOne(data);
  console.log("Task added");
  res.json(result);
});

app.post("/deleteTask", async (req, res) => {
  const data = req.body;

  console.log(data);

  const filter = {
    taskName: data.taskName,
    assignedTo: data.assignedTo,
    priority: data.priority,
    dueDate: data.dueDate,
    userID: req.session.userId,
  };
  const result = await tasks.deleteOne(filter);

  res.json(result);
});

app.post("/login", async (req, res) => {
  console.log("Received login request");
  const username = req.body.username;
  const password = req.body.password;

  console.log(`Logging in with username: ${username}`);
  const user = await users.findOne({ username: username });

  if (user) {
    console.log("User exists, checking password...");
    // User exists, check password
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        throw err;
      }
      if (result) {
        // Passwords match
        console.log("Passwords match");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: true, message: "Logged in successfully" })
        );
      } else {
        // Passwords don't match
        console.log("Passwords don't match");
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: false, message: "Incorrect password" })
        );
        return;
      }
    });

    console.log("User authenticated, saving session data...", user);
    req.session.userId = user._id; // Save user ID in session
  } else {
    console.log("User doesn't exist, creating new user...");
    // User doesn't exist, create a new user
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        throw err;
      }
      console.log("Inserting User into database");
      users
        .insertOne({ username, password: hash })
        .then(function (insertResult) {
          console.log("User created successfully", insertResult);

          req.session.userId = insertResult.insertedId; // Save user ID in session

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
              message: "User created and logged in successfully",
            })
          );
        });
    });
  }
});

async function run() {
  console.log("Connecting to MongoDB");
  await mongo_client.connect();

  console.log("Connecting to collections");
  users = await mongo_client.db("persistance").collection("users");
  tasks = await mongo_client.db("persistance").collection("tasks");
}

run();

// Handle 404 for unrecognized endpoints
app.use((req, res) => {
  console.log("404 Error: Endpoint not recognized:", req.url);
  res.status(404).send("404 Error: File Not Found");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
