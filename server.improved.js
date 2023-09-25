const express = require('express'),
      { MongoClient, ObjectId } = require('mongodb');
      app = express(),
      cookie = require('cookie-session'),
      hbs = require('express-handlebars').engine,
      port = 3000;
      require('dotenv').config();

app.use(express.urlencoded({extended: true}));
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(cookie({
  name: 'session',
  keys: ['XZUkRnYY6IWmJq8c', 'KtOST5S36ohSnmQt', 'XbcvQDdYerNE2b9c', 'fFFQqAssXRuf8NCf', 'px31P6BxfAfhTLjs']
}));
app.use(express.static('public'));
app.use(express.static('public/css'));
app.use(express.static('public/js'));
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

let appCollection = null;
let credentialsCollection = null;

async function run() {
  await client.connect();
  appCollection = await client.db("appdata").collection("appdata");
  credentialsCollection = await client.db("appdata").collection("credentials");
}
run();

app.use((request, response, next) => {
  if (appCollection !== null && credentialsCollection !== null) {
    next();
  } else {
    response.status(503).send();
  }
});

app.get('/', (request, response) => {
  response.render('index', {msg: '', layout: false});
});

app.post('/login', async (request, response) => {
  let user = await credentialsCollection.find({username: request.body.username}).toArray();
  if (user.length === 0) {
    request.session.login = false;
    response.render('index', {msg: 'Login failed: username does not exist, please register username or try another.', layout: false});
  } else if (user[0].username === request.body.username && user[0].password === request.body.password) {
    request.session.login = true;
    request.session.username = request.body.username;
    response.redirect('main.html');
  } else {
    request.session.login = false;
    response.render('index', {msg: 'Login failed: incorrect password.', layout: false});
  }
});

app.post('/register', async (request, response) => {
  let user = await credentialsCollection.find({username: request.body.username}).toArray();
  if (user.length !== 0) {
    request.session.login = false;
    response.render('index', {msg: 'Register failed: username already exists.', layout: false});
  } else {
    request.session.login = true;
    request.session.username = request.body.username;
    await credentialsCollection.insertOne({username: request.body.username, password: request.body.password});
    response.redirect('main.html');
  }
});

app.use((request, response, next) => {
  if (request.session.login === true) {
    next();
  } else {
    response.render('index', {msg: 'login failed, please try again', layout: false});
  }
});

app.get('/main.html', (request, response) => {
  response.render('main', {layout: false});
})

app.get('/getTable', async (request, response) => {
  if (appCollection !== null) {
    const appdata = await appCollection.find({username: request.session.username}).toArray(); 
    response.json(appdata);
  }
});

app.post('/submit', async (request, response) => {
  if (appCollection !== null) {
    const body = request.body
    const kd = (parseInt(body.deaths) === 0) ? parseInt(body.frags) : (body.frags / body.deaths).toFixed(2);
    body['kd'] = parseFloat(kd);
    body['username'] = request.session.username;
    await appCollection.insertOne(body);
    const appdata = await appCollection.find({username: request.session.username}).toArray();
    response.json(appdata);
  }
});

app.post('/deleteData', async (request, response) => {
  if (appCollection !== null) {
    await appCollection.deleteOne({
      _id: new ObjectId(request.body._id)
    });
    const appdata = await appCollection.find({username: request.session.username}).toArray();
    response.json(appdata);
  }
});

app.post('/modifyData', async (request, response) => {
  if (appCollection !== null) {
    const body = request.body;
    const kd = (parseInt(body.newObj.deaths) === 0) ? parseInt(body.newObj.frags) : (body.newObj.frags / body.newObj.deaths).toFixed(2);
    body.newObj['kd'] = parseFloat(kd);
    await appCollection.updateOne(
      {_id: new ObjectId(body.obj._id)},
      {$set: {frags: body.newObj.frags, assists: body.newObj.assists, deaths: body.newObj.deaths, kd: kd}}
    );
    const appdata = await appCollection.find({username: request.session.username}).toArray();
    response.json(appdata);
  }
});

app.listen(port);