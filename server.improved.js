const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

let taskId = 0;
let taskList = [];

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice(1); 

  if( request.url === '/' ) {
    sendFile(response, 'public/index.html');
  }
  else if (request.url === '/tasks') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(taskList));
  }
  else{
    sendFile(response, filename);
  }
}

const handlePost = function(request, response) {
  if (request.url === '/submit') {
    submitTasks(request, response);
  }
  else if (request.url === '/deleteTask') {
    deleteTask(request, response);
  }
}

const submitTasks = function( request, response ) {
  let dataString = '';

  request.on( 'data', function(data) {
      dataString += data;
  })

  request.on('end', function() {
    let info = JSON.parse(dataString);

    const currentDate = new Date();
    const objDate = new Date(info.dueDate);
    if (currentDate <= objDate) {
      const timeDifferenceInMilliseconds = objDate - currentDate;
      const daysDifference = Math.ceil(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));

      info.daysRemaining = daysDifference > 1 ? `${daysDifference} days` : "1 day";
    }
    else {
      info.daysRemaining = "Overdue";
    }
    info.taskId = taskId;
    taskId = taskId + 1;

    console.log(info);
    taskList.push(info);

    response.writeHead(200, "OK", {'Content-Type': 'text/plain' });
    response.end('test');
  })
}

const deleteTask = function(request, response) {
  let dataString = '';

  request.on( 'data', function(data) {
      dataString += data;
  })

  request.on('end', function() {
    let info = JSON.parse(dataString);
    for (let i = 0; i < taskList.length; i++) {
      if (parseInt(info.id) === taskList[i].taskId) {
        taskList.splice(i, 1);
        break;
      }
    }

    response.writeHead(200, "OK", {'Content-Type': 'text/plain' });
    response.end('test');
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
