const express = require("express"),
      cookie = require("cookie-session"),
      app = express(),
      ejs = require("ejs"),
      port = 3000;
const {response} = require("express");

const appdata = [
  {id: 100000 , className: "CS 4241", assignmentName: "Assignment 2", dueDate:"2023-09-11", difficulty: 5, priority: "Medium"},
  {id: 200000 , className: "CS 3013", assignmentName: "Homework 1", dueDate:"2023-09-05", difficulty: 3, priority: "Low"}
];
const username = "username";
const password = "password";

app.use(express.json());
app.use(express.urlencoded({ extended:true }))
app.use(cookie({
    name: "session",
    keys: ["key1", "key2"]
}));

app.engine("html", ejs.renderFile);

app.get("/", (request, response) => {
    if(request.session.loginStatus === true) {
        response.sendFile(__dirname + "/public/app.html");
    } else {
        response.sendFile(__dirname + "/public/index.html");
    }
});

app.get("/index.html", (request, response) => {
    if(request.session.loginStatus === true) {
        response.sendFile(__dirname + "/public/app.html");
    } else {
        response.sendFile(__dirname + "/public/index.html");
    }
});

app.get("/app.html", (request, response) => {
    if(request.session.loginStatus === false || request.session.loginStatus === undefined) {
        response.sendFile(__dirname + "/public/index.html");
    } else {
        response.sendFile(__dirname + "/public/app.html");
    }
});
app.get("/auth", (request, response) => {
    response.writeHead(200, "OK", {'Content-Type': 'text/json'});
    response.end(JSON.stringify({status: request.session.loginStatus}));
});

app.get("/logout", (request, response) => {
    request.session.loginStatus = false;
    response.redirect("/");
});

app.use(express.static(__dirname + "/public"));

app.post("/login", (request, response) => {
    if(request.body.username === username && request.body.password === password) {
        request.session.loginStatus = true;
        response.redirect("app.html")
    } else {
        request.session.loginStatus = false;
        response.render(__dirname + "/public/index.html", {status:"Username or Password was Incorrect"});
    }
});

app.get("/assignment-data", (request, response) => {
  response.writeHead(200, "OK", {'Content-Type': 'text/json'});
  response.end(JSON.stringify(appdata));
});

app.post("/submit", (request, response) => {
    let sentData = request.body;
    let result = handleAssignmentData(sentData);
    response.writeHead(200,{ "Content-Type" : "application/json" });
    response.end(result);
});

app.put("/assignment-edit", (request, response) => {
    let editedData = request.body;
    let found = false;
    appdata.forEach(assignment => {
        if(assignment.id === editedData.id && !found) {
            found = true;
            editedData.priority = calculatePriority(editedData.dueDate, editedData.difficulty);
            appdata[appdata.indexOf(assignment)] = editedData;
        }
    });
    const resultJSON = found ? JSON.stringify({result: "success", message: ""}) : JSON.stringify({result: "failure", message: `ID ${editedData.id} not found.`});
    response.writeHead(200,{ "Content-Type" : "application/json" });
    response.end(resultJSON);
});

app.delete("/assignment-delete", (request, response) => {
    let dataToDelete = request.body;
    appdata.forEach(assignment => {
        if(assignment.id === dataToDelete.id) {
            appdata.splice(appdata.indexOf(assignment), 1);
            response.writeHead(200,{ "Content-Type" : "application/json" });
            response.end(JSON.stringify({result: "success", message: ""}));
        }
    })
});

app.listen(process.env.PORT || port) // set up server to listen on port 3000

const handleAssignmentData = function(sentData) {
  let id = sentData.id;
  let className = sentData.className;
  let assignmentName = sentData.assignmentName;
  let dueDate = sentData.dueDate;
  let difficulty = sentData.difficulty;
  let difficultyNum = parseInt(difficulty);

  // send failure if any of the fields are empty
  if(className === "" || assignmentName === "" || dueDate === "") {
      return JSON.stringify({ result: "failure", message: "One or more fields are empty!" });
  } else if(difficulty === "" || isNaN(difficultyNum) || difficultyNum < 0 || difficultyNum > 10) {
      return JSON.stringify({ result: "failure", message:"Difficulty must be an integer between 1 and 10!" });
  } else {
      let priority = calculatePriority(dueDate, difficulty); // calculate derived field
      appdata.push(
          {id: id, className: className, assignmentName: assignmentName, dueDate: dueDate, difficulty: difficulty, priority: priority }
      );
      return JSON.stringify({ result: "success", message: ""});
  }
}

const calculatePriority = function (dueDate, difficulty) {
  let date = new Date(dueDate);

  if((difficulty > 0 && difficulty <= 3) || date.getDay() >= 14) {
      return "Low"
  } else if((difficulty > 3 && difficulty <= 6) || (date.getDay() >= 7 && date.getDay() < 14)) {
      return "Medium"
  } else {
      return "High"
  }
}