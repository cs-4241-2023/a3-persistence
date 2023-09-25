
const express = require("express"),
    { MongoClient, ObjectId } = require("mongodb"),
    cookie = require('cookie-session')

const fs = require('fs');
const mime = require('mime');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(express.static("public"))
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )
let users = null
let tasks = null

app.use( express.urlencoded({ extended:true }) )
app.use( cookie({
    name: 'session',
    keys: ['key1', 'key2']
}))

app.use(express.json()); // Middleware to parse JSON request bodies

// Log all incoming requests
const logger = (req, res, next) => {
    console.log('url:', req.url)
    next()
}

app.use(logger)

// Monitor MongoDB connection
app.use((req, res, next) => {
    if (collection !== null) {
        next()
    } else {
        res.status(503).send()
    }
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle GET requests
app.get('/', (req, res) => {
    console.log('Serving login page')
    res.sendFile(path.join(__dirname, 'src/pages/login.html'));
});


app.get('/dashboard', (req, res) => {
    if (req.session.userId) {
        res.sendFile(path.join(__dirname, 'src/pages/dashboard.html'))
    } else {
        res.send('Please log in first');
        res.redirect("/")
    }
});

app.get('/getTasks', (req, res) => {
    console.log('Sending tasks:', tasks);
    res.json(tasks);
});

// Handle POST requests
app.post('/addTask', async (req, res) => {
    const data = req.body;
    console.log('Received task data for addition:', data);

    const currentDate = new Date();
    switch (data.priority) {
        case 'high':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
        case 'medium':
            currentDate.setDate(currentDate.getDate() + 3);
            break;
        case 'low':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
    }
    data.dueDate = currentDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD

    const result = await tasks.insertOne(data)
    console.log('Task added');
    res.json(result);
});

app.post('/deleteTask', async (req, res) => {
    const result = await tasks.deleteOne({
        _id: new ObjectId(req.body._id)
    })

    res.json(result)
});


app.post('/login', async (req, res) => {
    const { username, password } = JSON.parse(dataString);
    const user = await users.findOne({ username });

    if (user) {
        // User exists, check password
        bcrypt.compare(password, user.password, function (err, result) {
            if (err) throw err;
            if (result) {
                // Passwords match
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, message: 'Logged in successfully' }));
            } else {
                // Passwords don't match
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: 'Incorrect password' }));
            }
        });
    } else {
        // User doesn't exist, create a new user
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) throw err;
            users.insertOne({ username, password: hash }, function (err, res) {
                if (err) throw err;
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, message: 'User created and logged in successfully' }));
            });
        });
    }
    if (authenticated) {
        req.session.userId = user._id;  // Save user ID in session
        res.send('Logged in!');
    } else {
        res.send('Invalid credentials');
    }
});

async function run() {
    await client.connect()
    users = await client.db("persistance").collection("users")
    tasks = await client.db("persistance").collection("tasks")

    // route to get all docs
    app.get("/docs", async (req, res) => {
        if (users !== null) {
            const docs = await collection.find({}).toArray()
            res.json(docs)
        }
        
        if (tasks !== null) {
            const docs = await collection.find({}).toArray()
            res.json(docs)
        }
    })
}

run()

// Handle 404 for unrecognized endpoints
app.use((req, res) => {
    console.log('404 Error: Endpoint not recognized:', req.url);
    res.status(404).send('404 Error: File Not Found');
});

app.listen(process.env.PORT || port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
