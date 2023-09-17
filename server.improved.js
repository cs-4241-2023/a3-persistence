const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const startDate = new Date()
//console.log(startDate)

let scores = [
  { 'name': 'david', 'score': 13, 'date': startDate}
]

const appdata = [
  { 'model': 'toyota', 'year': 1999, 'mpg': 23 },
  { 'model': 'honda', 'year': 2004, 'mpg': 30 },
  { 'model': 'ford', 'year': 1987, 'mpg': 14} 
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  if (request.url === '/submit') {
    handleManualScore(request, response)
  } else {
    refresh(response)
  }
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

function newScore(name, score) {
  const dateSub = new Date()
  const newsc = {'name': name, 'score': score, 'date': dateSub};
  //console.log(newsc)
  scores.push(newsc)
}

function refresh(response) {
  //console.log(scores)
  response.writeHeader(200, {'Content-Type': 'text/plain'})
  response.end(JSON.stringify(scores))
}

function handleManualScore(request, response) {
  let dataString = ''
  request.on( 'data', function( data ) {
    dataString += data 
    //console.log(data)
  })

  request.on( 'end', function() {
    //console.log(dataString)
    let req =  JSON.parse( dataString )
    //console.log(req)
    // ... do something with the data here!!!
    const currscore = parseInt(req.score);

    if (isNaN(currscore)) {
      response.writeHead(400)
      response.end('Score is not an integer value')
      return;
    }

    let updated = false;

    for (let i = 0; i < scores.length; i++) {
      if (scores[i].name === req.yourname) {
        updated = true;
        if (currscore >= 0) {
          scores[i].score = currscore;
        } else {
          scores.splice(i,1);
        }
        break;
      }
    }
    if (!updated) {
      newScore(req.yourname, req.score)
    }

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end('test')
  })

}

server.listen( process.env.PORT || port )
 