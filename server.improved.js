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
app.post("/addRecipe", async (req, res) => {
  try {
    const recipeData = req.body;
    const username = req.session.username;

    // Calculate cooking time based on the number of commas in ingredients and directions
    const cookingTime =
      recipeData.recipe_ingredients.split(",").length +
      recipeData.recipe_directions.split(",").length;

    // Prepare the recipe object
    const newRecipe = {
      recipe_name: recipeData.recipe_name,
      recipe_ingredients: recipeData.recipe_ingredients,
      recipe_directions: recipeData.recipe_directions,
      cooking_time: cookingTime,
      username: username,
    };

    // Insert the new recipe into the MongoDB database
    const DB = client.db("recipeTracker");
    const collection = DB.collection("recipes");
    await collection.insertOne(newRecipe);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Recipe added successfully." }));
  } catch (e) {
    console.error("Error adding recipe:", e);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error." }));
  }
});

async function loginHelper(aUser, res, req) {
  try {
    console.log("Connected to the MongoDB database"); // Log when the connection is successful
    const DB = client.db("recipeTracker");
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

