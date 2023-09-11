const express = require('express');
const serveIndex = require('serve-index');

const app = express();

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
  res.send('Successful response.');
});

app.listen(process.env.PORT || 3000, () => console.log('Example app is listening on port 3000.'));