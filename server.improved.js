const { time } = require('console')


const express = require("express");

const app = express();

const port = 3000


let characterData = [
  { 'name': 'Aragorn', 'start': 1065, 'end': 1403, 'era': "" }
]

let timelineData = [
  { 'era': 'First Age', 'date': 1000, 'description': 'The beginning' },
  { 'era': 'Second Age', 'date': 1567, 'description': 'The defeat of the witch-king of Angmar' },
  { 'era': 'The Space Age', 'date': 2552, 'description': 'The Fall of Reach' }
]



app.use(express.static('public'));


//get functions

app.get('/', (req, res) => {
  console.log(req);
  const filename = "public/index.html"
  const options = {
    root: path.join(__dirname)
  };
  res.sendFile(filename, options, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Sent:', filename);
    }
  });
});

app.get('/timelineData', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(timelineData));
});

app.get('/characterData', (req, res) => {
  RecheckCharacters();
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(characterData));
});


//delete functions


app.delete('/timelineData', (request, response) => {
  console.log("Handle Delete");
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  console.log(dataString);

  request.on('end', function () {
    let data = JSON.parse(dataString);
    let index = -1;


    index = timelineData.findIndex(item =>
      item.era === data.era && item.date === data.date && item.description === data.description
    );

    if (index > -1) {
      timelineData.splice(index, 1);
    }
    RecheckCharacters();

    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(timelineData));
  })
})

app.delete('/characterData', (request, response) => {
  console.log("Handle Delete");
    let dataString = ''

    request.on('data', function (data) {
      dataString += data
    })

    console.log(dataString);

    request.on('end', function () {
      let data = dataString


      index = characterData.findIndex(item =>
        item.name === data);

      if (index > -1) {
        characterData.splice(index, 1);
      }
      console.log(characterData);
      response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
      response.end(JSON.stringify(characterData));
    })
})


//post functions

app.post('/timelineData', (request, response) => {
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', function () {

    let value = JSON.parse(dataString);
    timelineData.push(value)
    SortTimeline()

    RecheckCharacters()

    response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(timelineData))
  })

})

app.post('/characterData', (request, response) => {
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', function () {

    let value = JSON.parse(dataString);

    let character = AssignEra(value)
    characterData.push(character);
    RecheckCharacters();


    response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(characterData))
  })

})

app.post('/', (request, response) =>{
  response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
  response.end('test')
})

//modify functions


app.post('/modifyTimelineData', (request, response) => {
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', function () {

    const firstSpaceIndex = dataString.indexOf(' ');
    const index = dataString.slice(0, firstSpaceIndex);
    const json = JSON.parse(dataString.slice(firstSpaceIndex + 1));

    timelineData[index].era = json.era;
    timelineData[index].date = json.date;
    timelineData[index].description = json.description;


    SortTimeline()
    RecheckCharacters()

    response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(timelineData))
  })

})

app.post('/modifyCharacterData', (request, response) =>{
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', function () {
    const firstSpaceIndex = dataString.indexOf(' ');
    const index = dataString.slice(0, firstSpaceIndex);
    const json = JSON.parse(dataString.slice(firstSpaceIndex + 1));

    characterData[index].name = json.name;
    characterData[index].start = json.start;
    characterData[index].end = json.end;
    characterData[index].era = json.era;

    RecheckCharacters()

    response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(characterData))
   
  })

})






//passed a json object with date and era, assigns era based on given timeline info, returns new json object

function RecheckCharacters() {
  for (let i = 0; i < characterData.length; i++) {
    AssignEra(characterData[i]);
  }
}

function AssignEra(value) {
  value.era = "unknown"

  if (timelineData.length === 0) {
    return;
  }
  for (let i = 0; i < timelineData.length - 1; i++) {
    //check if incoming character is contained in each age
    let total = value.end - value.start;
    if ((value.start >= timelineData[i].date && value.start <= timelineData[i + 1].date - 1) || (timelineData[i].date >= value.start && timelineData[i + 1].date - 1 <= value.end) || (value.end >= timelineData[i].date && value.end <= timelineData[i + 1].date - 1)) {
      if (value.era === "unknown") {
        value.era = "";
        value.era += timelineData[i].era;
      } else {
        value.era += ", " + timelineData[i].era;
      }
    }
  }

  if ((value.start >= timelineData[timelineData.length - 1].date) || (value.end >= timelineData[timelineData.length - 1].date)) {
    if (value.era === "unknown") {
      value.era = "";
      value.era += timelineData[timelineData.length - 1].era;
    } else {
      value.era += ", " + timelineData[timelineData.length - 1].era;
    }
  }
  return value;
}

//sorts timeline by date
function SortTimeline() {
  timelineData.sort(function (a, b) {
    return a.date - b.date;
  })
}

app.listen(process.env.PORT || port, () => console.log("server running"));
