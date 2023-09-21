import express, { json } from "express";
import { nanoid } from "nanoid";
import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const app = express();

let taskData = [];

app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}`;
const client = new MongoClient(uri);

let collection = null;

async function run() {
  await client.connect();
  collection = await client.db("whatToDo").collection("dev");
}
run();

app.get("/init", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    res.json( docs )
    console.log(res)
  }
  res.send(JSON.stringify(taskData));
});

app.post("/login", (req, res) => {
  console.log(req.body);
  res.writeHead(200, { "Content-Type": "application/json" });
});

app.post("/submit", (req, res) => {
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
  let index = taskData.findIndex((task) => task.id === newTask.id);
  taskData[index] = newTask;

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(taskData));
});

app.post("/new", (req, res) => {
  const newTask = {
    title: "New Note",
    date: new Date().toISOString().split("T")[0],
    priority: "Low",
    description: "",
    dueDate: "",
    id: nanoid(),
  };

  taskData.push(newTask);

  res.writeHead(200, "OK", { "Content-Type": "text/plain" });
  res.end(JSON.stringify(taskData));
});

app.delete("/delete", (req, res) => {
  taskData = taskData.filter((task) => {
    return task.id !== req.body.taskID;
  });

  res.writeHead(200, "OK", { "Content-Type": "application/json" });

  res.end(JSON.stringify(taskData));
});

app.listen(process.env.PORT);

// Simple function to add days to date
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
