const http = require("http"),
    fs = require("fs"),
    mime = require("mime"),
    dir = "public/",
    port = 3000;

let appdata = [
  { TaskName: "Task 1", DueDate: "09/12/2023", Priority: 1, MyDay: true },
  { TaskName: "Task 2", DueDate: "09/12/2023", Priority: 1, MyDay: true },
];

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
  } else if (request.url === "/appdata") {
    response.writeHead(200, { "Content-Type": "application/json" });
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
    //Switch on the data type sent from the client
    const requestData = JSON.parse(dataString);
    switch (requestData.type) {
      case "addTask":
        const newTaskData = requestData.taskData;
        appdata.push(newTaskData);
        break;

      case "deleteTask":
        const rowIndexToDelete = requestData.deleteRow;
        if (rowIndexToDelete >= 0 && rowIndexToDelete < appdata.length) {
          appdata.splice(rowIndexToDelete, 1);
        }
        break;

      case "updateTask":
        const updatedRow = requestData.row;
        const updatedTaskData = requestData.taskData;
        appdata[updatedRow] = updatedTaskData;
        break;
    }

    response.writeHead(200, "OK", { "Content-Type": "application/json" });
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

server.listen(process.env.PORT || port);