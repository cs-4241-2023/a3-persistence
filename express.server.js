const express = require("express");
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

    const db = client.db("todoListApp");
    tasksCollection = db.collection("tasks");

    // Log the number of documents in the tasks collection for debugging
    const taskCount = await tasksCollection.countDocuments();
    console.log(`Number of documents in 'tasks' collection: ${taskCount}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

app.use(express.json());

// Middleware to handle static files
app.use(express.static("public"));

// Handle GET requests
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Handle GET requests for tasks
app.get("/tasks", async (req, res) => {
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
