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

// protection of the index.html route
app.get("/index.html", ensureAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static("public"));
app.use(ensureAuthenticated);

// tasks posts middleware
const add_task_middleware = (req, res, next) => {
  let dataString = "";
  req.on("data", (data) => {
    dataString += data;
  });

  req.on("end", () => {});
};

app.post("/submit", add_task_middleware, (req, res) => {
  // our request object now has a 'json' field in it from our previous middleware
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(req.json);
});

app.get("/getTasks", ensureAuthenticated, async (req, res) => {
  try {
    const username = req.session.user.username;

    const tasksCollection = db.collection("tasks");

    // Fetch tasks for the currently logged in user
    const tasks = await tasksCollection.find({ username: username }).toArray();
    console.log(`Tasks for ${username}: , ${tasks}`);

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    res.status(500).send("Failed to fetch your tasks.");
  }
});

app.delete("/deleteTask", (req, res) => {});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
