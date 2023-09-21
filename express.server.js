const express = require("express");
const session = require("express-session");
const passport = require("./public/js/passport");

const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

const uri =
  "mongodb+srv://ccordobaescobar464:7lsuxltzD@cluster.du4q9pb.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let tasksCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    tasksCollection = client.db("todoListApp").collection("tasks");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

app.use(
  session({
    secret: "4b9068da33a1cc5e769568f7e8524edf1cd3130d",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Middleware to handle static files
app.use(express.static("public"));

// Add authentication routes
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect to the todo list or user profile page
    // Set a session variable to indicate the user is authenticated
    req.session.userAuthenticated = true;
    console.log("tseting");

    res.redirect("/"); // Redirect to the todo list or any other authenticated page
  }
);

// Handle GET request to load HTML pages
app.get("/", (req, res) => {
  // Check if the user is authenticated (you can implement your own logic)
  if (req.session.userAuthenticated) {
    res.sendFile(__dirname + "/public/todo.html");
  } else {
    res.sendFile(__dirname + "/public/index.html");
  }
});

app.get("/todo", ensureAuthenticated, (req, res) => {
  if (req.session.userAuthenticated) {
    res.sendFile(__dirname + "/public/todo.html");
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

// Handle GET requests for tasks
app.get("/tasks", ensureAuthenticated, async (req, res) => {
  try {
    // Fetch all tasks from the MongoDB collection
    const tasks = await tasksCollection.find().toArray();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Failed to fetch tasks");
  }
});

// Handle POST requests to create tasks
app.post("/tasks", async (req, res) => {
  const data = req.body;

  try {
    // Insert the data into the MongoDB collection
    await tasksCollection.insertOne(data);
    res.status(201).json(data); // Return the created data with HTTP status 201 (Created)
  } catch (error) {
    console.error("Error inserting task:", error);
    res.status(500).send("Failed to create task");
  }
});

// Handle PUT requests to update tasks
app.put("/tasks/:id", async (req, res) => {
  const resourceId = req.params.id;
  const updatedData = req.body;

  try {
    // Update the document in the MongoDB collection using _id
    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(resourceId) }, // Use _id and create ObjectId
      { $set: updatedData }
    );
    if (result.matchedCount === 0) {
      res.status(404).send("Resource not found");
    } else {
      res.json(updatedData);
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send("Failed to update task");
  }
});

// Handle DELETE requests to delete tasks
app.delete("/tasks/:id", async (req, res) => {
  const resourceId = req.params.id; // Get the _id from the request params

  try {
    // Create an ObjectID instance from the string _id
    const objectId = new ObjectId(resourceId);

    // Delete the document from the MongoDB collection using the ObjectID
    const result = await tasksCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      res.status(404).send("Task not found");
    } else {
      // Fetch and return the updated list of tasks
      const tasks = await tasksCollection.find().toArray();
      res.json(tasks);
      res.status(200);
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Failed to delete task");
  }
});

app.listen(port, () => {
  connectToDatabase();
  console.log(`Server is running on port ${port}`);
});
