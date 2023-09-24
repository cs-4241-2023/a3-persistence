const http = require( 'http' ),
      fs   = require( 'fs' ),
      express = require('express'),
      cookie = require('cookie-session'),
      dotenv = require("dotenv"),
      { MongoClient, ObjectId } = require("mongodb"),
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000,
      app = express();

// allows use of environment variables
dotenv.config()

const handleLogin = async function(request, response) {
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
}

const handleAdd = async function(request, response) {

  // check has name, start time, end time, and 1 day associated
  const error = validate(request.body);

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
    // response.json(result)

  } else { // set error flags
    let result = await collections.errors.deleteOne( {} )
    result = await collections.errors.insertOne(error)
  }

  response.redirect('/main.html')
}

const handleRemove = async function(request, response) {
      
    // find the data to remove
    
    // get the user
    const result = await collections.users.find({'username': `${request.session.user}`}).toArray() // get the user
      .then( async current_user => {    // remove the class from the user's schedule
        const class_id = new ObjectId(JSON.parse(request.body.selected)._id)
        const result2 = await collections.schedules.updateOne(  { _id : new ObjectId(current_user[0].schedules[0]) }, 
                                                                {$pull: { classes: { $eq: class_id }}}) // remove the class from the schedule
      })

    // remove the class from classes
    const result2 = await collections.classes.deleteOne({_id:  new ObjectId(request.body.selected._id)})

    response.redirect('/main.html')
}

const handleModify = async function(request, response) {

  prev = JSON.parse(request.body.previous)
  data = request.body
  delete data.previous

  console.log('prev: ' + JSON.stringify(prev))
  console.log('data: ' + JSON.stringify(data))

  if(prev === "") { // no classes to modify
    const error = {
      'errors': true,
      'classModifySelect': "No Classes To Modify",
    }
    let result = await collections.errors.deleteOne( {} )
    result = await collections.errors.insertOne(error)
  } else {
    // validate the new values
    const error = validate(data);

    if(error.errors === false) {
      // find the data to modify

      // const schedule = await collections.users.find({'username': `${request.session.user}`}).toArray()
      // .then(async current_user => {
      //   // delete the old class from the schedule
      //   const result2 = await collections.schedules.updateOne(  { _id : new ObjectId(current_user[0].schedules[0]) }, 
      //                                                           {$pull: { classes: { $eq: prev._id }}}) // remove the class from the schedule
      //   // delete the old class
      //   const result3 = await collections.classes.deleteOne({_id:  new ObjectId(prev._id)})

      //   // add the new class
      //   data.duration = calcDerivedLength(data.start, data.end);
      //   const newClass = await collections.classes.insertOne( data )

      //   // add the new class to the schedule
      //   const schedule2 = await collections.users.find({'username': `${request.session.user}`}).toArray()
      //     .then(async current_user => {
      //       const result4 = await collections.schedules.updateOne(
      //         { _id: current_user[0].schedules[0]  }, 
      //         { $push: {'classes': newClass.insertedId } }) // gets the first schedule every time
      //     })
      // })
    } else { // send back error message
      let result = await collections.errors.deleteOne( {} )
      result = await collections.errors.insertOne(error)
    }        
  }
}

const handleGetAll = async function(request, response) {

  let data = {
    username: "",
    schedules: []
  }

  data.username = request.session.user;
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
  response.json(data)
  
}


const validate = data => {
error = {
  errors: false,
  name: true,
  start: true,
  end: true,
  days:  true
}
if(!Object.hasOwn(data, 'name') || !(data.name.length > 0) ) {
  error.className = "Name required"
  error.errors = true
}
if(!Object.hasOwn(data, 'start') || !(data.start.length > 0) ) {
  error.start = "Start Time required"
  error.errors = true
}
if(!(data.end.length > 0) ) {
  error.end = "End Time required"
  error.errors = true
}

const start = data.start.split(':')
const end = data.start.split(':')
if(start[0] > end[0]) {
  error.start = "Start Time must be before End Time"
  error.errors = true
} else if (start[0] == end[0] && start[1] > end[1]) {
  error.start = "Start Time must be before End Time"
  error.errors = true
}

if(!validateDays(data)) {
  error.days = "Must select at least one day"
  error.errors = true
}

return error;
};

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

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

    // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

// express set up

// cookie set up

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
  keys: ['key1', 'key2']
}))

let collections = {
  users: null,
  schedules: null,
  classes: null,
  errors: null,
}

// Database Connection
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

async function run() {
  await client.connect()
  collections.users = await client.db("schedules").collection('users')
  collections.schedules = await client.db("schedules").collection('schedules')
  collections.classes = await client.db("schedules").collection('classes')
  collections.errors = await client.db("schedules").collection('errors')
}
run()

// route to get all docs
app.get("/docs", async (request, response) => {
  if (db !== null) {
    const docs = await collections.find({}).toArray()
    response.json( docs )
  }
})

// middleware
app.use( (request,response,next) => {
  if( collections !== false ) {
    next()
  }else{
    response.status( 503 ).send()
  }
})

// set up GET and POST requests

// GET requests
app.get('/', function (request, response) {
  console.log('getting index.html')
  response.sendFile( __dirname + '/public/index.html' )
})

app.get('/main', function (request, response) {
  console.log('getting main.html')
  response.sendFile( __dirname + '/public/main.html' )
})

// POST requests
app.post('/login', handleLogin)

app.use( function( request, response, next ) {
  if (request.session.login === true ) {
    next()
  } else {
    console.log('session not logged in')
    response.sendFile(__dirname + '/public/index.html')
  }
})

app.post('/add', handleAdd)
app.post('/remove', handleRemove)
app.post('/update', handleModify)

app.get('/data', handleGetAll);

// set up the server
app.listen(3000)