

// TODO: remove and put in the database
const appdata = [
    { 'Name': 'Webware', 
    'Code': 'CS4241',
    'StartTime' : '12:00',
    'EndTime': '14:00',
    'Days': { 'pos0': 'M', 'pos1': 'Th' },
    'Length': 2 },
  ]
  

const handleGet = function( request, response ) {
    const filename = dir + request.url.slice( 1 ) 
  
    if( request.url === '/' || request.url === '/login' ) {
      sendFile( response, 'public/index.html' )
    }else{
      sendFile( response, filename )
    }
  }
  
  const handleGetAll = function(request, response) {
      request.on( 'data', () => {})
      request.on( 'end', function() {          
        response.writeHead( 200, "OK", { 'Content-Type': 'application/json' })
        console.log('getAll - sending: ' + JSON.stringify(appdata))
        response.end(JSON.stringify(appdata))
      })
  }
  


app.post('/getAll', handleGetAll)