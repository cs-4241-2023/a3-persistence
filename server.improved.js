const http = require('http'),
  fs = require('fs'),
  mime = require('mime'),
  dir = 'public/',
  port = 3000;

function getRandomDate(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
}

function getRandomCost(minCost, maxCost) {
  return Math.floor(Math.random() * (maxCost - minCost + 1)) + minCost;
}

let lastID = 13;
const expenseList = [
  { 'Id': 1, 'Item': 'Rent', 'Cost': getRandomCost(500, 1500), 'Date': getRandomDate('2023-08-01', '2023-09-14') },
  { 'Id': 2, 'Item': 'Groceries', 'Cost': getRandomCost(100, 300), 'Date': getRandomDate('2023-08-01', '2023-09-14') },
  { 'Id': 3, 'Item': 'Electricity', 'Cost': parseFloat((Math.random() * 100).toFixed(2)), 'Date': getRandomDate('2023-08-01', '2023-09-14') },
  { 'Id': 4, 'Item': 'Internet', 'Cost': getRandomCost(30, 90), 'Date': getRandomDate('2023-08-01', '2023-09-14') },
  { 'Id': 5, 'Item': 'Gas', 'Cost': parseFloat((Math.random() * 50).toFixed(2)), 'Date': getRandomDate('2023-08-01', '2023-09-14') },
  { 'Id': 6, 'Item': 'Dining Out', 'Cost': parseFloat((Math.random() * 100).toFixed(2)), 'Date': getRandomDate('2023-08-01', '2023-09-14') },
  { 'Id': 7, 'Item': 'Gym Membership', 'Cost': parseFloat((Math.random() * 30).toFixed(2)), 'Date': getRandomDate('2023-08-01', '2023-09-14') },

  // Last month
  { 'Id': 8, 'Item': 'Rent', 'Cost': getRandomCost(500, 1500), 'Date': getRandomDate('2023-07-01', '2023-08-01') },
  { 'Id': 9, 'Item': 'Groceries', 'Cost': getRandomCost(100, 300), 'Date': getRandomDate('2023-07-01', '2023-08-01') },
  { 'Id': 10, 'Item': 'Electricity', 'Cost': getRandomCost(20, 80), 'Date': getRandomDate('2023-07-01', '2023-08-01') },
  { 'Id': 11, 'Item': 'Internet', 'Cost': getRandomCost(30, 90), 'Date': getRandomDate('2023-07-01', '2023-08-01') },
  { 'Id': 12, 'Item': 'Gas', 'Cost': getRandomCost(10, 40), 'Date': getRandomDate('2023-07-01', '2023-08-01') },
  { 'Id': 13, 'Item': 'Gym Membership', 'Cost': getRandomCost(5, 25), 'Date': getRandomDate('2023-07-01', '2023-08-01') }
];

const server = http.createServer(function (request, response) {
  //console.log("Received request:", request.url);

  if (request.method === 'GET') {
    if (request.url === '/expenses') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(expenseList));
    } else {
      handleGet(request, response);
    }
  } else if (request.method === 'POST') {
    handlePost(request, response);
  } else if (request.method === 'DELETE') {
    handleDelete(request, response);
  } else if (request.method === 'PUT') {
    handlePut(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === '/') {
    sendFile(response, 'public/index.html');
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  let dataString = '';

  request.on('data', function (data) {
    dataString += data;
  });

  request.on('end', function () {
    const expense = JSON.parse(dataString);

    // Parse the cost and format it with two decimal places
    if (typeof expense.Cost === 'string') {
      expense.Cost = parseFloat(expense.Cost);
      if (!isNaN(expense.Cost)) {
        expense.Cost = expense.Cost.toFixed(2);
      }
    }

    // Add the id and current date to the expense object
    lastID += 1;
    expense.Id = lastID;
    expense.Date = new Date().toISOString();

    expenseList.push(expense);

    response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(expenseList));
  });
};

const handlePut = function (request, response) {
  let urlParts = request.url.split("/");
  let dataString = '';

  if (urlParts[1] === 'updateExpense') {
    const id = parseInt(urlParts[2]);
    const index = expenseList.findIndex(expense => expense.Id === id);

    if (index === -1) {
      response.writeHead(400, "Bad Request", { 'Content-Type': 'text/plain' });
      response.end("Invalid Id");
      return;
    }

    request.on('data', function (data) {
      dataString += data;
    });

    request.on('end', function () {
      const updatedExpense = JSON.parse(dataString);
      updatedExpense.Id = id;
      expenseList[index] = updatedExpense;

      response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(expenseList));
    });
  }
};

const handleDelete = function (request, response) {
  let urlParts = request.url.split("/");
  if (urlParts[1] === 'deleteExpense') {
    const id = parseInt(urlParts[2]);
    const index = expenseList.findIndex(expense => expense.Id === id);
    if (index !== -1) {
      expenseList.splice(index, 1);
      response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(expenseList));
    } else {
      response.writeHead(400, "Bad Request", { 'Content-Type': 'text/plain' });
      response.end("Invalid Id");
    }
  }
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    if (err === null) {
      response.writeHeader(200, { 'Content-Type': type });
      response.end(content);
    } else {
      response.writeHeader(404);
      response.end('404 Error: File Not Found');
    }
  });
};

const PORT = 3000;
server.listen(PORT);
console.log(`Server is running on port ${PORT}`);