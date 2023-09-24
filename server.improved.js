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
  {'name':'Alex Marrinan', 'email': 'ammarrinan@wpi.edu','type': 'Undergrad Student', 'department': 'CS/IMGD', 'id': 0},
  {'name':'Charlie Roberts', 'email': 'croberts@wpi.edu','type': 'Professor', 'department': 'CS/IMGD', 'id': 1}
]

var nextId = 2

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
  else if( request.method === 'DELETE' ){
    handleDelete( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 
  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }
  if( request.url === '/getUsers' ) {
    response.writeHead( 200, "OK", {'Content-Type': 'text/json' })
    response.end(JSON.stringify(appdata));
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''
  if (request.url !== '/newUser'){
    return
  }
  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    const json = JSON.parse(dataString)
    const email = `${json.name.charAt(0)}${json.email}@wpi.edu`.toLowerCase()
    json['name'] += ` ${json.email}`
    json['email'] = email
    json.id = nextId
    nextId += 1
    appdata.push(json);
    response.writeHead( 200, "OK", {'Content-Type': 'text/json' })
    response.end(JSON.stringify(json))
  })
}

const handleDelete = function( request, response ) {
    
  let dataString = ''
  if (request.url === '/clearUsers'){
    var len = appdata.length
    appdata.splice(0, len)
    response.writeHead( 200, "OK", {'Content-Type': 'text/json' })
    response.end('deleted all users!')
    return
  }

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {

    let data = JSON.parse(dataString);
    for (var i = 0; i < appdata.length; i++){
      if (appdata[i].id === data.id){
        appdata.splice(i, 1)
        response.writeHead( 200, "OK", {'Content-Type': 'text/json' })
        response.end('deleted user!')
        return
      }
    }
    response.writeHead( 200, "OK", {'Content-Type': 'text/json' })
    response.end('user not found!')
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

      //  // file not found, error code 404
      //  response.writeHeader( 404 )
      //  response.end( '404 Error: File Not Found' )
     }
   })
}

server.listen( process.env.PORT || port )
