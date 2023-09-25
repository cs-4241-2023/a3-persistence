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

document.addEventListener("DOMContentLoaded", function () {
  getRecipes();
  displayRecipes();

  document
    .getElementById("add_recipe")
    .addEventListener("click", async function (e) {
      e.preventDefault();

      const recipeName = document.getElementById("recipe_name").value;
      const recipeIngredients =
        document.getElementById("recipe_ingredients").value;
      const recipeDirections =
        document.getElementById("recipe_directions").value;

      const recipeData = {
        recipe_name: recipeName,
        recipe_ingredients: recipeIngredients,
        recipe_directions: recipeDirections,
      };

      try {
        const response = await fetch("/addRecipe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recipeData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
          getRecipes();
          displayRecipes();// Refresh the recipe list
          recipeName.value = "";
        recipeIngredients.value = "";
        recipeDirections.value = "";
        } else {
          console.error("Error adding recipe:", await response.text());
        }
      } catch (error) {
        console.error("Error adding recipe:", error);
      }
    });
});

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

