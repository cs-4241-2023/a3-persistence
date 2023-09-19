const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const appdata = [];
let nextID = 0;

app.use(express.json());

// Middleware to handle static files
app.use(express.static("public"));

// Handle GET requests
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/tasks", (req, res) => {
  SortData();
  res.json(appdata);
});

// Handle POST requests
app.post("/tasks", (req, res) => {
  const data = req.body;
  data.id = nextID;
  appdata.push(data);
  nextID++;
  SortData();
  res.json(appdata);
});

// Handle PUT requests
app.put("/tasks/:id", (req, res) => {
  const resourceId = parseInt(req.params.id);
  const updatedData = req.body;

  const resourceIndex = appdata.findIndex(item => item.id === resourceId);

  if (resourceIndex === -1) {
    res.status(404).send("Resource not found");
  } else {
    appdata[resourceIndex] = updatedData;
    SortData();
    res.json(updatedData);
  }
});

// Handle DELETE requests
app.delete("/tasks/:id", (req, res) => {
  const resourceId = parseInt(req.params.id);

  const index = appdata.findIndex(task => task.id === resourceId);
  if (index > -1) {
    appdata.splice(index, 1);
    res.json(appdata);
  } else {
    res.status(404).send("Task not found");
  }
});

const SortData = () => {
  appdata.sort(function (a, b) {
    let dateA = new Date(a.dueDate);
    let dateB = new Date(b.dueDate);
    return dateA - dateB;
  });
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
