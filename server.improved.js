
const appdata = [
  { 'id': 0, 'yourName': 'Bright', 'yourKills': 10, 'yourDeaths': 5, 'yourAssists': 1, 'KDA': 2.2},
  { 'id': 1, 'yourName': 'Nelson', 'yourKills': 20, 'yourDeaths': 50, 'yourAssists': 3, 'KDA': .46 }
]

const express = require('express'),
      app = express(),
      port = 3000

app.use(express.static('public'))
app.use(express.json())


app.get('/start', (req, res) => {
  res.json(appdata)
})

app.post('/delete', (req, res) => {
  let data = req.body
  let fail = true;
  for(let i=0; i < appdata.length; i++){
    if(data.id === appdata[i].id){
      fail = false

      appdata.splice(i, 1) 

      res.status(200).send()
      break
    }
  }
  if(fail){
    res.status(404).send()
  }
})

app.post('/modify', (req, res) => {
  let data = req.body
  let fail = true;
  for(let i=0; i < appdata.length; i++){
    if(data.id === appdata[i].id){
      fail = false

      data.KDA = (data.yourKills + data.yourAssists) / data.yourDeaths

      appdata[i] = data

      res.json(data)
      break
    }
  }
  if(fail){
    res.status(404).send()
  }
})

app.post('/submit', (req, res) => {
  let data = req.body
  // KDA = (kills + assists)/ deaths 
  kills = data.yourKills
  deaths = data.yourDeaths
  assists =  data.yourAssists
  kda = (kills + assists) / deaths
  
  data.KDA = kda

  appdata.push(data)

  res.json(data)
})


app.listen(port, (error) =>{
  if(!error){
    console.log("Server is Successfully Running, and App is listening on port", port);
  }else{
    console.log("Error occurred, server can't start", error);
  }
});
