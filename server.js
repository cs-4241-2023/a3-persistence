const express = require('express');
const serveIndex = require('serve-index');

const app = express();
const mongoose = require("mongoose");
const uri = "mongodb+srv://cabbag3:webware2023@creaturecreatorcluster.loiqv5g.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(
  uri, 
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
);

const creatureSchema = new mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  age: {type: Number, required: true},
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


/* const exampleCreature = new Creature({
  name: 'Babu',
  type: 'Frog',
  age: 3,
  picture: creaturePics.Frog,
  status: 'your creature is young!'
});

exampleCreature.save().then(
  () => console.log("One entry added"), 
  (err) => console.log(err)
); */

app.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

app.use('/request-type', (req, res, next) => {
  console.log('Request type: ', req.method);
  next();
});

app.use(express.static('public'));
app.use( express.json() );
//app.use('/public', serveIndex('public'));

app.post('/submit', (req, res, next) => {
    //add stuff to handle submit of data
    next();
});

app.get('/', (req, res) => {
  Creature.find({}, (err, found) => {
    if (!err) {
      res.send(found);
    }
    console.log(err);
    res.send("an error occured")
  }).catch(err => console.log("error occured, "+ err));
});

app.listen(process.env.PORT || 3000, () => console.log('Example app is listening on port 3000.'));