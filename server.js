const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require("mime"),
  dir = "public/",
  port = 3000;

const appdata = [];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    if (request.url.startsWith("/modifyData/")) {
      handleModify(request, response);
    } else {
      handlePost(request, response);
    }
  } else if (request.method === "DELETE") {
    handleDelete(request, response);
  }
});

const handleModify = (request, response) => {
  let dataString = "";

  request.on("data", (data) => {
    dataString += data;
  });

  request.on("end", () => {
    const updatedData = JSON.parse(dataString);

    const index = parseInt(request.url.split("/").pop());

    if (appdata[index]) {
      appdata[index] = updatedData;
      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end("Data modified successfully");
    } else {
      response.writeHead(400, "Invalid index", {
        "Content-Type": "text/plain",
      });
      response.end("Invalid index");
    }
  });
};

const handleGet = function (request, response) {
  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/getData") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(appdata));
  } else {
    const filename = dir + request.url.slice(1);
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const receivedData = JSON.parse(dataString);

    const task = receivedData.task;
    if (!task || task.trim() === "") {
      response.writeHead(400, "Bad Request", { "Content-Type": "text/plain" });
      response.end("A task description is required");
      return;
    }

    const hours = parseFloat(receivedData.hours);
    if (isNaN(hours) || hours <= 0) {
      response.writeHead(400, { "Content-Type": "text/plain" });
      response.end("Invalid hours. Please enter a number greater than 0.");
      return;
    }

    const dueDate = new Date(receivedData.dueDate);
    if (isNaN(dueDate)) {
      response.writeHead(400, "Bad Request", { "Content-Type": "text/plain" });
      response.end("Invalid Due Date provided.");
      return;
    }

    const now = new Date();
    const timeLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

    let priority;
    const timeRatio = (timeLeft * 24.0) / hours;
    console.log(timeRatio);

    if (timeRatio >= 3) {
      priority = "low";
    } else if (timeRatio >= 1.5) {
      priority = "medium";
    } else {
      priority = "high";
    }

    appdata.push({
      task: receivedData.task,
      hours: parseFloat(receivedData.hours),
      dueDate: receivedData.dueDate,
      timeLeft: timeLeft > 0 ? `${timeLeft} days` : "Past due",
      priority: priority,
    });

    console.log(appdata);

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end("Data received and added to the dataset");
  });
};

const handleDelete = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const receivedData = JSON.parse(dataString);

    const index = appdata.findIndex((item) => item.task === receivedData.task);

    if (index !== -1) {
      appdata.splice(index, 1);
      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end("Data deleted successfully");
    } else {
      response.writeHead(400, "Bad Request", { "Content-Type": "text/plain" });
      response.end("Data not found");
    }
  });
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    if (err === null) {
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
