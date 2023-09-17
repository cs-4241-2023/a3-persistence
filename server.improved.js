const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require("mime"),
  dir = "public/",
  port = 3000;

let currentId = 3;
let appdata = [
  {
    id: 0,
    taskName: "Clean the garage",
    taskDescription:
      "Throw away old junk in the trash. Reorganize items to clear up more floor space.",
    taskDeadline: "2023-09-22",
    taskPriority: "Medium",
    taskCreated: "2023-09-05",
  },
  {
    id: 1,
    taskName: "Wash the dishes",
    taskDescription:
      "Wash the dishes in the sink. Put them away in the cabinets.",
    taskDeadline: "2023-09-10",
    taskPriority: "High",
    taskCreated: "2023-09-03",
  },
  {
    id: 2,
    taskName: "Do the laundry",
    taskDescription:
      "Wash the clothes in the washing machine. Dry them in the dryer. Fold them and put them away.",
    taskDeadline: "2023-09-20",
    taskPriority: "Low",
    taskCreated: "2023-09-02",
  },
];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  } else if (request.method === "DELETE") {
    handleDelete(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/getTasks") {
    // calculating derived fields
    for (let i = 0; i < appdata.length; i++) {
      appdata[i].timeRemaining = duration(
        new Date(),
        new Date(appdata[i].taskDeadline)
      );
      appdata[i].totalTime = duration(
        new Date(appdata[i].taskCreated),
        new Date(appdata[i].taskDeadline)
      );
    }
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(appdata));
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    console.log(JSON.parse(dataString));

    // ... do something with the data here!!!
    newTask = JSON.parse(dataString);
    newTask.id = currentId;
    currentId++;
    appdata.push(newTask);

    // calculating derived fields
    for (let i = 0; i < appdata.length; i++) {
      appdata[i].timeRemaining = duration(
        new Date(),
        new Date(appdata[i].taskDeadline)
      );
      appdata[i].totalTime = duration(
        new Date(appdata[i].taskCreated),
        new Date(appdata[i].taskDeadline)
      );
    }

    // sending back the updated appdata
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(appdata));
  });
};

const handleDelete = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    console.log(JSON.parse(dataString));

    const id = JSON.parse(dataString).id;
    // console.log("delete id: ", id);

    // filter out the task with the given id
    appdata = appdata.filter((task) => task.id !== id);

    // calculating derived fields
    for (let i = 0; i < appdata.length; i++) {
      appdata[i].timeRemaining = duration(
        new Date(),
        new Date(appdata[i].taskDeadline)
      );
      appdata[i].totalTime = duration(
        new Date(appdata[i].taskCreated),
        new Date(appdata[i].taskDeadline)
      );
    }

    // sending back the updated appdata
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(appdata));
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

// calculate the duration between two dates
function duration(date1, date2) {
  const diffTime = date2 - date1;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

server.listen(process.env.PORT || port);
