const http = require("http"),
  fs = require("fs"),
  mime = require("mime"),
  dir = "public/",
  port = 3000;

const appdata = [];

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
  } else if (request.url === "/fetchData") {
    response.writeHeader(200, { "Content-Type": "text/plain" });
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
    if (request.url === "/submit") {
      appdata.push(JSON.parse(dataString));
    } else if (request.url === "/delete") {
      handleDelete(JSON.parse(dataString));
    }
    for (let i = 0; i < appdata.length; i++) {
      let response = appdata[i];
      response.volume = calculateVolume(
        response.sets,
        response.reps,
        response.weight
      )
    }
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end();
  });
};

const handleDelete = function (data) {
  appdata.splice(data["deleteResponse"], 1);
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

const calculateVolume = function (sets, reps, weight) {
  let volume = sets * reps * weight;
  return volume;
}
