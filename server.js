const dotenv = require('dotenv');
dotenv.config();
const express = require("express"),
    cookie = require("cookie-session"),
    { MongoClient, ObjectId } = require("mongodb"),
    app = express();

app.use(express.urlencoded({ extended: true }))
app.use(cookie({
    name: 'session',
    keys: ['a1', 'a2']
}));
app.use(express.static('public'))
app.use(express.json())
app.use((req, res, next) => {
    if (collection !== null) {
        next()
    } else {
        res.status(503).send()
    }
})


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@a3.5svubdq.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri)

let collection = null

async function run() {
    await client.connect()
    collection = await client.db("a3").collection("palettes")
    logins = await client.db("a3").collection("logins")
}

run()


app.post('/login', (req, res) => {
    logins.findOne({ username: req.body.username, password: req.body.password }).then(user => {
        if (user) {
            req.session.login = true
            req.session.user = req.body.username;
            return res.sendStatus(200);
        } else {
            return res.sendStatus(401);
        }
    });

})
app.post('/logout', (req, res) => {
    req.session.login = false;
    req.session.user = null;
    return res.sendStatus(200);
})
app.use(function(req, res, next) {
    if (req.session.login === true)
        next()
    else
        res.redirect('/')
})

// route to get all docs
app.get('/docs', async(req, res) => {
    const docs = await collection.find({ addedBy: req.session.user }).toArray()
    res.json(docs)
})

// add object
app.post('/add', async(req, res) => {
    let data = req.body;
    data["addedBy"] = req.session.user;
    const result = await collection.insertOne(data)
    res.json(result)
})

app.delete('/remove/:id', async(req, res) => {
    let id = req.params.id;
    const result = await collection.deleteOne({
        "_id": new ObjectId(id)
    })

    res.json(result)
})
app.post('/update', async(req, res) => {
    const result = await collection.updateOne({ _id: new ObjectId(req.body._id) }, {
        $set: {
            name: req.body.name,
            primary_color: req.body.primary_color,
            secondary_color: req.body.secondary_color,
            teritary_color: req.body.teritary_color,
            accent_1: req.body.accent_1,
            accent_2: req.body.accent_2
        },
    })

    res.json(result)
})


app.listen(process.env.PORT || 3000);

function sortByContrast(arr) {
    arr.sort(function(a, b) {
        return b.contrast - a.contrast;
    })
    return arr;
}