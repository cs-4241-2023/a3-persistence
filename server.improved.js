const express = require('express');
require('dotenv').config();

// TODO
/* Add .env file to store secret keys 
 * Project File Restructure: (Views, Routes)
 * Create register and login page
 * Store users in the database 
 * Get session id from users 
 * 
 * Github OAuth (final)
 */

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@vehicleservicelogcluste.no66rrt.mongodb.net/VSL-DB?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to DB then run server
client.connect().then(() => {
  console.log("We have connected to the database ");
  app.listen(port, () => console.log("Server has started on port 3000"));
});

// create db from client
const vehicleServiceLogs = client.db("VehicleSL");

const app = express(),
  fs = require('fs'),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require('mime'),
  crypto = require('crypto'),
  port = 3000

const appdata = [];

app.use(express.static('public'));
app.use(express.json()); // middleware for handling json objects

// custom middleware 
const stringToJSONMiddleware = (req, _, next) => {
  let dataString = '';

  req.on('data', (data) => {
    dataString += data;
  });

  req.on('end', () => {
    req.parsedBody = JSON.parse(dataString);
    next();
  });
};

app.get('/', (_, response) => {
  sendFile(response, 'public/index.html')
});

app.get('/req-server-data', async (_, response) => {
  const res_type = mime.getType(JSON.stringify(appdata));
  response.writeHeader(200, { 'Content-Type': res_type })

  const appdata_frm_db = await vehicleServiceLogs.collection('VSLogs').find({}).toArray();
  const rm_id_frm_appdata_db = appdata_frm_db.map(function (obj) {
    return Object.fromEntries(Object.entries(obj).filter(([key]) => key !== '_id'));
  });

  console.log("app data from db");
  console.log(rm_id_frm_appdata_db);
  response.end(JSON.stringify(rm_id_frm_appdata_db));
});

app.post('/submit', stringToJSONMiddleware, async (request, response) => {

  const user_data_json = request.parsedBody;
  console.log("Data being added: ");
  console.log(user_data_json);

  // Add user vehice service appointment data to appdata
  user_data_json['day-until-appointment'] = addNewDataField(user_data_json);
  user_data_json['uuid'] = crypto.randomUUID();

  // add data to mongoDB
  vehicleServiceLogs.collection('VSLogs').insertOne(user_data_json);

  console.log("Server Data after submission: ");
  console.log(await vehicleServiceLogs.collection('VSLogs').find({}).toArray());
  response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
  response.end('Success')
});

app.post('/delete-frm-table', express.text(), (request, response) => {
  const unique_identifier = request.body;
  console.log(`Server: Removing UUID ${unique_identifier}`);

  // remove from db
  vehicleServiceLogs.collection('VSLogs').findOneAndDelete({ uuid: unique_identifier });

  const index = appdata.findIndex(entry => entry.uuid === unique_identifier);

  if (index !== -1) {
    appdata.splice(index, 1);
  }

  response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
  response.end('Success');
});

app.post('/modify-table-entry', stringToJSONMiddleware, async (request, response) => {

  const data_to_modify = request.parsedBody;
  console.log("Modified Data: ");
  console.log(data_to_modify);

  const modify_uuid = data_to_modify[0];
  const modify_form_data = JSON.parse(data_to_modify[1]);
  modify_form_data['day-until-appointment'] = addNewDataField(modify_form_data);

  // Locate entry we want to modify in db using uuid
  vehicleServiceLogs.collection('VSLogs').findOneAndUpdate({ uuid: modify_uuid }, { $set: modify_form_data });

  console.log("App data after modification");
  console.log(await vehicleServiceLogs.collection('VSLogs').find({}).toArray());

  response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
  response.end('Modify Success');
});

function addNewDataField(json_data) {
  const currentDate = new Date();
  const appointment_date = new Date(json_data['appointment_date']) // 2023-09-23

  if (appointment_date >= currentDate) {
    // Calculate the time difference in milliseconds
    const timeDifference = appointment_date - currentDate;

    // Convert the time difference to days
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return daysDifference;
  } else {
    return 0;
  }
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename)

  fs.readFile(filename, function (err, content) {

    // if the error = null, then we've loaded the file successfully
    if (err === null) {

      // status code: https://httpstatuses.com
      response.writeHeader(200, { 'Content-Type': type })
      response.end(content)

    } else {
      // file not found, error code 404
      response.writeHeader(404)
      response.end('404 Error: File Not Found')

    }
  })
}

// server.listen(process.env.PORT || port)
// app.listen(port, () => console.log("Server has started on port 3000"));
