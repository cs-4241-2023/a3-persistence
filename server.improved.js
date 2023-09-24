const express = require("express");
const fs = require("fs");
const mime = require("mime");
const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT || 3000;
const mongoURL = "mongodb://localhost:27017";
const dbName = "mydb";
const collectionName = "recipes";
const loginCollectionName = "users";




app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  const filename = "public/index.html";
  sendFile(res, filename);
});

app.post("/add_recipe", (req, res) => {
  const requestData = req.body;
  addRecipeToMongo(requestData, res);
});

app.post("/delete_recipe", (req, res) => {
  const requestData = req.body;
  deleteRecipeFromMongo(requestData.recipe_name, res);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // Validate username and password with database
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  MongoClient.connect(mongoURL, async function (err, client) {
    if (err) {
      console.error("MongoDB connection error:", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    const db = client.db(dbName);
    const userCollection = db.collection(loginCollectionName);

    // Check if username already exists
    const existingUser = await userCollection.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Username already exists" });
      client.close();
      return;
    }

    userCollection.insertOne(
      { username, password: hashedPassword },
      function (err, result) {
        if (err) {
          console.error("Error inserting user:", err);
          res.status(500).json({ message: "Internal server error" });
          client.close();
          return;
        }

        console.log(`User added: ${result.insertedId}`);
        res.status(200).json({ message: "User registered successfully" });
        client.close();
      }
    );
  });
});

const sendFile = function (res, filename) {
  const type = mime.getType(filename);
  fs.readFile(filename, function (err, content) {
    if (err === null) {
      res.writeHead(200, { "Content-Type": type });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end("404 Error: File Not Found");
    }
  });
};

// Define the addRecipeToMongo function
const addRecipeToMongo = function (recipeData, res) {
  MongoClient.connect(mongoURL, function (err, client) {
    if (err) throw err;
    

    const db = client.db(dbName);

    const collection = db.collection(collectionName);

    // Calculate cooking time based on ingredients complexity
    const calculateCookingTime = (ingredients) => {
      const ingredientCount = ingredients.split(",").length;
      const cookingTime = ingredientCount * 5; // 5 minutes per ingredient
      return cookingTime;
    };

    recipeData.cooking_time = calculateCookingTime(
      recipeData.recipe_ingredients
    );

    // Insert the complete recipe data, including new fields
    collection.insertOne(recipeData, function (err, result) {
      if (err) throw err;

      console.log(`Recipe added: ${result.insertedId}`);

      res.status(200).json(result.ops);
      client.close();
    });
  });
};

// Define the deleteRecipeFromMongo function
const deleteRecipeFromMongo = function (recipeName, username, res) {
  MongoClient.connect(mongoURL, function (err, client) {
    if (err) {
      console.error("MongoDB connection error:", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    collection.deleteOne(
      { recipe_name: recipeName, username: username },
      function (err, result) {
        if (err) {
          console.error("Error deleting recipe:", err);
          res.status(500).json({ message: "Internal server error" });
          client.close();
          return;
        }

        if (result.deletedCount === 0) {
          res.status(404).json({ message: `Recipe ${recipeName} not found.` });
        } else {
          console.log(`Recipe deleted: ${recipeName}`);
          res.status(200).json({ message: `Recipe ${recipeName} deleted.` });
        }

        client.close();
      }
    );
  });
};

app.post("/delete_recipe", (req, res) => {
  const recipeName = req.body.recipe_name;
  const username = req.body.username; // Assuming you pass username in the request
  deleteRecipeFromMongo(recipeName, username, res);
});

app.get("/get_recipes", async (req, res) => {
  MongoClient.connect(mongoURL, async function (err, client) {
    if (err) {
      console.error("MongoDB connection error:", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch all recipes from the database
    const recipes = await collection.find().toArray();

    res.status(200).json(recipes);
    client.close();
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
