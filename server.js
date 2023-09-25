const express = require('express'),
    app = express(),
    path = require('path'),
    cookie = require('cookie-session'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    MongoClient = require('mongodb').MongoClient,
    axios = require('axios'),
    { Octokit } = require("@octokit/rest");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: __dirname + '/.env' });
}

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cookie({
    name: 'session',
    keys: ['key1', 'key2']
}))

app.use(express.json())
console.log(process.env.MONGO_URL)
const uri = "mongodb+srv://amandablanchard48:3gsaN7PcBbr572HG@cluster0.sceddsm.mongodb.net/", client = new MongoClient(uri)
console.log(uri)
let collection = null

async function run() {
    await client.connect()
    collection = await client.db("webware").collection("a3")
}
run()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    if (collection !== null) {
        next()
    } else {
        res.status(503).send()
    }
})

app.use(express.static(__dirname + '/public'));

app.get('/data', async (req, res) => {
    if (collection !== null) {
        const docs = await collection.find({
            user: req.cookies.user,
        }).toArray()
        res.json(docs)
    }
})
app.get('/', (req, res) => {
    if (req.session.user_id === undefined) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'))
    }
    else
        res.sendFile(path.join(__dirname, 'public', 'main.html'))
})

app.get("/main.html", (req, res, next) => {
    if (req.session.user_id === undefined) {
        res.redirect("/index.html")
    }
    next();
});

app.get('/auth/gitCallback', async (req, res) => {
    try {
        const token = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code: req.query.code,
            },
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        );
        const access_token = token.data;
        if (!access_token) {
            return res.status(500).send('Failed to obtain access token.');
        }
        const octokit = new Octokit({
            auth: `token ${access_token.access_token}`,
        });

        const { data: user } = await octokit.users.getAuthenticated();

        const user_login = user.login;
        req.session.user = user_login;
        res.cookie('access_token', access_token);
        res.cookie('user', user_login);
        console.log(user_login);
        res.redirect('/main.html');

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});
app.post('/add', async (req, res) => {
    try {
        req.body.user = req.cookies.user;
        console.log(JSON.stringify(req.body))
        const result = await collection.insertOne(req.body)
        res.json(result)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.delete('/remove', async (req, res) => {
    console.log(req.body)
    const result = await collection.deleteOne(req.body);
    if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
    } else {
        console.log("No documents matched the query. Deleted 0 documents.");
    }
})
app.put('/update', async (req, res) => {
    const user = req.cookies.user; // Assuming the user attribute is stored in cookies
    if (!user) {
        return res.status(400).json({ error: 'User not found in cookies' });
    }
    const title = req.body.title, rating = req.body.rating;
    const maxRetries = 2;
    let retryCount = 0;
    while (retryCount < maxRetries) {
        const result = await collection.updateOne(
            { title: title, user: user },
            { $set: { rating: rating } }
        );
        if (result.modifiedCount === 1) {
            return res.status(200).json({ message: 'Update successful' });
        } else {
            console.log("No documents matched the query.");
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    return res.status(500).json({ error: 'Update failed' });
});

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.listen((process.env.PORT || 3000), function () {
    console.log('Node app is running on port', app.get('port'));
});
