const express = require("express");
const router = express.Router();
crypto = require('crypto');
const { MongoClient, ServerApiVersion } = require('mongodb');
const Vsl = require('../models/vsl');
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
client.connect();

// create db from client
const vehicleServiceLogs = client.db("SLogs");

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

router.get('/', (req, res) => {
    if (req.session.login === true) {
        res.redirect("/home");
    } else {
        res.redirect("/login");
    }
});

router.get("/login", (_, res) => {
    res.render("login.ejs", { error: "" });
});

router.get("/home", (req, res) => {
    res.render("index.ejs");
})

router.get('/req-server-data', async (request, response) => {
    console.log(request.session.user)
    const appdata_frm_db = await vehicleServiceLogs.collection(request.session.user).find({}).toArray();

    const rm_id_frm_appdata_db = appdata_frm_db.map(function (obj) {
        return Object.fromEntries(Object.entries(obj).filter(([key]) => key !== '_id'));
    });

    console.log("app data from db");
    console.log(rm_id_frm_appdata_db);
    response.end(JSON.stringify(rm_id_frm_appdata_db));
});

router.post('/submit', stringToJSONMiddleware, async (request, response) => {

    const user_data_json = request.parsedBody;
    console.log("Data being added: ");
    console.log(user_data_json);

    // Add user vehice service appointment data to appdata
    user_data_json['dayuntilappointment'] = addNewDataField(user_data_json);
    user_data_json['uuid'] = crypto.randomUUID();

    const vsl_data_obj = new Vsl(user_data_json);

    // add data to mongoDB
    vehicleServiceLogs.collection(request.session.user).insertOne(vsl_data_obj);

    console.log("Server Data after submission: ");
    console.log(await vehicleServiceLogs.collection(request.session.user).find({}).toArray());

    response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
    response.end('Success')
});

router.post('/delete-frm-table', express.text(), (request, response) => {
    const unique_identifier = request.body;
    console.log(`Server: Removing UUID ${unique_identifier}`);

    // remove from db
    vehicleServiceLogs.collection(request.session.user).findOneAndDelete({ uuid: unique_identifier });

    response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
    response.end('Success');
});

router.post('/modify-table-entry', stringToJSONMiddleware, async (request, response) => {

    const data_to_modify = request.parsedBody;
    console.log("Modified Data: ");
    console.log(data_to_modify);

    const modify_uuid = data_to_modify[0];
    const modify_form_data = JSON.parse(data_to_modify[1]);
    modify_form_data['dayuntilappointment'] = addNewDataField(modify_form_data);

    // Locate entry we want to modify in db using uuid
    vehicleServiceLogs.collection(request.session.user).findOneAndUpdate({ uuid: modify_uuid }, { $set: modify_form_data });

    console.log("App data after modification");
    console.log(await vehicleServiceLogs.collection(request.session.user).find({}).toArray());

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

router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});



module.exports = router;