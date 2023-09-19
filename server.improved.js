const express = require('express');
const cookie = require('cookie-session');
const fetch = require("node-fetch");
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 3000;

const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@webware.mzw5rnb.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null;
async function setup_mongo() {
  await client.connect();
  collection = await client.db("tierlist").collection("items");
}
setup_mongo();

const tiers = {
  1: "F",
  2: "F",
  3: "F",
  4: "F",
  5: "F",
  6: "F",
  7: "D",
  8: "C",
  9: "B",
  10: "A",
  11: "A",
}

app.use((request, response, next) => {
  console.log("url:", request.url);
  next();
});

app.use(cookie({
  name: 'session',
  secret: process.env.SECRET,
}));

app.get("/login.html", (request, response, next) => {
  if (request.session.user_id !== undefined) {
    response.redirect("/")
  }
  next();
});

const sendLoginPage = (request, response) => {
  response.redirect("login.html")
};

app.get("/index.html", (request, response, next) => {
  if (request.session.user_id === undefined) {
    sendLoginPage(request, response);
  }
  next();
});

app.get("/", (request, response, next) => {
  if (request.session.user_id === undefined) {
    sendLoginPage(request, response);
  }
  next();
});

app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());

app.post("*", (request, response, next) => {
  if(collection !== null) {
    next();
  } else {
    response.status(503).send();
  }
});

app.get("/auth", async (request, response) => {
  // Fetch an access key from the given auth code
  let body = {
    "client_id": process.env.GITHUB_ID,
    "client_secret": process.env.GITHUB_SECRET,
    "code": request.query.code,
  }
  body = JSON.stringify(body);
  const access_r = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  const access_json = await access_r.json();
  const key = access_json.access_token;
  
  // Use the access key to fetch the user's id
  const user_r = await fetch("https://api.github.com/user", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
  });
  const user_json = await user_r.json();
  const user_id = user_json.id;
  request.session.user_id = user_id;
  
  // Redirect to the content page with the user id stored in a cookie
  response.redirect('/');
})

app.post("/delete", async (request, response, next) => {
  const result = await collection.deleteOne({ 
    item: request.body.item,
    user_id: request.session.user_id,
  });
  next();
});

app.post("/submit", async (request, response, next) => {
  const result = await collection.updateOne(
    {
      item: request.body.item,
      user_id: request.session.user_id,
    },
    {"$set": {
      item: request.body.item,
      rating: request.body.rating,
      image: request.body.image,
      user_id: request.session.user_id,
    }},
    {upsert: true},
  );
  next();
});

app.post("*", async (request, response) => {
  response.writeHead(200, "OK", {'Content-Type': 'application/json'})
  let processedData = [];
  let rawData = await collection.find({
    user_id: request.session.user_id,
  }).toArray();
  rawData.forEach((row) => {
    let newRow = {...row};
    newRow.tier = tiers[Math.ceil((row.rating + 1) / 10)];
    processedData.push(newRow);
  })
  response.end(JSON.stringify(processedData));
});

app.listen(process.env.PORT || port);
