require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { duration } = require("./utils/helpers.js");

const app = express();

// MongoDB connection setup
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db = null;

async function connectToDB() {
  await client.connect();
  db = await client.db("a3_todo_list_app");
  console.log("Connected to DB successfully");
}

connectToDB().catch((error) => {
  console.error("Error connecting to the database: ", error);
});

// middleware to check the connection to the database
app.use((req, res, next) => {
  if (db !== null) {
    next();
  } else {
    res.status(503).send();
  }
});

// logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

// parses JSON bodies
app.use(express.json());

// Middleware for sessions
app.use(
  session({
    secret: "thisIsASecret",
    resave: false,
    saveUninitialized: false,
    cookies: {
      maxAge: 3600000, // 1 hour
    },
  })
);

// middleware to check if the user is logged in
const ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    // the user is logged in
    next();
  } else {
    // the user is not logged in
    res.status(401).send("Please log in to access this page.");
    // res.redirect("/login.html");
  }
};

// change the default route to login.html
app.get("/", (req, res) => {
  // console.log(__dirname + "/public/login.html");
  res.sendFile(__dirname + "/public/login.html");
});

// login route
app.post("/login", async (req, res) => {
  try {
    // get username and password from request body
    const { username, password } = req.body;
    // check if credentials have been entered
    if (!username || !password) {
      res.status(401).send({ error: "Username or password not entered" });
    }

    // check if user exists in the database
    const appUsersCollection = db.collection("app_users");
    const user = await appUsersCollection.findOne({ username: username });
    if (!user || user.password !== password) {
      return res
        .status(401)
        .send({ error: "Username or password is incorrect" });
    }
    // if login successful, create a session
    req.session.user = user;
    req.session.cookie.maxAge = 3600000; // 1 hour
    return res.redirect("/index.html");
  } catch (error) {
    console.error("Error from login route: ", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});

// route to get the username of the logged-in user
app.get("/getUsername", ensureAuthenticated, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({ username: req.session.user.username });
});

// protection of the index.html route
app.get("/index.html", ensureAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static("public"));
app.use(ensureAuthenticated);

app.post("/submit", ensureAuthenticated, async (req, res) => {
  try {
    const username = req.session.user.username;

    // Extract data from the request body
    const {
      taskName,
      taskDescription,
      taskDeadline,
      taskPriority,
      taskCreated,
    } = req.body;

    if (!taskName || !taskDescription || !taskDeadline || !taskPriority) {
      return res.status(400).json({ error: "Missing required field(s)." });
    }

    // Inserting into MongoDB
    const tasksCollection = db.collection("tasks");
    const newTask = {
      username,
      taskName,
      taskDescription,
      taskDeadline,
      taskPriority,
      taskCreated: taskCreated || new Date().toISOString(), // If taskCreated is null, use the current date
    };
    const result = await tasksCollection.insertOne(newTask);
    // console.log("result: ", result);

    if (result.acknowledged === true) {
      const updatedTasks = await tasksCollection.find({ username }).toArray();

      // Calculate the time remaining and total time for each task
      for (const task of updatedTasks) {
        // Calculate the time remaining for each task
        task.timeRemaining = duration(new Date(), new Date(task.taskDeadline));

        // Calculate the total time spent on each task
        task.totalTime = duration(
          new Date(task.taskCreated),
          new Date(task.taskDeadline)
        );
      }

      res.setHeader("Content-Type", "application/json");
      return res.status(201).json(updatedTasks);
    } else {
      return res.status(500).json({ error: "Failed to add task." });
    }
  } catch (error) {
    console.error("Error from /submit route: ", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/getTasks", ensureAuthenticated, async (req, res) => {
  try {
    const username = req.session.user.username;

    const tasksCollection = db.collection("tasks");

    // Fetch tasks for the currently logged in user
    const tasks = await tasksCollection.find({ username: username }).toArray();
    for (const task of tasks) {
      // Calculate the time remaining for each task
      task.timeRemaining = duration(new Date(), new Date(task.taskDeadline));

      // Calculate the total time spent on each task
      task.totalTime = duration(
        new Date(task.taskCreated),
        new Date(task.taskDeadline)
      );
    }

    res.setHeader("Content-Type", "application/json");
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    res.status(500).json({ error: "Failed to fetch your tasks." });
  }
});

app.delete("/deleteTask", ensureAuthenticated, async (req, res) => {
  try {
    const taskId = new ObjectId(req.body.id);
    const username = req.session.user.username;

    const tasksCollection = db.collection("tasks");

    // Delete the task if it belongs to the logged-in user
    const result = await tasksCollection.deleteOne({
      _id: taskId,
      username: username,
    });

    if (result.deletedCount === 1) {
      // Fetch the updated list of tasks for the user
      const updatedTasks = await tasksCollection
        .find({ username: username })
        .toArray();
      res.setHeader("Content-Type", "application/json");
      res.json(updatedTasks);
    } else {
      // Task not found
      res.setHeader("Content-Type", "application/json");
      res.status(404).json({ message: "Task to be deleted not found" });
    }
  } catch (error) {
    console.error("Error deleting task: ", error);
    res
      .status(500)
      .json({ erorr: "Failed to delete task due to internal server error." });
  }
});

app.put("/updateTask", ensureAuthenticated, async (req, res) => {
  try {
    const taskId = new ObjectId(req.body.id);
    const username = req.session.user.username;

    const {
      taskName,
      taskDescription,
      taskDeadline,
      taskPriority,
      taskCreated,
    } = req.body;

    const tasksCollection = db.collection("tasks");

    const updatedTask = {
      username,
      taskName,
      taskDescription,
      taskDeadline,
      taskPriority,
      taskCreated,
    };

    const result = await tasksCollection.updateOne(
      { _id: taskId, username: username },
      { $set: updatedTask }
    );

    if (result.modifiedCount === 1) {
      // Successfully updated the task
      // Fetch the updated list of tasks for the user
      const updatedTasks = await tasksCollection
        .find({ username: username })
        .toArray();

      // Calculate the time remaining and total time for each task
      for (const task of updatedTasks) {
        // Calculate the time remaining for each task
        task.timeRemaining = duration(new Date(), new Date(task.taskDeadline));

        // Calculate the total time spent on each task
        task.totalTime = duration(
          new Date(task.taskCreated),
          new Date(task.taskDeadline)
        );
      }
      res.setHeader("Content-Type", "application/json");
      res.json(updatedTasks);
    } else {
      // Task not found
      res.status(404).json({ message: "Task to be updated not found." });
    }
  } catch (error) {
    console.error("Error updating task: ", error);
    res
      .status(500)
      .json({ error: "Failed to update task due to internal server error." });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
