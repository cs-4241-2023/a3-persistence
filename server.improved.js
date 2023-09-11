const http = require('http'), //Allow use of HTTP server and client
      fs   = require('fs'), //Enables interaction with the file system
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require('mime'),
      dir  = 'public/',
      port = 3000

let musicListeningData = [
  {'bandName': 'Dry Kill Logic', 'albumName': 'The Darker Side of Nonsense', 'releaseYear': '2001', 'albumAge': 22},
  {'bandName': 'Dry Kill Logic', 'albumName': 'The Dead and Dreaming', 'releaseYear': '2004', 'albumAge': 19},
  {'bandName': 'Killswitch Engage', 'albumName': 'Alive or Just Breathing', 'releaseYear': '2002', 'albumAge': 21} 
]

//Personal notes:
//HTTP requests allow interaction between frontend and backend of websites
//There must be an interaction betwwen a server and client to modify data
//HTTP methods to request data allows us to perform CRUD operations on servers: POST, GET, PUT/PATCH, and DELETE.
//Every request includes an endpoint and a type of request being sent.
//The endpoint is the path between the client and server.
//Server sends back a response depending on the validity of the request
  //If the request is successful, the server sends back data in the form of JSON.
  //If the request fails, then an error message is sent back to the client.
  //Responses are associated with status codes:
    //A status code of 200 means that the request was successful.
//Client sends the request, server recieves the request.

//GET: GET Request is used to retrieve data from the server.
//POST: POST Request sends new data to the server as an object.
//PATCH: PATCH Request is used to update certain properties of an object.
//PUT: PUT Request updates all properties of an object.
//DELETE: DELETE Request deletes data from a server.

const server = http.createServer(function(request,response) { //Create an HTTP server. RequestListener is automatically added to the Request event when the server is created.
  if(request.method === 'GET') { //If the client is requesting retrieval of data from the server
    handleGet(request, response)    
  }else if(request.method === 'POST'){ //If client is requesting to send new data to server
    handlePost(request, response) 
  }else if(request.method === 'DELETE'){
    handleDelete(request, response)
  }
})


//Handle the GET and POST requests in separate cases:

const handleGet = function(request, response) {
  
  console.log(request.url)
  const filename = dir + request.url.slice(1) //The slice() method returns selected elements in an array, as a new array. Selects from a given starting index up to (not including) a given ending index.

  if(request.url === '/') { //If the request URL is to the index.html file
    sendFile(response, 'public/html/index.html')
  }
  else if(request.url === '/view_music_listening_list.html') {
    sendFile(response, 'public/html/view_music_listening_list.html')
  }
  else if(request.url === '/getMusicData') {
    response.end(JSON.stringify(musicListeningData))
  }
  else { //If the request URL is to any other file under public folder
    sendFile(response, filename)
  }
}

const handlePost = function(request, response) {
  let dataString = ''

  request.on('data', function(data) { //When client is requesting to send new data to server, append the data to dataString.
      dataString += data 
  })

  request.on('end', function() { //At the end of a request, do the following:

    const createDerivedFieldAndPush = function(dataObject) {
      const currentYear = 2023
      const albumReleaseYear = parseInt(dataObject.releaseyear)
      const albumAge = currentYear - albumReleaseYear

      console.log(dataObject) //JSON.parse converts a JSON string into an object. To access object members, use the member names that make up the JSON.
      musicListeningData.push({'bandName': dataObject.bandname, 'albumName': dataObject.albumname, 'releaseYear': dataObject.releaseyear, 'albumAge': albumAge})
    }

    function countDuplicatesInMusicListeningData(dataObject) {  
      let counter = 0
      musicListeningData.forEach(d => {        
        console.log((d.bandName === dataObject.bandname) && (d.albumName === dataObject.albumname) && (d.releaseYear === dataObject.releaseyear))
        
        if(((d.bandName === dataObject.bandname) && (d.albumName === dataObject.albumname) && (d.releaseYear === dataObject.releaseyear))) {
          counter++
        }
      })

      return counter
    }

    const dataObject = JSON.parse(dataString)

    if(countDuplicatesInMusicListeningData(dataObject) === 0) {
      createDerivedFieldAndPush(dataObject)
    }
    else {
      console.log("Server cannot contain duplicate music listening data.")
    }

    response.writeHead(200, "OK", {'Content-Type': 'text/json'}) //writeHead sends a response header to the client request. Here, we send a 200 status OK response header.
    response.end(JSON.stringify(musicListeningData)) //End the response process with the appdata converted to a JSON string.
  })
}

const handleDelete = function(request, response) {
  let dataString = ''

  request.on('data', function(data) { 
    dataString += data 
  })

  request.on('end', function() {
    const dataObject = JSON.parse(dataString)
    
    musicListeningData.forEach(d => {
      if(((d.bandName === dataObject.bandname) && (d.albumName === dataObject.albumname) && (d.releaseYear === dataObject.releaseyear))) {
        let currentIndex = musicListeningData.indexOf(d)
        musicListeningData.splice(currentIndex, 1)
        console.log("Music previously at index " + currentIndex + " has been removed from musicListeningData")
      }
    })

    response.writeHead(200, "OK", {'Content-Type': 'text/json'}) //writeHead sends a response header to the client request. Here, we send a 200 status OK response header. 
    response.end(JSON.stringify(musicListeningData))
  })
}

const sendFile = function(response, filename) { //sendFile function only applies to the GET Request as this is where the client requests data from the server (therefore a file needs to be sent to the client).
   const type = mime.getType(filename) //Get the file type

   fs.readFile(filename, function(err, content) { //read the file using fs and check for errors.

     // if the error = null, then we've loaded the file successfully
     if(err === null) {
       //status codes: https://httpstatuses.com
        response.writeHeader(200, {'Content-Type': type}) //Send a response header to the client request with an OK status 200 and include the file/content type.
        response.end(content) //End the response process with the file contents.
     } 
     else {
       // file not found, error code 404
       response.writeHeader(404)
       response.end('404 Error: File Not Found')
     }
   })
}

server.listen(process.env.PORT || port) //asynchronous function, make the server created above start listening for connections.
console.log("Server is listening on port: ", server.address().port)