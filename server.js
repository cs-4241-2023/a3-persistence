const express = require('express');
const app = express();
const path = require('path');
let appdata = [
  { TaskName: "Task 1", DueDate: "09/12/2023", Priority: 1, MyDay: true },
  { TaskName: "Task 2", DueDate: "09/12/2023", Priority: 1, MyDay: true },
]

app.post( '/submit', ( req, res ) => {
  const json = JSON.parse(req.json);
  console.log(json);
  switch (json.type) {
    case "addTask":
      const newTaskData = json.taskData;
      appdata.push(newTaskData);
      break;
    case "deleteTask":
      const rowIndexToDelete = json.deleteRow;
      if (rowIndexToDelete >= 0 && rowIndexToDelete < appdata.length) {
        appdata.splice(rowIndexToDelete, 1);
      }
      break;
    case "updateTask":
      const updatedRow = json.row;
      const updatedTaskData = json.taskData;
      appdata[updatedRow] = updatedTaskData;
      break;
  }

  res.writeHead( 200, { 'Content-Type': 'application/json'})
  res.end( req.json )
})

app.get('/css/main.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'css', 'main.css'));
});

app.get('/js/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'js', 'main.js'));
});

app.get('/appdata', (req, res) => {
  res.json(appdata);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const listener = app.listen( process.env.PORT || 3000 )