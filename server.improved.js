const { MongoClient, ServerApiVersion } = require('mongodb'),
      express = require( 'express' ),
      app = express(),
      port = 3000,
      mongouser = process.env.MONGO_USERNAME,
      mongopass = process.env.MONGO_PASSWORD;
      
const uri = "mongodb+srv://" + mongouser + ":" + mongopass + "@cs4241.mwubspm.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";


let scores = []

app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());

app.post('/submit', handleManualScore);
app.post('/refresh', refresh);

function newScore(name, score) {
  const dateSub = new Date()
  const newsc = {'name': name, 'score': score, 'date': dateSub};
  //console.log(newsc)
  scores.push(newsc)
}

function refresh(request, response) {
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

app.listen( process.env.PORT || port )
 