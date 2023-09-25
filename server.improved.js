const express = require("express");
const cookieSession = require("cookie-session");
const { MongoClient } = require('mongodb');
const app = express();
const fs = require("fs");
const mime = require("mime");
const dir = "public/";
const port = 3000;
const uri = "mongodb+srv://boxturtle2003:AmCLH5ckA8WEICdT@cluster0.ejk65ad.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
client.connect();

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.get('/', (req, res) => {
  sendFile(res, "public/index.html");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/login', (req, res) => {
  let dataString = "";

  req.on("data", function (data) {
    dataString += data;
  });

  req.on("end", function () {
    const userData = JSON.parse(dataString);
    const username = userData.username;
    const password = userData.password;
    const aUser = {
      username: username,
      password: password
    }
    loginHelper(aUser, res, req);
  });
});

async function loginHelper(aUser, res, req) {
  try {

    const DB = client.db("a3DB");
    const collection = DB.collection("Users");

    const name = aUser.username
    const key = { username: name };
    const exists = await collection.findOne(key);

    if (exists === null) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ username: name }));
    } else if (exists.password === aUser.password) {
      console.log("Login Successful");
      req.session.username = aUser.username;
      res.redirect('/recipe.html');
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ username: name }));
    }
  }
  catch (e) {
    console.log(e);
  }
}

app.post("/createUser", (request, response) => {

  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const userData = JSON.parse(dataString);
    request.session.username = userData.username;
    if (userData.password == userData.REpassword) {
      // If the username doesn't exist add a create a new user 
      const newUser = {
        username: request.session.username,
        password: userData.password,
        recipes: [],
      };
      addToDb(newUser, response);
    } else {
      console.log("Passwords do not match");
      response.writeHead(400, { "Content-Type": "application/json" })
      response.end(JSON.stringify({ username: request.session.username }));
    }
  });
});

app.delete("/remove", (request, response) => {

  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const username = request.session.username;
    const recipeName = JSON.parse(dataString).recipeName;
    deleteRecipe(username, recipeName, response);
  });
});

app.post("/addRecipe", (request, response) => {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const username = request.session.username;
    const recipeData = JSON.parse(dataString);
    addRecipe(username, recipeData, response);
  });
});

app.get("/getRecipes", (request, response) => {
  const username = request.session.username;
  getRecipes(username, response);
});

async function deleteRecipe(username, recipeName, res) {
  try {
    const DB = client.db("a3DB");
    const collection = DB.collection("Users");

    const key = { username: username };
    const exists = await collection.findOne(key);

    if (exists !== null) {
      const updatedRecipes = exists.recipes.filter(recipe => recipe.name !== recipeName);
      const update = { $set: { recipes: updatedRecipes } };
      await collection.updateOne(key, update);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Recipe deleted successfully." }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found." }));
    }
  } catch (e) {
    console.log(e);
  }
}

async function addRecipe(username, recipeData, res) {
  try {
    const DB = client.db("a3DB");
    const collection = DB.collection("Users");

    const key = { username: username };
    const exists = await collection.findOne(key);

    if (exists !== null) {
      exists.recipes.push(recipeData);
      const update = { $set: { recipes: exists.recipes } };
      await collection.updateOne(key, update);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Recipe added successfully." }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found." }));
    }
  } catch (e) {
    console.log(e);
  }
}

async function getRecipes(username, res) {
  try {
    const DB = client.db("a3DB");
    const collection = DB.collection("Users");

    const key = { username: username };
    const exists = await collection.findOne(key);

    if (exists !== null) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(exists.recipes));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found." }));
    }
  } catch (e) {
    console.log(e);
  }
}

async function addToDb(newUser, res) {
  try {
    const DB = client.db("a3DB");
    const collection = DB.collection("Users");

    const name = newUser.username;
    const key = { username: name };
    const exists = await collection.findOne(key);

    if (exists === null) {
      await collection.insertOne(newUser);
      res.type('html');
      res.redirect('/recipe.html');

    } else {
      res.writeHead(300, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ username: newUser.username }));
    }
  } catch (e) {
    console.log(e);
  }
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    if (err === null) {
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

app.use(express.static('public'));

app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`);
});
