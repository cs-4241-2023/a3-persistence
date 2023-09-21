const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require("mime"),
  dir = "public/",
  port = 3000;

let tasks = [];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/getTasks") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(tasks));
  } else {
    console.log("Sending File", filename);
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  console.log("Received POST request for:", request.url);

  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const data = JSON.parse(dataString);

    if (request.url === "/addTask") {
      const currentDate = new Date();
      switch (data.priority) {
        case "high":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "medium":
          currentDate.setDate(currentDate.getDate() + 3);
          break;
        case "low":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
      }
      data.dueDate = currentDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD

      tasks.push(data);

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ success: true }));
    } else if (request.url === "/deleteTask") {
        const taskIndex = tasks.findIndex(t => t.task === data.task && t.dueDate === data.dueDate);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ success: true }));
        } else {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.end("Task not found.");
        }
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Endpoint not recognized.");
    }
  });
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
