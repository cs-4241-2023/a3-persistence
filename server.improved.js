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
  { 'Name': 'Webware', 
  'Code': 'CS4241',
  'StartTime' : '12:00',
  'EndTime': '14:00',
  'Days': { 'pos0': 'M', 'pos1': 'Th' },
  'Length': 2 },
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


  if(request.url === '/submit') {
    handleSubmit( request, response )
  } else if(request.url === '/getAll') {    
    handleGetAll( request, response )
  } else if(request.url === '/remove') {
    handleRemove( request, response )
  } else if(request.url === '/modify') {
    handleModify( request, response )
  } else {
    console.log('FAIL - requested: ' + request.url)
  }
}

const handleGetAll = function(request, response) {
    request.on( 'data', () => {})
    request.on( 'end', function() {          
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      // console.log('getAll - sending: ' + JSON.stringify(appdata))
      response.end(JSON.stringify(appdata))
    })
}

const handleSubmit = function(request, response) {
    let dataString = ''

    request.on( 'data', function( data ) {
        dataString += data 
    })

    request.on( 'end', function() {
      // console.log( 'submit - received: ' + JSON.parse( dataString ) )
  
      json = JSON.parse( dataString )
        
      // add data
      // check has name, start time, end time, and 1 day associated
      const error = validate(json);

      if(error.errors === false) { // no errors

        // calculate the derived field (length of class)
        json['Length'] = calcDerivedLength(json.StartTime, json.EndTime)

        // add to the server data
        appdata.push(
          json
        )

        // console.log('submit - new data: ' + JSON.stringify(appdata))

        response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
        response.end(JSON.stringify({}))
      } else { // send back error message
        // console.log('submit - error: ' + JSON.stringify(error))
        response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
        response.end( JSON.stringify(error) )
      }
    })
}

const handleRemove = function(request, response) {
    let dataString = ''

    request.on( 'data', function( data ) {
        dataString += data 
    })

    request.on( 'end', function() {
      // console.log( 'remove - received: ' + JSON.parse( dataString ) )
  
      json = JSON.parse( dataString )
        
      // find the data to remove
      let i = 0;
      const max = appdata.length
      for(obj of appdata) {
        if(JSON.stringify(obj) === json) {
            const front = appdata.slice(0, i)
            const back = appdata.slice(i+1)
            const temp = front.concat(back)
            while(appdata.length > 0) {
                appdata.pop()
            }
            for(let j = 0; j < temp.length; j++) {
                appdata.push(temp[j])
            }
            
            response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
            response.end('success')
            console.log('remove - success')
            break
        } else {
            i++
        }
      }

    if(i >= max) {
        response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
        response.end('fail')
        console.log('failed to remove')
    }
    })
}

const handleModify = function(request, response) {
    let dataString = ''

    request.on( 'data', function( data ) {
        dataString += data 
    })

    request.on( 'end', function() {
      // console.log( 'modify - received: ' +  dataString )
  
      json = JSON.parse( dataString )
        
      prev = json.prev
      data = json.new

      if(prev === "") { // no classes to modify
        const error = {
          'errors': true,
          'classModifySelect': "No Classes To Modify",
        }
        // console.log('modify - error: ' + JSON.stringify(error))
        response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
        response.end( JSON.stringify(error) )
      } else {
        // validate the new values
        const error = validate(data);

        if(error.errors === false) {
          // find the data to modify
          let i = 0;
          const max = appdata.length
          for(obj of appdata) {
              if(JSON.stringify(obj) === prev) {

                  obj.Name = data.Name
                  obj.Code = data.Code
                  obj.StartTime = data.StartTime
                  obj.EndTime = data.EndTime
                  obj.Length = calcDerivedLength(data.StartTime, data.EndTime)
                  
                  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
                  response.end(JSON.stringify({}))
                  console.log('modify - success')
                  break
              } else {
                  i++
              }
          }
          if(i >= max) {
              response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
              response.end(JSON.stringify(error))
              console.log('failed to modify')
          }
        } else { // send back error message
        //   console.log('modify - error: ' + JSON.stringify(error))
          response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
          response.end( JSON.stringify(error) )
        }        
      }
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

const validate = data => {
  error = {
    errors: false,
    className: true,
    startTime: true,
    endTime: true,
    days:  true
  }
  if(!(data.Name.length > 0) ) {
    error.className = "Name required"
    error.errors = true
  }
  if(!(data.StartTime.length > 0) ) {
    error.startTime = "Start Time required"
    error.errors = true
  }
  if(!(data.EndTime.length > 0) ) {
    error.endTime = "End Time required"
    error.errors = true
  }

  const start = data.StartTime.split(':')
  const end = data.EndTime.split(':')
  if(start[0] > end[0]) {
    error.startTime = "Start Time must be before End Time"
    error.errors = true
  } else if (start[0] == end[0] && start[1] > end[1]) {
    error.startTime = "Start Time must be before End Time"
    error.errors = true
  }

  if(!(Object.keys(data.Days).length > 0)) {
    error.days = "Must select at least one day"
    error.errors = true
  }
  return error;
};

const calcDerivedLength = (start, end) => {
    // calculate the derived field (length of class)
    const s = new Date('1970-01-01T' + start + ":00")
    const e = new Date('1970-01-01T' + end + ":00")
    const msPerHour = 1000 * 60 * 60
    return Math.round(((e-s) / msPerHour) * 100) / 100
}

server.listen( process.env.PORT || port )