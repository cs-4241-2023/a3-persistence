const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

const uri = `mongodb+srv://ccordobaescobar464:${process.env.PASSWORD}@cluster.du4q9pb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
let tasksCollection;
let usersCollection;

app.use(express.json());
app.use(express.static("public"));

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    tasksCollection = client.db("todoListApp").collection("tasks");
    usersCollection = client.db("todoListApp").collection("users");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Handle GET requests for tasks
app.get("/tasks/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const tasks = await tasksCollection.find({ username: username }).toArray();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Failed to fetch tasks");
  }
});

// Handle POST requests
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await usersCollection.findOne({ username: username });
  if (existingUser) {
    if (existingUser.password === password) {
      res.json({ success: true });
    } else {
      res.json(null);
    }
  } else {
    const newUser = {
      username,
      password,
    };
    const result = await usersCollection.insertOne(newUser);
    res.json(result);
  }
});

app.post("/tasks/", async (req, res) => {
  const data = req.body;

  try {
    await tasksCollection.insertOne(data);
    res.status(201).json(data);
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
  const taskId = req.params.id;

  try {
    const objectId = new ObjectId(taskId);
    const result = await tasksCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      res.status(404).send("Task not found");
    } else {
      res.json(result);
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
