const http = require("http");
const fs = require("fs");
const mime = require("mime");
const dir = "public/";
const port = 3000;

const tasks = [];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  } else if (request.method === "DELETE") {
    handleDelete(request, response);
  }
});

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const newTask = JSON.parse(dataString);
    newTask.timestamp = new Date(); // Add a timestamp to the task
    tasks.push(newTask);

    console.log("New Task:", newTask);

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end("Task added successfully");
  });
};

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/" || request.url.startsWith("/index.html")) {
    sendFile(response, "public/index.html");
  } else if (request.url === "/tasks") {
    // New endpoint for tasks
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(tasks));
  } else {
    sendFile(response, filename);
  }
};

const handleDelete = function (request, response) {
  const taskId = request.url.split("/")[2]; // Extract taskId from the URL (/tasks/<taskId>)

  // Find and remove the task with the specified ID from the tasks array
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1); // Remove the task
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Task deleted successfully");
  } else {
    // Task not found, return a 404 response
    response.writeHead(404);
    response.end("404 Error: Task Not Found");
  }
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
