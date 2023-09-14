const { time } = require('console')

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
  { 'model': 'toyota', 'year': 1999, 'mpg': 23 },
  { 'model': 'honda', 'year': 2004, 'mpg': 30 },
  { 'model': 'ford', 'year': 1987, 'mpg': 14} 
]

let characterData =[
  {'name': 'Aragorn', 'start': 1065, 'end' : 1403, 'era':""}
]

let timelineData = [
  {'era': 'First Age', 'date': 1000, 'description': 'The beginning'},
  {'era': 'Second Age', 'date': 1567, 'description': 'The defeat of the witch-king of Angmar'},
  {'era': 'The Space Age', 'date': 2552, 'description': 'The Fall of Reach'}
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  } else if(request.method === 'DELETE'){
    handleDelete( request, response)
  }
})

const handleDelete = function( request, response) {
  if(request.url === '/timelineData'){
    console.log("Handle Delete");
    let dataString = ''

    request.on( 'data', function( data ) {
      dataString += data
     })

    console.log(dataString);

    request.on( 'end', function() {
      let data = JSON.parse(dataString);
      let index = -1;


      index = timelineData.findIndex(item => 
        item.era === data.era && item.date === data.date && item.description === data.description
      );

      if (index > -1) {
        timelineData.splice(index, 1);
      }
      RecheckCharacters();
    })
  } else if(request.url === '/characterData'){
    console.log("Handle Delete");
    let dataString = ''

    request.on( 'data', function( data ) {
      dataString += data
     })

    console.log(dataString);

    request.on( 'end', function() {
      let data = dataString


      index = characterData.findIndex(item => 
        item.name === data );

      if (index > -1) {
        characterData.splice(index, 1);
      }
      console.log(characterData);
      response.writeHead( 200, "OK", {'Content-Type': 'text/json' })
      response.end(JSON.stringify(characterData));
    })
  } 
}

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 
  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else if (request.url === '/timelineData' ) {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(timelineData));
  }else if (request.url === '/characterData' ) {
    RecheckCharacters();
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(characterData));
  }else{
    sendFile( response, filename )
  }
}


const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {

    let value = JSON.parse( dataString );
    
    if(value.hasOwnProperty('date')){
      timelineData.push(value)
      SortTimeline()

      RecheckCharacters()

      response.writeHead( 200, "OK", {'Content-Type': 'text/json' })
      response.end(JSON.stringify(timelineData))
    } else if(value.hasOwnProperty('name')){

      let character = AssignEra(value)
      characterData.push(character);
      RecheckCharacters();


      response.writeHead( 200, "OK", {'Content-Type': 'text/json' })
      response.end(JSON.stringify(characterData))
    }  else{
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end('test')
    }


  })
}



//passed a json object with date and era, assigns era based on given timeline info, returns new json object

function RecheckCharacters(){
  for(let i = 0; i < characterData.length; i++){
    AssignEra(characterData[i]);
  }
}

function AssignEra(value){
  value.era = "unknown"

  if(timelineData.length === 0){
    return;
  }
  for(let i = 0; i < timelineData.length - 1;  i++){
    //check if incoming character is contained in each age
    let total = value.end - value.start;
    if( (value.start >= timelineData[i].date && value.start <= timelineData[i+1].date - 1) || (timelineData[i].date >= value.start && timelineData[i+1].date - 1 <= value.end) || (value.end >= timelineData[i].date && value.end <= timelineData[i+1].date - 1)){
      if(value.era === "unknown"){
        value.era = "";
        value.era += timelineData[i].era;
      } else{
        value.era += ", " + timelineData[i].era;
      }
    }
  }

  if((value.start >= timelineData[timelineData.length - 1].date) || (value.end >= timelineData[timelineData.length - 1].date)){
    if(value.era === "unknown"){
      value.era = "";
      value.era += timelineData[timelineData.length - 1].era;
    } else{
      value.era += ", " + timelineData[timelineData.length - 1].era;
    }
  }
  return value;
}

//sorts timeline by date
function SortTimeline(){
  timelineData.sort(function(a, b){
    return a.date - b.date;
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
