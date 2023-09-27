const http = require( 'http' ),
      fs   = require( 'fs' ),
      express = require('express'),
      cookie = require('cookie-session'),
      dotenv = require("dotenv"),
      { MongoClient, ObjectId } = require("mongodb"),
      axios = require('axios'),
      { Octokit } = require("octokit"),
      fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)),
      app = express()

// allows use of environment variables
dotenv.config()

var accessToken = "";

// Functions for validating and setting up data
const validate = (data, id) => {
  const error = {
    errors: false
  }
  if(!Object.hasOwn(data, 'name') || !(data.name.length > 0) ) {
    error['className' + id] = "Name required"
    error.errors = true
  }
  if(!Object.hasOwn(data, 'start') || !(data.start.length > 0) ) {
    error['startTime' + id] = "Start Time required"
    error.errors = true
  }
  if(!(data.end.length > 0) ) {
    error['endTime' + id] = "End Time required"
    error.errors = true
  }

  const start = data.start.split(':')
  const end = data.end.split(':')
  // console.log('times: ' + start + " " + end)
  if(start[0] > end[0]) {
    error['startTime' + id] = "Start Time must be before End Time"
    error.errors = true
  } else if (start[0] == end[0] && start[1] > end[1]) {
    error['startTime' + id] = "Start Time must be before End Time"
    error.errors = true
  }

  if(!validateDays(data)) {
    error['days' + id] = "Must select at least one day"
    error.errors = true
  }

  return error;
}

const validateDays = data => {
  return Object.hasOwn(data, 'monday') || Object.hasOwn(data, 'tuesday') || 
          Object.hasOwn(data, 'wednesday') || Object.hasOwn(data, 'thursday') || 
          Object.hasOwn(data, 'friday') || Object.hasOwn(data, 'saturday') || 
          Object.hasOwn(data, 'sunday');
}

const calcDerivedLength = (start, end) => {
  // calculate the derived field (length of class)
  const s = new Date('1970-01-01T' + start + ":00")
  const e = new Date('1970-01-01T' + end + ":00")
  const msPerHour = 1000 * 60 * 60
  return Math.round(((e-s) / msPerHour) * 100) / 100
}

// express/cookie set up

// use express.urlencoded to get data sent by default form actions
// or GET requests
app.use( express.urlencoded({ extended: true }) )

// public directory
app.use(express.static('./public'))
app.use(express.json())

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  sameSite: 'none',
  keys: ['key1', 'key2']
}))

let collections = {
  users: null,
  schedules: null,
  classes: null,
  errors: null,
}

// Database Connection
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.yrccoan.mongodb.net`
const client = new MongoClient( uri )

async function run() {
  await client.connect()
  collections.users = await client.db("schedules").collection('users')
  collections.schedules = await client.db("schedules").collection('schedules')
  collections.classes = await client.db("schedules").collection('classes')
  collections.errors = await client.db("schedules").collection('errors')
}
run()

// GETs and POSTs that do not go through the middleware

app.get('/data', async (request, response) => {
  
  let data = {
    username: "",
    schedules: [],
    error: {}
  }

  // get the username of the logged in user
  data.username = request.session.user;

  if(!!data.username) {
    // get the classes of the logged in user
    const result = await collections.users.find({'username': `${request.session.user}`}).toArray() // get the user
      .then( async current_user => {
        const result2 = await collections.schedules.find({ _id : new ObjectId(current_user[0].schedules[0]) }).toArray() // get the schedules of the user
          .then( async current_schedule => {
            const classes = []
            let i;
            for(i = 0; i < current_schedule[0].classes.length; i++) {
              const a_class = await collections.classes.find({'_id' : new ObjectId(current_schedule[0].classes[i]) }).toArray()
              .then( async a => {
                return a[0]
              })
              classes.push(a_class)
            } 
            return classes;
          })
          return result2;
        })

    data.schedules = result
  }

  // get the errors
  data.error = request.session.errors

  // send the data
  response.json(data)
});

app.post('/login', async (request, response) => {
  
  // check if the username matches a username in the database
  let match = await collections.users.find({'username': `${request.body.username}`}).toArray()
  if( match.length > 0 ) { // TODO
    // check if the password matches
    if(request.body.password === match[0].password) { // TODO
      // request.session.login == true
      request.session.login = true
      request.session.user = request.body.username
      response.redirect("/main.html") // check this out
    } else {
      // password incorrect, redirect back to login page
      response.sendFile( __dirname + '/public/index.html' )
    }
  } else {
    // password incorrect, redirect back to login page
    response.sendFile( __dirname + '/public/index.html' )
  }
})

// GitHub Auth
app.get("/auth", (request, response) => {
  // Store parameters in an object
  const params = {
    scope: "read:user",
    client_id: process.env.CLIENT_ID,
  }
 
  // Convert parameters to a URL-encoded string
  const urlEncodedParams = new URLSearchParams(params).toString()
  response.redirect(`https://github.com/login/oauth/authorize?${urlEncodedParams}`)
})

app.get("/github-callback", (request, response) => {
  const { code } = request.query;
 
  const body = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code,
  };

  const options = { headers: { accept: "application/json" } };
 
  axios
    .post("https://github.com/login/oauth/access_token", body, options)
    .then((res) => res.data.access_token)
    .then((token) => {
      accessToken = token
      console.log('token: ' + token)
      response.redirect('/success')
    })
    .catch((err) => response.status(500).json({ err: err.message }))
});

app.get('/success', function (request, response) {
  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + accessToken
    }
  }).then(async (res) => {
    // check if the user already exists
    let match = await collections.users.find({'username': `${request.data.login}`}).toArray()
    if(!!match) { // user does exist
      // log the user in
      request.session.login = true
      request.session.user = res.data.login
    } else { // user does not exist -> create their account
      const schedule = await collections.users.insertOne({})
        .then(async (schedule_result) => {
          let result = await collections.users.insertOne({
            username: res.data.login,
            schdules: [new ObjectId(schdules.result.insertedId)]
          })
          console.log('inserted new user: ' + JSON.stringify(result))
        })
    }

    response.redirect(`/main.html`)
  })

})

// middleware for database checking and login checking
app.use( (request,response,next) => {
  console.log("in middleware")
  if( collections !== false ) {
    if (request.session.login === true ) {
      next()
    } else {
      console.log(JSON.stringify(request.url))
      response.redirect('/index.html')
    }
  }else{
    response.status( 503 ).send()
  }
})

// POST requests that must go through the middleware

app.post('/logout', (request, response) => {
  request.session.login = false;
  request.session.user = null;
  response.sendFile(__dirname + '/public/index.html')
})

app.post('/add', async (request, response) => {
  
  // check has name, start time, end time, and 1 day associated
  const error = validate(request.body, '');

  // TODO: check no repeats

  if(error.errors === false) { // no errors

    // calculate the derived field (length of class)
    request.body.duration = calcDerivedLength(request.body.start, request.body.end)

    // add to the server data
    const newClass = await collections.classes.insertOne( request.body )
    const schedule = await collections.users.find({'username': `${request.session.user}`}).toArray()
      .then(async current_user => {
        const result = await collections.schedules.updateOne(
          { _id: current_user[0].schedules[0]  }, 
          { $push: {'classes': newClass.insertedId } }) // gets the first schedule every time
      })
  }

  // set errors
  request.session.errors = error;

  response.redirect('/main.html')
})

app.post('/remove', async (request, response ) => {
      // get the class to remove id
      if(!request.body.hasOwnProperty('selected')) {
        response.redirect('/main.html')
        return;
      }
  
      const class_id = new ObjectId(JSON.parse(request.body.selected)._id)
  
      // get the user
      const result = await collections.users.find({'username': `${request.session.user}`}).toArray() // get the user
        .then( async current_user => {    // remove the class from the user's schedule
          const result2 = await collections.schedules.updateOne(  { _id : new ObjectId(current_user[0].schedules[0]) }, 
                                                                  {$pull: { classes: { $eq: class_id }}}) // remove the class from the schedule
        })
  
      // remove the class from classes
      const result2 = await collections.classes.deleteOne({_id:  new ObjectId(class_id)})
  
      // set errors
      request.session.errors = {errors: false}
  
      response.redirect('/main.html')
})

app.post('/update', async (request, response ) => {
  if(!request.body.hasOwnProperty('previous')) {
    response.redirect('/main.html')
    return;
  }

  prev = JSON.parse(request.body.previous)
  data = request.body
  delete data.previous

  let error

  if(prev === "") { // no classes to modify
    error = {
      'errors': true,
      'classModifySelect': "No Classes To Modify",
    }
  } else {
    // validate the new values
    error = validate(data, '2');

    if(error.errors === false) {
      // find the data to modify

      const schedule = await collections.users.find({'username': `${request.session.user}`}).toArray()
      .then(async current_user => {
        // delete the old class from the schedule
        const result2 = await collections.schedules.updateOne(  { _id : new ObjectId(current_user[0].schedules[0]) }, 
                                                                {$pull: { classes: { $eq: new ObjectId(prev._id) } } } ) // remove the class from the schedule

        // delete the old class
        const result3 = await collections.classes.deleteOne({_id:  new ObjectId(prev._id)})

        // add the new class
        data.duration = calcDerivedLength(data.start, data.end);
        const newClass = await collections.classes.insertOne( data )

        // add the new class to the schedule
        const schedule2 = await collections.users.find({'username': `${request.session.user}`}).toArray()
          .then(async current_user => {
            const result4 = await collections.schedules.updateOne(
              { _id: current_user[0].schedules[0]  }, 
              { $push: {'classes': newClass.insertedId } }) // gets the first schedule every time
          })
      })
    }
  }

  request.session.errors = error    

  response.redirect('/main.html')
})

// set up the server
app.listen(`${process.env.PORT}`)