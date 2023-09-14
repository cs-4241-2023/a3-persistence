// import node.js, mime, and other dependencies
const http = require('http'),
    fs   = require('fs'),
    mime = require('mime'),
    dir  = 'public/',
    port = 3000

// this is the data contained by the server, it will hold the assignments submitted by users. It is currently filled with example data.
const appdata = [
  {id: 100000 , className: "CS 4241", assignmentName: "Assignment 2", dueDate:"2023-09-11", difficulty: 5, priority: "Medium"},
  {id: 200000 , className: "CS 3013", assignmentName: "Homework 1", dueDate:"2023-09-05", difficulty: 3, priority: "Low"}
];

// server variable that handles requests
const server = http.createServer( function( request,response ) {
  if(request.method === 'GET') // GET REQUEST
  {
    handleGet(request, response);
  }
  else if(request.method === 'POST') // POST REQUEST
  {
    handlePost(request, response);
  }
  else if(request.method === "DELETE") // DELETE REQUEST
  {
    handleDelete(request, response);
  }
  else if(request.method === "PUT") // PUT REQUEST
  {
    handlePut(request, response);
  }
});

// handle PUT request
const handlePut = function (request, response) {
  let dataString = "";

  request.on('data', function(data) {
    dataString += data;
  });

  request.on('end', function() {
    // parse edited data into JSON
    let editedData = JSON.parse(dataString);

    // track if assignment is found
    let found = false;

    appdata.forEach(assignment => {
      if(assignment.id === editedData.id && !found)
      {
        // assignment found
        found = true;

        // recalculate the priority
        editedData.priority = calculatePriority(editedData.dueDate, editedData.difficulty);

        // replace assignment with the same ID
        appdata[appdata.indexOf(assignment)] = editedData;
      }
    });

    if(found)
    {
      // successful PUT request
      response.writeHead(200, "OK", {'Content-Type': 'text/json'});
      response.end(JSON.stringify({result: "success", message: ""}));
    }
    else
    {
      // should not be possible but
      response.writeHead(200, "OK", {'Content-Type': 'text/json'});
      response.end(JSON.stringify({result: "failure", message: `ID ${editedData.id} not found.`}));
    }
  });
}

// handle DELETE request
const handleDelete = function (request, response) {
  let dataString = "";

  request.on('data', function(data) {
    dataString += data;
  });

  request.on('end', function() {
    let dataToDelete = JSON.parse(dataString);

    appdata.forEach(assignment => {
      if(JSON.stringify(dataToDelete) === JSON.stringify(assignment)) {
        appdata.splice(appdata.indexOf(assignment), 1);
        response.writeHead(200, "OK", {'Content-Type': 'text/json'});
        response.end(JSON.stringify({result: "success", message: ""}));
      }
    });
  });
}

// handle GET request
const handleGet = function(request, response) {
  const filename = dir + request.url.slice(1);

  if(request.url === '/')
  {
    sendFile(response, 'public/index.html');
  }
  else if(request.url === '/assignment-data') // send app data
  {
    response.writeHead(200, "OK", {'Content-Type': 'text/json'});
    response.end(JSON.stringify(appdata));
  }
  else
  {
    sendFile(response, filename);
  }
}

// handle POST request
const handlePost = function(request, response) {
  let dataString = "";

  request.on('data', function(data) {
    dataString += data;
  });

  request.on('end', function() {
    // get data sent on POST request
    let sentData = JSON.parse(dataString);

    // verify data integrity, reject bad data
    let id = sentData.id;
    let className = sentData.className;
    let assignmentName = sentData.assignmentName;
    let dueDate = sentData.dueDate;
    let difficulty = sentData.difficulty;
    let difficultyNum = parseInt(difficulty);

    // send failure if any of the fields are empty
    if(className === "" || assignmentName === "" || dueDate === "")
    {
      endPost(response, "failure", "One or more fields are empty!");
    }
    else if(difficulty === "" || isNaN(difficultyNum) || difficultyNum < 0 || difficultyNum > 10)
    {
      endPost(response, "failure", "Difficulty must be an integer between 1 and 10!");
    }
    else
    {
      // calculate the priority - THIS IS THE DERIVED FIELD
      let priority = calculatePriority(dueDate, difficulty);

      // push the data to the app-date array
      appdata.push({id: id, className: className, assignmentName: assignmentName, dueDate: dueDate, difficulty: difficulty, priority: priority } )

      // end post with success
      endPost(response,"success", "");
    }
  });
}
/**
 * Ends POST request with a given result
 * @param response the post request response object
 * @param result the result of the request
 * @param message a message relating to the result
 */
const endPost = function(response, result, message) {
  response.writeHead(200, "OK", {'Content-Type': 'text/json'});
  response.end(JSON.stringify({result: result, message: message}));
}

/**
 * calculates the priority of an assignment, part of the derived field
 * @param dueDate the assignment's due date
 * @param difficulty the assignment's difficulty
 */
const calculatePriority = function (dueDate, difficulty) {

  let date = new Date(dueDate);

  if((difficulty > 0 && difficulty <= 3) || date.getDay() >= 14) // low priority
  {
    return "Low"
  }
  else if((difficulty > 3 && difficulty <= 6) || (date.getDay() >= 7 && date.getDay() < 14)) // medium priority
  {
    return "Medium"
  }
  else // high priority
  {
    return "High"
  }
}

// sends a file to the server
const sendFile = function(response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function( err, content) {

    // if the error = null, then we've loaded the file successfully
    if(err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { 'Content-Type': type });
      response.end(content);

    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end('404 Error: File Not Found');
    }
  });
}

// set up server to listen on port 3000
server.listen(process.env.PORT || port);
