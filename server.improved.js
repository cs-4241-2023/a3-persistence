const express = require('express'),
  cookie = require('cookie-session'),
  app = express(),
  port = 3000,
  { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()

app.use(express.static('public'))
app.use(express.static('public/css'))
app.use(express.static('public/js'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookie({
  name: 'session',
  keys: ['jn2398y43hn', 'nfjadkln2345']
}))

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri)

let tableCollection = null
let infoCollection = null
let usersCollection = null

const hoursTilGrade = [{ "A": 28 }, { "B": 24 }, { "C": 21 }]
/*
let hoursTilGoal = 0
let currentGoal = ''
*/

async function run() {
  await client.connect()
  tableCollection = await client.db("dataTest").collection("tableData")
  infoCollection = await client.db("dataTest").collection("infoData")
  usersCollection = await client.db("dataTest").collection("userData")
}

run()

app.get('/main.html', (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
})


app.use((req, res, next) => {
  if (infoCollection !== null && usersCollection !== null) {
    next()
  } else {
    res.status(503).send()
  }
})

app.post('/register', async (req,res) => {
  let userFound = await usersCollection.find({username: req.body.username}).toArray()
  if(userFound.length === 0){

    await usersCollection.insertOne(req.body)

    req.session.login = true
    req.session.username = req.body.username
    res.redirect('main.html')
  } else {
    res.sendFile(__dirname + '/public/index.html')
  }
})
app.post('/login', async (req, res) => {
  console.log(req.body)

  const user = await usersCollection.find({username: req.body.username}).toArray();

  //if the user is found
  if(user[0].username === req.body.username && user[0].password === req.body.password){
    req.session.login = true
    req.session.username = req.body.username
    res.redirect('main.html')
  } else {
    res.sendFile(__dirname + '/public/index.html')
  }
})

app.get('/getTable', async (req, res) => {
  if (tableCollection !== null) {
    const appdata = await collection.find({username: req.body.username}).toArray();
    res.json(appdata)
  }
})

app.post('/setGoal', async (req, res) => {
  if (infoCollection !== null) {
    const body = req.body
    const currGoal = body.goal

    let hoursTilGoal = 0

    hoursTilGrade.forEach(d => {
      for (let g in d) {
        console.log(g, currGoal)
        if (g === currGoal) {
          hoursTilGoal = d[g]
        }
      }
    })

    body['current_goal'] = currGoal
    body['hours_til_goal'] = hoursTilGoal
    body['username'] = req.session.username

    await infoCollection.insertOne(body)

    const appdata = await infoCollection.find({username: req.session.username}).toArray()
    res.json(appdata)
  }
})

app.post('/editGoal', async (req, res) => {
  if (infoCollection !== null) {
    body = req.body
    const newGoal = req.body.goal
    console.log(newGoal)
    //const newGoal = body.newGoal

    let newGoalNum = 0
    let differenceToChange = 0

    let infoCollect = await infoCollection.find({username: req.session.username}).toArray()
    console.log(infoCollect[0], newGoal)
    let currentGoal = infoCollect[0].goal
    let hoursTilGoal = infoCollect[0].hours_til_goal

    if (newGoal !== currentGoal) {

      hoursTilGrade.forEach(d => {
        for (let g in d) {
          if (g === newGoal) {
            newGoalNum = d[g]
            console.log(newGoalNum, d[g])
            differenceToChange = newGoalNum - hoursTilGoal
          }
        }
      })

      console.log(differenceToChange)

      let hoursTilGoaNew = hoursTilGoal + differenceToChange

      await infoCollection.updateOne(
        {_id: new ObjectId(infoCollect[0]._id)},
        { $set: {current_goal: newGoal, goal: newGoal, hours_til_goal: hoursTilGoaNew} }
      )

      const appdata = await tableCollection.find({username: req.session.username}).toArray()

      //go thru and edit all of the remianings
      for(let d of appdata) {
        let newVal = d.remaining + differenceToChange
        console.log(newVal)
        await tableCollection.updateOne(
          { _id: new ObjectId(d._id) },
          { $set: { remaining: newVal } }
        )
      }
    }
    

    appdata = await tableCollection.find({username: req.session.username}).toArray()
    res.json({ newGoal, appdata })
  }

})


app.post('/deleteEntry', async (req, res) => {
  if (tableCollection !== null) {
    const indexObj = req.body
    const index = indexObj.idx

    console.log(indexObj, index)

    //need to edit all entries after the index
    let appdata = await tableCollection.find({username: req.session.username}).toArray()
    let differenceToChange = parseFloat(appdata[index].hours)

    let element = appdata[index]

    for (let i = index; i < appdata.length; i++) {

      let newRemaining = appdata[i].remaining + differenceToChange

      await tableCollection.updateOne(
        {_id: new ObjectId(appdata[i]._id)},
        { $set: { remaining: newRemaining }}
      )
     // appdata[i].remaining += differenceToChange
    }
    

    await tableCollection.deleteOne({
      _id: new ObjectId(element._id)
    })

    appdata = await tableCollection.find({username: req.session.username}).toArray()

    res.json(appdata)
  }
})

app.post('/addHours', async (req, res) => {
  if (tableCollection !== null) {
    const body = req.body
    //console.log("body: ", body)
    //const currentData = body.currentData

    let hoursTilGoal = 0

    if (infoCollection !== null) {
      table = await tableCollection.find({username: req.session.username}).toArray()

      if(table.length > 0){
        hoursTilGoal = table[table.length - 1].remaining
      } else {
        collect = await infoCollection.find({username: req.session.username}).toArray()
        //console.log(collect)
        console.log(collect[collect.length - 1].hours_til_goal)
        hoursTilGoal = collect[collect.length - 1].hours_til_goal
      }
    }

    body['remaining'] = hoursTilGoal - body.hours
    body['username'] = req.session.username

    await tableCollection.insertOne(body)
    const appdata = await tableCollection.find({username: req.session.username}).toArray()
    console.log(appdata)
    res.json(appdata)
  }
})


app.listen(process.env.PORT || port)
