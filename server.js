import express, { json } from "express";
import { nanoid } from "nanoid";
import "dotenv/config";

const app = express();
let taskData = [
  {
    title: "Assignment 1",
    date: "2023-09-15",
    priority: "Medium",
    description: "Webware assignment 1",
    dueDate: "2023-09-18",
    id: nanoid(),
  },
  {
    title: "Assignment 2",
    date: "2023-09-16",
    priority: "High",
    dueDate: "2023-09-18",
    description: "Webware assignment 2",
    id: nanoid(),
  },
];

app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());

app.get("/init", (req, res) => {
  res.header({ "Content-Type": "application/json" });
  res.send(JSON.stringify(taskData));
});

app.post("/login", (req, res) => {
  console.log(req.body.username)
  res.writeHead(200, { "Content-Type": "application/json" });
})

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
