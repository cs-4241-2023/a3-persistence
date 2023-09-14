import * as http from "http";
import * as fs from "fs";
import mime from "mime";
import { nanoid } from "nanoid";

const dir = "public/",
  port = 3000;

let appdata = [
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
    const parsedData = JSON.parse(dataString);

    if (request.url === "/submit") {
      // Create due date field
      const originalDate = new Date(parsedData.date);
      let due = null;

      switch (parsedData.priority) {
        case "Low":
          due = addDays(originalDate, 5).toISOString().split("T")[0];
          break;
        case "Medium":
          due = addDays(originalDate, 3).toISOString().split("T")[0];
          break;
        case "High":
          due = addDays(originalDate, 1).toISOString().split("T")[0];
          break;
      }
      
      let newTask = {
        ...parsedData,
        dueDate: due
      }


      let index = appdata.findIndex(task => task.id === parsedData.id)
      appdata[index] = newTask


    } else if (request.url === "/init") {
    } else if (request.url === "/delete") {
      appdata = appdata.filter((obj) => {
        return obj.id !== parsedData.id;
      });
    } else if (request.url === "/new") {
      const newTask = {
        title: "New Note",
        date: new Date().toISOString().split("T")[0],
        priority: "Low",
        description: "",
        dueDate: "",
        id: nanoid(),
      }

      appdata.push(newTask); 
    }

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

server.listen(process.env.PORT || port);

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
