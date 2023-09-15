const express = require( 'express' ),
      app = express()

// Static files from public directory
app.use( express.static( 'public' ) )
app.use( express.json() ) // for parsing application/json

// serverPlayerLog is the test data that is stored on server
let serverPlayerLog = [
    { name: 'example-player', color: 'red', score: 0, rank: 0 }
  ]


// Routes

// GET
app.get( '/', ( req, res ) => res.send( 'Handled GET request' ) )

// POST 
app.post( '/submit', express.json(), ( req, res ) => {
    
    console.log(req)
    serverPlayerLog.push( req.body)

    // Sort serverPlayerLog by score and add rank to each player
    // Abstract this into sort function
    // serverPlayerLog.sort((a, b) => (a.score < b.score) ? 1 : -1)
    // serverPlayerLog.forEach((player, index) => {
    //   player.rank = index + 1;
    // })
    rankPlayers(serverPlayerLog);

    res.writeHead( 200, { 'Content-Type': 'application/json'})
    res.end( JSON.stringify( serverPlayerLog ) )
  })

  // Sort function that inputs serverPlayerLog and outputs sorted serverPlayerLog
    function rankPlayers(serverPlayerLog) {
        serverPlayerLog.sort((a, b) => (a.score < b.score) ? 1 : -1)
        serverPlayerLog.forEach((player, index) => {
          player.rank = index + 1;
        })
        return serverPlayerLog;
    }



app.listen( process.env.PORT || 3000 )