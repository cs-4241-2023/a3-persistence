const express = require("express");
const cookieSession = require("cookie-session");
const { MongoClient } = require("mongodb");
const app = express();
const fs = require("fs");
const mime = require("mime");
const dir = "public/";
const port = 3000;
const uri =
  "mongodb+srv://user:webware@cluster0.ejk65ad.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
client.connect();

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.get("/", (req, res) => {
  sendFile(res, "public/index.html");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/login", (req, res) => {
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
      password: password,
    };
    loginHelper(aUser, res, req);
  });
});

async function loginHelper(aUser, res, req) {
  try {
    console.log("Connected to the MongoDB database"); // Log when the connection is successful
    const DB = client.db("a3DB");
    const collection = DB.collection("Users");

    const name = aUser.username;
    const key = { username: name };
    const exists = await collection.findOne(key);

    if (exists === null) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ username: name }));
    } else if (exists.password === aUser.password) {
      console.log("Login Successful");
      req.session.username = aUser.username;
      res.redirect("/recipe.html");
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ username: name }));
    }
  } catch (e) {
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
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ username: request.session.username }));
    }
  });
});

 // Check database connection and fetch data from the "Recipes" table when needed
app.get("/getRecipes", async (request, response) => {
  try {
    await client.connect(); // Ensure the database connection is established before proceeding
    console.log("Connected to the MongoDB database");

    const DB = client.db("recipeTracker");
    const collection = DB.collection("recipes");
    console.log("Fetched recipes from the database...");

    const recipes = await collection.find({}).toArray();
    console.log("const recipes");

    if (recipes.length > 0) {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(recipes));
      console.log("added recipes");
    } else {
      console.log("none in db");
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ message: "No recipes found." }));
    }
  } catch (e) {
    console.error("Error fetching data from the database:", e);
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ message: "Internal server error." }));
  }
});

app.post("/addRecipe", async (request, response) => {
  try {
    // Ensure the database connection is established before proceeding
    await client.connect();
    console.log("Connected to the MongoDB database");

    const DB = client.db("recipeTracker");
    const collection = DB.collection("recipes");

    // Get the recipe data from the request body
    const recipeData = request.body;

    // Calculate the cooking time based on the number of steps and ingredients
    const numSteps = recipeData.recipe_directions.split(/\r\n|\r|\n/).length;
    const numIngredients =
      recipeData.recipe_ingredients.split(/\r\n|\r|\n/).length;

    const cookingTime = numSteps + numIngredients;

    // Assign the calculated cooking time to the recipe data
    recipeData.cooking_time = cookingTime;

    // Insert the new recipe into the database
    const result = await collection.insertOne(recipeData);

    if (result.insertedCount === 1) {
      response.status(201).json({ message: "Recipe added successfully" });
      console.log("Recipe added");
    } else {
      response.status(500).json({ message: "Recipe could not be added" });
      console.log("Recipe could not be added");
    }
  } catch (e) {
    console.error("Error adding recipe to the database:", e);
    response.status(500).json({ message: "Internal server error." });
  }
});

app.get("/getRecipes", (request, response) => {
  const username = request.session.username;
  getUsers(username, response);
});

async function getUsers(username, res) {
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
      res.type("html");
      res.redirect("/recipe.html");
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

app.use(express.static("public"));

app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`);
});
