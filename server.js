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
  { model: "toyota", year: 1999, mpg: 23 },
  { model: "honda", year: 2004, mpg: 30 },
  { model: "ford", year: 1987, mpg: 14 },
];

const totalPrice = { totalPrice: 0.0 };
let retObject;

const groceryList = [];

const server = http.createServer(function (request, response) {

  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }else if (request.method === "DELETE") {
    handleDelete(request, response);
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

const calcTotalPrice = function () {
  totalPrice.totalPrice = 0.0;
  if(groceryList.length !== 0){groceryList.forEach((item) => {
    if (!isNaN(parseFloat(item.price))) {
      totalPrice.totalPrice += parseFloat(item.price);
    } else {
      totalPrice.totalPrice += 0.0;
    }
  })};
};

const modifyPrice = function (data){
  data.items.forEach(idx => {
    console.log(groceryList[idx])
    groceryList[idx].price = data.price;
  })
}
const handlePost = function (request, response) {
    let dataString = "";

    request.on("data", function (data) {
      dataString += data;
    });

    if(request.url ==="/submit")
    {
      request.on("end", function () {
        const newItem = JSON.parse(dataString).item;
        groceryList.push(newItem);
        calcTotalPrice();
        //console.log(totalPrice);
        retObject = { groceryList, totalPrice };
        console.log(retObject)
        response.writeHead(200, "OK", { "Content-Type": "text/json" });
        response.end(JSON.stringify(retObject));
      });
    }
    else{
      request.on("end", function () {
        modifyPrice(JSON.parse(dataString))
        calcTotalPrice();
        retObject = { groceryList, totalPrice };
        console.log(retObject)
        response.writeHead(200, "OK", { "Content-Type": "text/json" });
        response.end(JSON.stringify(retObject));
      });
    }


};
const deleteItems = function(data){
  let temp = []
  outerLoop: data.items.forEach(idx =>{
    if(idx < groceryList.length){
    innerLoop: for(let i = 0; i < groceryList.length; i++)
    {
      if(i !== idx){
        temp.push(groceryList[i])
      }
      else{
        groceryList.splice(idx, 1)
      }
    }}
    else{
      groceryList.splice(idx, 1)
    }
  });

  console.log(temp)
  groceryList.splice(0, groceryList.length);
  temp.forEach(item =>{
    groceryList.push(item)
  });

}
const handleDelete = function (request, response) {

  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  if(request.url === "/reset"){
  request.on("end", function () {
    groceryList.splice(0, groceryList.length);
    console.log(groceryList)
    calcTotalPrice();
    response.writeHead(200, "OK", { "Content-Type": "text/json" });
    response.end(JSON.stringify(groceryList));
  });}
  else{
    request.on("end", function () {
      deleteItems(JSON.parse(dataString))
      calcTotalPrice();
      retObject = { groceryList, totalPrice };
      console.log(retObject)
      response.writeHead(200, "OK", { "Content-Type": "text/json" });
      response.end(JSON.stringify(retObject));
    });
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
