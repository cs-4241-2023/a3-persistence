const express = require('express'),
      cookie = require('cookie-session'),
      hbs = require('express-handlebars').engine,
      app = express();
require("dotenv").config(); 

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))
const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');
const uri = process.env.HOST;
let currUser;
//const client = new MongoClient(uri);
//app.engine( 'handlebars',  hbs() )
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: "views/layouts/"
  })
);
app.set(    'view engine', 'handlebars' )
app.set(    'views',       './public' )

mongoose.connect(
  uri, 
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
);

const loginSchema = new mongoose.Schema({
  username: {type: String, min: 10, max: 30, required: true},
  password: {type: String, min: 5, max: 30, required: true}
});

const Login = mongoose.model('Login', loginSchema);

const creatureSchema = new mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  age: {type: Number, required: true},
  owner: {type: mongoose.Types.ObjectId, ref: 'Login'},
  picture: String,
  status: String
});
const Creature = mongoose.model('Creature', creatureSchema);

const avgAges = {"Chameleon": 7, "Gecko": 7,
                 "Frog": 10, "Snake": 15,
                 "Cat": 13, "Dog": 12,
                 "Rat": 2, "Capybara": 6,}
const maxAges = {"Chameleon": 16, "Gecko": 20,
                 "Frog": 20, "Snake": 30,
                 "Cat": 20, "Dog": 15,
                 "Rat": 4, "Capybara": 12,}
const creaturePics = {"Chameleon": 'https://lafeber.com/vet/wp-content/uploads/Veiled-chameleon-by-Mrs-Logic-cropped-square.jpg', 
                      "Gecko": 'https://reptile.guide/wp-content/uploads/2021/03/Leopardengecko-eublepharis-macularius.jpg',
                      "Frog": 'https://www.sonova.com/sites/default/files/styles/header_image_tablet/public/2019-07/shutterstock_253580635_square.jpg?itok=TwBeTHTY', 
                      "Snake": 'https://static.wixstatic.com/media/a96e12_2bfd46ea53944c979c805a5a50327cb9~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
                      "Cat": 'https://media.discordapp.net/attachments/1149381126847201290/1149489057265623211/PXL_20230902_231104485.jpg?width=443&height=468', 
                      "Dog": 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
                      "Rat": 'https://images.squarespace-cdn.com/content/v1/55801f1be4b0bd4b73b60d65/1449930415127-EU3SDWQQMOO6LV0Y0QJF/rat+square.jpg', 
                      "Capybara": 'https://gvzoo.com/cms-data/gallery/blog/animals/capybara/banner-capybara-sq.jpg',}

app.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

app.use('/request-type', (req, res, next) => {
  console.log('Request type: ', req.method);
  next();
});

//app.use(express.static('index'));
app.use( express.json() );
//app.use('/public', serveIndex('public'));

app.get('/', (req, res) => {
  console.log('get main')
  res.render('views/layouts/index.hbs')
})

app.post('/submit', (req, res, next) => {
    //add stuff to handle submit of data
  
    const json = { username: req.body.user,
      password: req.body.pass}

    console.log(json)
    Login.findOne({username: json.username, password: json.password}, {}).then (function (result, err) {
      if(result){
        currUser = result._id;
        console.log(currUser)
        req.session.login = true;
        console.log(result)
        console.log('success')
        //res.render('layouts/creatureMaker.handlebars')
        res.redirect('creatureMaker')
      }else{
        console.log('fail')
        console.log(err)
        res.render('views/layouts/index.hbs',{msg: 'login failed'})
        //res.redirect('/')
      }
      
  })
    //next();
});

app.get('/createAccount', (req, res) => {
  console.log('get create account')
  res.render('views/layouts/createAccount.hbs', req.body)
})

app.post('/saveAcc', (req, res) => {
  const acc = new Login({
    username: req.body.user,
    password: req.body.pass
  })
  Login.findOne({username: acc.username}).then(function (result, err) {
    if(result){
      //username is taken
      console.log('username in use')
      res.render('views/layouts/createAccount.hbs', {msg: 'Username is taken :('})
    }else{
      //successfully created account
      console.log('creating new account...')
      console.log(acc.username)
      console.log(acc.password)
      const newUser = new Login ({username: acc.username, password: acc.password})
      newUser.save()
      res.render('views/layouts/createAccount.hbs', {msg: 'Account created successfully!'})
    }
  })

})

app.get('/creatureMaker', (req, res) => {
  console.log('get creature maker')
  console.log(currUser)
  Creature.find({owner: currUser}).lean().then(function (docs, err){
    res.render('views/layouts/creatureMaker.hbs', {e: docs})
    //console.log(docs)
  })
})

app.post('/creatureMaker', (req, res) => {
  const newCreature = new Creature({
    name: req.body.name,
    type: req.body.type,
    age: req.body.age,
    owner: currUser, //todo
    picture: creaturePics[req.body.type],
    status: calcStatus(req.body.age, req.body.type)
  })
  Creature.findOne(newCreature).then(function (result, err) {
    if(result){
      console.log('duplicate creature')
      //creature already exists
    }else{
      console.log('saving creature...')
      newCreature.save()
      Creature.find({owner: currUser}).lean().then(function (docs, err){
        res.render('views/layouts/creatureMaker.hbs', {e: docs})
        console.log('hi')
        //console.log(docs)
        console.log('bye')
      })
      //res.render('views/layouts/creatureMaker.hbs')
    }
  })
}) 

app.post('/delItem/:id', (req, res) => {
  Creature.findByIdAndRemove({_id: req.params.id}).then(function (result, err){
    console.log('creature removed...')
    console.log(result._id)
    res.redirect('/creatureMaker')
  })
})

const calcStatus = (age, type) =>{
  if(age <= avgAges[type] / 2){
    return "your creature is young!"
  }else if(age >= maxAges[type]){
    return "your creature is ancient!!"
  }else{
    return "your creature is middle aged"
  }
}

app.listen(process.env.PORT || 3000, () => console.log('Example app is listening on port 3000.'));