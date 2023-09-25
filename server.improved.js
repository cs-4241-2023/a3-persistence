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

// Updated /login route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body; // Automatically parsed by express.json()
    const aUser = { username, password };
    await loginHelper(aUser, res, req); // Assuming loginHelper is your authentication function
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
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

// Delete a recipe
app.delete("/deleteRecipe/:recipeName", async (req, res) => {
  try {
    const recipeName = req.params.recipeName;
    const username = req.session.username;

    const DB = client.db("recipeTracker");
    const collection = DB.collection("recipes");

    const result = await collection.deleteOne({
      recipe_name: recipeName,
      username: username,
    });

    if (result.deletedCount === 1) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Recipe deleted successfully." }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Recipe not found." }));
    }
  } catch (e) {
    console.error("Error deleting recipe:", e);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error." }));
  }
});

async function loginHelper(aUser, res, req) {
  try {
    console.log("Connected to the MongoDB database");
    const DB = client.db("recipeTracker");
    const collection = DB.collection("user");

    const name = aUser.username;
    const key = { username: name };
    const exists = await collection.findOne(key);

    if (exists === null) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ username: name }));
    } else if (exists.password === aUser.password) {
      console.log("Login Successful");
      req.session.username = aUser.username;
      req.session.isLoggedIn = true;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Login successful", username: name }));
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ username: name }));
    }
  } catch (e) {
    console.log(e);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
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

app.put("/updateRecipe", async (req, res) => {
  try {
    const updatedRecipeData = req.body;
    console.log("Received updated data:", req.body);
    // Validate that the entire object is present
    if (!updatedRecipeData) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Invalid data." }));
    }

    const username = req.session.username;
    const DB = client.db("recipeTracker");
    const collection = DB.collection("recipes");

    const query = {
      recipe_name: updatedRecipeData.original_recipe_name,
      username: username,
    };
    const update = {
      $set: {
        recipe_name: updatedRecipeData.new_recipe_name,
        recipe_ingredients: updatedRecipeData.new_recipe_ingredients,
        recipe_directions: updatedRecipeData.new_recipe_directions,
      },
    };

    console.log("Query:", query);
    console.log("Update:", update);

    const result = await collection.updateOne(query, update);

    if (result.modifiedCount === 1) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Recipe updated successfully." }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Recipe not found." }));
    }
  } catch (e) {
    console.error("Error updating recipe:", e);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error." }));
  }
});

async function getUsers(username, res) {
  try {
    const DB = client.db("recipeTracker");
    const collection = DB.collection("User");

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
app.post("/register", async (req, res) => {
  try {
    const userData = req.body;
    const username = userData.username;
    const password = userData.password;

    const newUser = {
      username: username,
      password: password,
    };

    const DB = client.db("recipeTracker");
    const collection = DB.collection("user");

    const existingUser = await collection.findOne({ username: username });
    if (existingUser) {
      res.writeHead(409, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Username already exists." }));
      return;
    }

    await collection.insertOne(newUser);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User registered successfully." }));
    req.session.isLoggedIn = true;
  } catch (e) {
    console.error("Error registering user:", e);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error." }));
  }
});

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

