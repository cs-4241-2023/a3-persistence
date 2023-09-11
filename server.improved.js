const http = require( 'http' ),
    fs   = require( 'fs' ),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you're testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require( 'mime' ),
    dir  = 'public/',
    port = 3000

const appdata = [
  { 'task': 'homework', 'creationDate': '9/01/2023', 'deadline': '9/08/2023'},
  { 'task': 'taxes', 'creationDate': '9/01/2023', 'deadline': '9/09/2023' },
  { 'task': 'chores', 'creationDate': '9/01/2023', 'deadline': '9/10/2023' }
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )
  }else if( request.method === 'POST' ){
    handlePost( request, response );
  }else if( request.method === 'DELETE' ){
    handleDelete( request, response );
  }
})

const handleDelete = function( request, response ) {
  console.log("Handle Delete");
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {
    let data=JSON.parse( dataString );
    console.log(data);
  })

  /*request.on( 'data', function( data ) {
    dataString += data
  })

  console.log(dataString);

  request.on( 'end', function() {
    let data = JSON.parse(dataString);
    let index=appdata.indexOf(data);
    console.log(data);
    console.log(index);
    if (index > -1) {
      appdata.splice(index, 1);
    }
  });*/
}

const handleGet = function( request, response ) {
  SortData();
  const filename = dir + request.url.slice( 1 )
  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else if (request.url === '/json' ) {
    handleGetData(request, response);
  }else{
    sendFile( response, filename )
  }
}

function handleGetData(request, response){
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(appdata));
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {
    console.log(dataString)
    if (request.url === '/addtask'){
      appdata.push(JSON.parse(dataString))
    } else {  //deleteItem
      let index = appdata.indexOf(JSON.parse(dataString))
      appdata.splice(index, 1)
    }

    SortData();
    response.writeHead( 200, "OK", {'Content-Type': 'text/json' })
    response.end( JSON.stringify( appdata ) )
  })
}

function SortData(){
    appdata.sort(function(a, b){
      var c = new Date(a.deadline);
      var d = new Date(b.deadline);
      return c-d;
    });
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
