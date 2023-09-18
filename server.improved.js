const http = require("http"),
  fs = require("fs"),

  mime = require("mime"),
  dir = "public/",
  port = 3000;

let appdata = [];
let counter = 0;

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {``
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
    if (request.url === '/submit') { //handle form requests
      let newData = JSON.parse(dataString);
      newData.id = appdata.length;
      appdata.push(newData);
      calculateDaysRemaining(appdata);
      console.log(appdata);
    } else if (request.url === '/delete'){
        let index = JSON.parse(dataString);
        appdata.splice(parseInt(index.id), 1);
        for(let idRst = 0; idRst < appdata.length; idRst++){
            appdata[idRst].id = idRst;
        }
    }
    console.log(appdata)
    response.writeHead(200, 'OK', { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(appdata));
    response.end();
});
}

const calculateDaysRemaining = (data) => {
  const currentDate = new Date();
  for (const item of data) {
    const dueDate = new Date(item.date);
    const daysRemaining = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));
    item.daysRemaining = daysRemaining > 0 ? `${daysRemaining} days` : 'Expired';
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