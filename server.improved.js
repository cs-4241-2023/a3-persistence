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

const handleLogin = function(request, response) {
  // check if the username matches a username in the database
  if( request.body.username == 'test' ) { // TODO
    // check if the password matches
    if(request.body.password == 'test') { // TODO
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
          .then(async _ => {})
      })
    // response.json(result)

  } else { // set error flags
    const result = await collections.errors.remove( {} )
      .then(async _ => { 
        await collections.errors.insertOne(error)
      })
  }

  response.redirect('/main.html')
}

const handleRemove = function(request, response) {

    json = request.body
      
    // find the data to remove TODO
    let i = 0;
    const max = appdata.length
    for(obj of appdata) {
      if(JSON.stringify(obj) === json) {
          const front = appdata.slice(0, i)
          const back = appdata.slice(i+1)
          const temp = front.concat(back)
          while(appdata.length > 0) {
              appdata.pop()
          }
          for(let j = 0; j < temp.length; j++) {
              appdata.push(temp[j])
          }
          
          response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
          response.end('success')
          console.log('remove - success')
          break
      } else {
          i++
      }
    }

  if(i >= max) {
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end('fail')
      console.log('failed to remove')
  }
}

const handleModify = function(request, response) {

  json = request.body
    
  prev = json.prev
  data = json.new

  if(prev === "") { // no classes to modify
    const error = {
      'errors': true,
      'classModifySelect': "No Classes To Modify",
    }
    // console.log('modify - error: ' + JSON.stringify(error))
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end( JSON.stringify(error) )
  } else {
    // validate the new values
    const error = validate(data);

    if(error.errors === false) {
      // find the data to modify
      let i = 0;
      const max = appdata.length
      for(obj of appdata) {
          if(JSON.stringify(obj) === prev) {

              obj.Name = data.Name
              obj.Code = data.Code
              obj.StartTime = data.StartTime
              obj.EndTime = data.EndTime
              obj.Length = calcDerivedLength(data.StartTime, data.EndTime)
              
              response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
              response.end(JSON.stringify({}))
              console.log('modify - success')
              break
          } else {
              i++
          }
      }
      if(i >= max) {
          response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
          response.end(JSON.stringify(error))
          console.log('failed to modify')
      }
    } else { // send back error message
    //   console.log('modify - error: ' + JSON.stringify(error))
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end( JSON.stringify(error) )
    }        
  }
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
    response.sendFile(__dirname + '/public/index.html')
  }
})


app.post('/add', handleAdd)
app.delete('/remove', handleRemove)
app.post('/modify', handleModify)

// set up the server
app.listen(3000)