const express = require('express'),
      app = express(),
      port = 3000

const appdata = [
  { 'frags': 24, 'assists': 2, 'deaths': 7, 'kd': 3.43 },
  { 'frags': 12, 'assists': 5, 'deaths': 16, 'kd': 0.75 },
  { 'frags': 15, 'assists': 3, 'deaths': 12, 'kd': 1.25 }
]

app.use(express.static('public'));
app.use(express.static('public/css'));
app.use(express.static('public/js'));
app.use(express.json());

app.get('/getTable', (request, response) => {
  response.writeHead(200, {'Content-Type': 'application/json'});
  response.end(JSON.stringify(appdata));
})

app.post('/submit', (request, response) => {
  const body = request.body
  const kd = (parseInt(body.deaths) === 0) ? body.frags : (body.frags / body.deaths).toFixed(2);
  body['kd'] = parseFloat(kd);
  appdata.push(body);
  response.writeHead(200, {'Content-Type': 'application/json'});
  response.end(JSON.stringify(appdata));
})

app.post('/deleteData', (request, response) => {
  const newData = request.body;
  appdata.splice(appdata.findIndex(element => {
    let frags = element.frags === newData.frags;
    let assists = element.assists === newData.assists;
    let deaths = element.deaths === newData.deaths;
    let kd = element.kd === newData.kd;
    return frags && assists && deaths && kd;
  }), 1);
  response.writeHead(200, {'Content-Type': 'application/json'});
  response.end(JSON.stringify(appdata));
})

app.post('/modifyData', (request, response) => {
  const newData = request.body;
  let index = appdata.findIndex(element => {
    let frags = element.frags === newData.obj.frags;
    let assists = element.assists === newData.obj.assists;
    let deaths = element.deaths === newData.obj.deaths;
    let kd = element.kd === newData.obj.kd;
    return frags && assists && deaths && kd;
  });
  const kd = (parseInt(newData.newObj.deaths) === 0) ? newData.newObj.frags : (newData.newObj.frags / newData.newObj.deaths).toFixed(2);
  newData.newObj['kd'] = parseFloat(kd);
  appdata[index] = newData.newObj;
  response.writeHead(200, {'Content-Type': 'application/json'});
  response.end(JSON.stringify(appdata));
})

app.listen(process.env.PORT || port);