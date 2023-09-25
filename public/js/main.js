// Fetch recipes and display them
const getRecipes = async function () {
  try {
    // Fetch and display the user's recipe list
    const response = await fetch("/getRecipes");
    const contentType = response.headers.get("content-type");
    console.log("About to enter if in main.js.");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (response.ok) {
        // Success
        displayRecipes(data);
      } else {
        console.error("Error: " + response.status);
        displayError("Error fetching recipes.");
      }
    } else {
      console.error("Unexpected content type:", contentType);
      console.log("Response as text:", await response.text());
      // Handle other unexpected content types here.
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
    displayError("Error fetching recipes.");
  }
};
// Define the addRecipe function
const addRecipe = async function (event) {
  event.preventDefault();

  const recipeData = {
    recipe_name: document.getElementById("recipe_name").value,
    recipe_ingredients: document.getElementById("recipe_ingredients").value,
    recipe_directions: document.getElementById("recipe_directions").value,
  };

  // Calculate the cooking time based on the number of steps and ingredients
  const numSteps = recipeData.recipe_directions.split(/\r\n|\r|\n/).length;
  const numIngredients =
    recipeData.recipe_ingredients.split(/\r\n|\r|\n/).length;

  const cookingTime = numSteps + numIngredients;

  recipeData.cooking_time = cookingTime;

  try {
    const response = await fetch("/addRecipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    });

    if (response.ok) {
      // Recipe added successfully
      console.log("Recipe added successfully");
    } else {
      // Error adding the recipe
      console.error("Error adding recipe");
    }
  } catch (error) {
    console.error("Error adding recipe:", error);
  }
};
document.addEventListener("DOMContentLoaded", function () {
  getRecipes();
  displayRecipes();
  // Login
  const loginButton = document.querySelector("#login_button");
  loginButton.addEventListener("click", login);

  // Register
  const registerButton = document.querySelector("#register_button");
  registerButton.addEventListener("click", createUser);

  // Add Recipe
  const addRecipeButton = document.querySelector("#add_recipe");
  addRecipeButton.addEventListener("click", addRecipe);

  // Delete Recipe
  const deleteRecipeButton = document.querySelector("#delete_recipe");
  deleteRecipeButton.addEventListener("click", deleteRecipe);

  // Initialize the recipe list
  getRecipes();
});

const login = async function (event) {
  event.preventDefault();

  // Get inputs
  const usernameInput = document.querySelector("#username_login");
  const passwordInput = document.querySelector("#password_login");

  // Parse as strings
  const username = usernameInput.value;
  const password = passwordInput.value;

  // Create a new array with data
  const userData = {
    username: username,
    password: password,
  };

  // Pass newUser to the server and wait for a response
  const response = await fetch("/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  const nameDisplay = document.querySelector("#error-message");

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    try {
      const data = await response.json();
      if (response.status === 404) {
        nameDisplay.textContent = `Username: ${data.username} could not be found.`;
      } else if (response.status === 400) {
        console.log("Incorrect password");
        nameDisplay.textContent = `Password for ${data.username} was incorrect `;
      } else {
        console.error("Error: " + response.status);
        nameDisplay.textContent = "Error: " + response.status;
      }
    } catch (error) {
      console.error("Error while parsing JSON:", error);
      console.log("Response as HTML:", await response.text());
      // You might display the HTML response or handle it differently.
    }
  } else if (contentType && contentType.includes("text/html")) {
    // Handle the HTML response
    const htmlResponse = await response.text();
    // Display the HTML response or handle it as needed
    // For example, you can set the content of an element with the HTML
    document.documentElement.innerHTML = htmlResponse;
    window.location.replace("/index.html");
  } else {
    console.error("Unexpected content type:", contentType);
    console.log("Response as text:", await response.text());
    // Handle other unexpected content types here.
  }
};

const createUser = async function (event) {
  event.preventDefault();

  // Get inputs
  const usernameInput = document.querySelector("#username_register");
  const passwordInput = document.querySelector("#password_register");
  const REpasswordInput = document.querySelector("#REpassword");
  const balanceInput = document.querySelector("#balance");

  // Parse as strings and floats
  const balance = parseFloat(balanceInput.value);
  const username = usernameInput.value;
  const password = passwordInput.value;
  const REpassword = REpasswordInput.value;

  // Create a new array with data
  const userData = {
    username: username,
    password: password,
    REpassword: REpassword,
    balance: balance,
  };

  // Pass newUser to the server and wait for a response
  const response = await fetch("/createUser", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  const nameDisplay = document.querySelector("#nameDisplay");

  if (response.status === 302) {
    // Handle the redirection here, if needed
    console.log("Redirecting...");
    // You might also directly redirect the client, like this:
    // window.location.href = response.url;
  } else {
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      try {
        const data = await response.json();
        if (response.status === 200) {
          console.log("Success: User created");
          nameDisplay.textContent = `New User Created: ${data.username}!`;
        } else if (response.status === 300) {
          nameDisplay.textContent = `Username: ${data.username} Already Exists.`;
        } else if (response.status === 301) {
          console.log("Passwords do not match");
          nameDisplay.textContent = "Passwords do not match";
        } else {
          console.error("Error: " + response.status);
          nameDisplay.textContent = "Error: " + response.status;
        }
      } catch (error) {
        console.error("Error while parsing JSON:", error);
        console.log("Response as HTML:", await response.text());
        // You might display the HTML response or handle it differently.
      }
    } else if (contentType && contentType.includes("text/html")) {
      // Handle the HTML response
      const htmlResponse = await response.text();
      // Display the HTML response or handle it as needed
      // For example, you can set the content of an element with the HTML
      document.documentElement.innerHTML = htmlResponse;
      window.location.replace("/index.html");
    } else {
      console.error("Unexpected content type:", contentType);
      console.log("Response as text:", await response.text());
      // Handle other unexpected content types here.
    }
  }
};

// Add Recipe Form Submission
const addRecipeButton = document.querySelector("#add_recipe");
addRecipeButton.addEventListener("click", addRecipe);

const deleteRecipe = async function (event) {
  event.preventDefault();

  // Get inputs
  const recipeNameInput = document.querySelector("#recipe_to_delete");
  const usernameInput = document.querySelector("#username_to_delete");

  // Parse as strings
  const recipeName = recipeNameInput.value;
  const username = usernameInput.value;

  // Create a new array with data
  const deleteData = {
    recipeName: recipeName,
    username: username,
  };

  // Pass the new array to the server and wait for a response
  const response = await fetch("/remove", {
    method: "DELETE",
    body: JSON.stringify(deleteData),
  });

  const deleteStatus = document.querySelector("#delete_status");

  if (response.status === 200) {
    // Success
    deleteStatus.textContent = `Recipe '${recipeName}' deleted successfully.`;
    // Clear the input fields
    recipeNameInput.value = "";
    usernameInput.value = "";
    // Refresh the recipe list
    getRecipes();
  } else if (response.status === 404) {
    deleteStatus.textContent = `Recipe '${recipeName}' not found for user '${username}'.`;
  } else {
    console.error("Error: " + response.status);
    deleteStatus.textContent = "Error deleting the recipe.";
  }
};

// Display recipes with error handling
const displayRecipes = function (recipes) {
  const recipeTable = document.querySelector("#recipe_table");
  recipeTable.innerHTML = ""; // Clear previous data

  if (!recipes || recipes.length === 0) {
    recipeTable.innerHTML = "<tr><td colspan='4'>No recipes found.</td></tr>";
  } else {
    recipes.forEach((recipe) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${recipe.recipe_name}</td>
        <td>${recipe.recipe_ingredients}</td>
        <td>${recipe.recipe_directions}</td>
        <td>${recipe.cooking_time}</td>
      `;
      recipeTable.appendChild(row);
    });
  }
};

const displayNoRecipes = function () {
  const recipeTable = document.querySelector("#recipe_table");
  recipeTable.innerHTML = "<tr><td colspan='4'>No recipes found.</td></tr>";
};

const displayError = function (message) {
  const recipeTable = document.querySelector("#recipe_table");
  recipeTable.innerHTML = `<tr><td colspan='4'>${message}</td></tr>`;
};
