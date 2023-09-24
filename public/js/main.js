// FRONT-END (CLIENT) JAVASCRIPT HERE

const addRecipe = async function (event) {
  event.preventDefault();

  const inputName = document.querySelector("#recipe_name");
  const inputIngredients = document.querySelector("#recipe_ingredients");
  const inputDirections = document.querySelector("#recipe_directions");

  const recipeData = {
    recipe_name: inputName.value,
    recipe_ingredients: inputIngredients.value,
    recipe_directions: inputDirections.value,
  };

  const response = await fetch("/add_recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeData),
  });
  console.log(response);
  const recipes = await response.json();

  const tableRows = recipes
    .map((recipe) => {
      return `<tr>
        <td>${recipe.recipe_name}</td>
        <td>${recipe.recipe_ingredients}</td>
        <td>${recipe.recipe_directions}</td>
        <td>${recipe.cooking_time} minutes</td> <!-- Display Cooking Time -->
     </tr>`;
    })
    .join("");

  document.querySelector("#recipe_table").innerHTML = tableRows;

  inputName.value = "";
  inputIngredients.value = "";
  inputDirections.value = "";
};

const deleteRecipe = async function (event) {
  event.preventDefault();

  const inputToDelete = document.querySelector("#recipe_to_delete");

  const recipeToDelete = {
    recipe_name: inputToDelete.value,
  };

  const response = await fetch("/delete_recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeToDelete),
  });

  const recipes = await response.json();

  const tableRows = recipes
    .map((recipe) => {
      return `<tr>
        <td>${recipe.recipe_name}</td>
        <td>${recipe.recipe_ingredients}</td>
        <td>${recipe.recipe_directions}</td>
        <td>${recipe.cooking_time} minutes</td> <!-- Display Cooking Time -->
      </tr>`;
    })
    .join("");

  document.querySelector("#recipe_table").innerHTML = tableRows;

  inputToDelete.value = "";
};

window.onload = function () {
  const addRecipeButton = document.getElementById("add_recipe");
  const deleteRecipeButton = document.getElementById("delete_recipe");

  addRecipeButton.onclick = addRecipe;
  deleteRecipeButton.onclick = deleteRecipe;
  const login = async function (event) {
    event.preventDefault();

    const username = document.querySelector("#username_login").value;
    const password = document.querySelector("#password_login").value;

    const userData = {
      username,
      password,
    };

    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  };

  const register = async function (event) {
    event.preventDefault();

    const username = document.querySelector("#username_register").value;
    const password = document.querySelector("#password_register").value;

    const userData = {
      username,
      password,
    };

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        // Handle successful registration here, perhaps navigate to a new page or update UI
        alert("Registration successful!");
      } else {
        console.error(data.message);
        // Handle errors here, perhaps update the UI to show an error message
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle network or other errors here
      alert("An error occurred while registering. Please try again.");
    }
  };

  const displayRecipes = async () => {
    const response = await fetch("/get_recipes", {
      method: "GET",
    });

    if (response.ok) {
      const recipes = await response.json();

      const tableRows = recipes
        .map((recipe) => {
          return `<tr>
          <td>${recipe.recipe_name}</td>
          <td>${recipe.recipe_ingredients}</td>
          <td>${recipe.recipe_directions}</td>
          <td>${recipe.cooking_time} minutes</td>
        </tr>`;
        })
        .join("");

      document.querySelector("#recipe_table").innerHTML = tableRows;
    } else {
      console.error("Failed to fetch recipes.");
    }
  };

  // Add an event listener to call the displayRecipes function when the page loads
  window.onload = function () {
    // Event handlers for adding and deleting recipes
    const addRecipeButton = document.getElementById("add_recipe");
    const deleteRecipeButton = document.getElementById("delete_recipe");
    addRecipeButton.onclick = addRecipe;
    deleteRecipeButton.onclick = deleteRecipe;

    // Event handlers for login and registration
    const loginButton = document.getElementById("login_button");
    const registerButton = document.getElementById("register_button");
    loginButton.onclick = login;
    registerButton.onclick = register;

    // Fetch and display recipes when the page loads
    displayRecipes();
  };
};
