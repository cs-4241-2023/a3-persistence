const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require("mime"),
  dir = "public/",
  port = 3000;

const appdata = [
  {
    deposit: 1000.0,
    startDate: "2022-09-07",
    rate: 0.04,
    accrued: 1040.0,
    id: 1,
  },
  {
    deposit: 2000.0,
    startDate: "2021-09-04",
    rate: 0.04,
    accrued: 2163.23,
    id: 2,
  },
  {
    deposit: 3500.0,
    startDate: "2020-10-04",
    rate: 0.05,
    accrued: 3503.499,
    id: 3,
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
  } else if (request.url === "/getData") {
    const data = JSON.stringify(appdata);
    console.log("first load get data");
    response.writeHeader(200, { "Content-Type": "application/json" });
    response.end(data);
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  switch (request.url) {
    case "/submit":
      let dataString = "";

      request.on("data", function (data) {
        dataString += data;
        console.log(dataString);
      });

      request.on("end", function () {
        console.log(JSON.parse(dataString));

        let data = JSON.parse(dataString),
          start = new Date(data.startDate),
          today = new Date(),
          diff = new Date(today - start).getFullYear() - 1970,
          deposit = data.deposit,
          rate = data.rate,
          accrued = deposit * (1 + rate * diff);

        data["accrued"] = accrued;
        data["id"] = Number(Date.now());

        appdata.push(data);

        response.writeHeader(200, "OK", { "Content-Type": "application/json" });
        console.log(JSON.stringify(appdata));
        response.end(JSON.stringify(appdata));
      });
      break;
    case "/delete":
      let idValue = "";

      request.on("data", function (data) {
        idValue += data;
      });

      request.on("end", function () {
        console.log(JSON.parse(idValue));

        let obj = JSON.parse(idValue);

        for (let i = 0; i < appdata.length; i++) {
          if (equalObject(obj, appdata[i])) {
            appdata.splice(i, 1);
            break;
          }
        }

        console.log(appdata);
        response.writeHeader(200, "OK", { "Content-Type": "application/json" });
        response.end(JSON.stringify(appdata));
      });

      break;
    case "/modify":
      let modifiedData = "";

      request.on("data", function (data) {
        modifiedData += data;
        console.log(modifiedData);
      });

      request.on("end", function () {
        console.log(JSON.parse(modifiedData));

        let newData = JSON.parse(modifiedData);
        for (let i = 0; i < newData.length; i++) {
          let start = new Date(newData[i].startDate),
            today = new Date(),
            diff = new Date(today - start).getFullYear() - 1970,
            deposit = newData[i].deposit,
            rate = newData[i].rate,
            accrued = deposit * (1 + rate * diff);

          newData[i]["accrued"] = accrued;
          newData[i]["id"] = Number(newData[i]["id"]);
        }

        appdata.splice(0, newData.length, ...newData);

        response.writeHeader(200, "OK", { "Content-Type": "application/json" });
        console.log(JSON.stringify(appdata));
        response.end(JSON.stringify(appdata));
      });
      break;
    default:
      break;
  }
};

const equalObject = function (obj1, obj2) {
  return obj1.id === obj2.id;
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
