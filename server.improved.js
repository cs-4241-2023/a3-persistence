
const express    = require('express'),
      server     = express(),
      appdata    = []
      PORT       = 3000


server.use( express.static( 'public' ) )
// server.use( express.static( 'views'  ) )
server.use( express.json() )

server.post( '/submit', (req, res) => {
  debugger;
  appdata.push( req.body)
  res.writeHead( 200, { 'Content-Type': 'application/json' })
  res.end( JSON.stringify( appdata ) )
})

server.post( '/delete', (req, res) => {
  appdata.splice(req.body.row, 1);
  console.log("Row " + req.body.row + " was deleted.")
  res.writeHead( 200, { 'Content-Type': 'application/json' })
  // res.end( JSON.stringify( appdata ) )
})


server.listen( 3000 )