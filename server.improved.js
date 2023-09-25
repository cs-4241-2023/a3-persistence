const express = require('express'),
  cookie = require('cookie-session'),
  hbs = require('express-handlebars').engine,
  app = express(),
  port = 3000,
  { MongoClient, ObjectId } = require('mongodb');
  require('dotenv').config();

app.use(express.static('public'))
app.use(express.static('public/css'))
app.use(express.static('public/js'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.engine('handlebars', hbs())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(cookie({
  name: 'session',
  keys: ['jn2398y43hn', 'nfjadkln2345']
}))

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
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

app.use((req, res, next) => {
  if (tableCollection !== null && infoCollection !== null && usersCollection !== null) {
    next()
  } else {
    res.status(503).send()
  }
})

app.get('/', (req,res) => {
  res.render('index', {msg: '', layout: false})
})

app.get('/main.html', (req, res) => {
  res.render('main', {msg: '', layout: false})
})

app.get('/editHours.html', (req,res) => {
  res.render('editHours', {msg: '', layout: false})
})

app.get('/getGradeProgress', async (req, res) => {
  if(infoCollection !== null) {
    let infoCollect = await infoCollection.find({username: req.session.username}).toArray()
    //if theres actually info send it
    if(infoCollect.length > 0){
      let userGrade = infoCollect[0].current_goal
      let timeLeft = infoCollect[0].hours_til_goal

      let appdata = await tableCollection.find({username: req.session.username}).toArray()

      if(appdata.length > 0){
        timeLeft = appdata[appdata.length - 1].remaining
      }

      res.json({userGrade, timeLeft})
    } else {
      res.json(infoCollect)
    }
  }
})

app.get('/displayGrade', async (req,res) => {
  if(infoCollection !== null) {
    let infoCollect = await infoCollection.find({username: req.session.username}).toArray()

    if(infoCollect.length > 0){
      let userGrade = infoCollect[0].current_goal

      res.json(userGrade)
    } else {
      res.json(infoCollect)
    }
  }
})

app.get('/getTable', async (req, res) => {
  if (tableCollection !== null) {
    const appdata = await tableCollection.find({username: req.session.username}).toArray();
    res.json(appdata) 
  }
})

app.post('/badmintonDashboard', async (req,res) => {
  if (infoCollection !== null){
    const appdata = await tableCollection.find({username: req.session.username}).toArray()
    const currGoal = await infoCollection.find({username: req.session.username}).toArray()

    res.redirect('editHours.html')
  } else {
    res.render('main', {msg: 'Unable to navigate', layout: false})
  }
})

app.post('/register', async (req,res) => {
  if(req.body.username.length === 0){
    res.render('index', {msg: 'Register Failed: username must contain at least one character', layout: false})
  } else {
    let userFound = await usersCollection.find({username: req.body.username}).toArray()
    if(userFound.length === 0){
  
      //check if password is valid
      if(req.body.password.length > 0){
        await usersCollection.insertOne(req.body)
  
        req.session.login = true
        req.session.username = req.body.username
        res.redirect('main.html')
      } else {
        res.render('index', {msg: 'Register Failed: password contain at least one character', layout: false})
      }
  
    } else {
      res.render('index', {msg: 'Register Failed: username already registered', layout: false})
    }
  }
})

app.post('/login', async (req, res) => {
  const user = await usersCollection.find({username: req.body.username}).toArray();

  //if the user is found
  if(user.length > 0){
    if(user[0].username === req.body.username && user[0].password === req.body.password){
      req.session.login = true
      req.session.username = req.body.username
      res.redirect('main.html')
    } else {
      res.render('index', {msg: 'Login failed: incorrect password for this username!', layout: false})
    }
  }
   else {
    res.render('index', {msg: 'Login failed: username entered not found. Check the username you entered is correct or register a new account!', layout: false})
  }
})


app.post('/setGoal', async (req, res) => {
  if (infoCollection !== null) {
    const body = req.body
    const currGoal = body.goal

    let hoursTilGoal = 0

    hoursTilGrade.forEach(d => {
      for (let g in d) {
        if (g === currGoal) {
          hoursTilGoal = d[g]
          break
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

    let newGoalNum = 0
    let differenceToChange = 0

    let infoCollect = await infoCollection.find({username: req.session.username}).toArray()
    let currentGoal = infoCollect[0].goal
    let hoursTilGoal = infoCollect[0].hours_til_goal

    if (newGoal !== currentGoal) {

      hoursTilGrade.forEach(d => {
        for (let g in d) {
          if (g === newGoal) {
            newGoalNum = d[g]
            differenceToChange = newGoalNum - hoursTilGoal
            break
          }
        }
      })

      let hoursTilGoaNew = hoursTilGoal + differenceToChange

      await infoCollection.updateOne(
        {_id: new ObjectId(infoCollect[0]._id)},
        { $set: {current_goal: newGoal, goal: newGoal, hours_til_goal: hoursTilGoaNew} }
      )

      const appdata = await tableCollection.find({username: req.session.username}).toArray()

      //go thru and edit all of the remianings
      
      for(let d of appdata) {
        let newVal = d.remaining + differenceToChange
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

    let hoursTilGoal = 0

    if (infoCollection !== null) {
      table = await tableCollection.find({username: req.session.username}).toArray()

      if(table.length > 0){
        hoursTilGoal = table[table.length - 1].remaining
      } else {
        collect = await infoCollection.find({username: req.session.username}).toArray()
        hoursTilGoal = collect[collect.length - 1].hours_til_goal
      }
    }

    body['remaining'] = hoursTilGoal - body.hours
    body['username'] = req.session.username

    await tableCollection.insertOne(body)
    const appdata = await tableCollection.find({username: req.session.username}).toArray()
    res.json(appdata)
  }
})


app.listen(port)
