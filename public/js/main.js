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
          displayRecipes(); // Refresh the recipe list
          document.getElementById("recipe_name").value = "";
          document.getElementById("recipe_ingredients").value = "";
          document.getElementById("recipe_directions").value = "";
        } else {
          console.error("Error adding recipe:", await response.text());
        }
      } catch (error) {
        console.error("Error adding recipe:", error);
      }
    });
  // Add event listener for the "Delete Recipe" button
  document
    .getElementById("delete_recipe")
    .addEventListener("click", async function (e) {
      e.preventDefault();

      const recipeToDelete = document.getElementById("recipe_to_delete").value;

      try {
        const response = await fetch(`/deleteRecipe/${recipeToDelete}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
          getRecipes(); // Refresh the recipe list

          // Clear the delete field
          document.getElementById("recipe_to_delete").value = "";
        } else {
          console.error("Error deleting recipe:", await response.text());
        }
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    });
});

const displayRecipes = function (recipes) {
  const recipeTable = document.querySelector("#recipe_table");
  recipeTable.innerHTML = ""; // Clear previous data

  if (!recipes || recipes.length === 0) {
    recipeTable.innerHTML = "<tr><td colspan='4'>No recipes found.</td></tr>";
  } else {
    recipes.forEach((recipe) => {
      // Create a new row and populate it with cells
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="editable" data-field="recipe_name">${recipe.recipe_name}</td>
        <td class="editable" data-field="recipe_ingredients">${recipe.recipe_ingredients}</td>
        <td class="editable" data-field="recipe_directions">${recipe.recipe_directions}</td>
      `;

      // Append the row to the table
      recipeTable.appendChild(row);

      // Now that the row is populated, you can query the cells
      const allCells = row.querySelectorAll("td");

      // Make cells editable on click
      allCells.forEach((cell) => {
        cell.addEventListener("click", function () {
          makeCellEditable(cell);
        });
      });
    });
  }
};


// Function to make a cell editable
const makeCellEditable = function (cell) {
  const originalContent = cell.textContent;
  const fieldName = cell.getAttribute("data-field"); // Assuming you've set this attribute in your HTML
  cell.innerHTML = `<input type="text" value="${originalContent}" />`;
  const input = cell.querySelector("input");
  input.focus();

  // Save changes and revert cell back to non-editable on blur or Enter key press
  input.addEventListener("blur", function () {
    saveChanges(cell, originalContent, input.value, fieldName);
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      saveChanges(cell, originalContent, input.value, fieldName);
    }
  });
};

// Function to save changes
const saveChanges = async function (cell, originalContent, newContent) {
  const row = cell.closest("tr");
  const allCells = row.querySelectorAll("td");

  const updatedRecipeData = {
    original_recipe_name: allCells[0].textContent,
    new_recipe_name: allCells[0].textContent,
    original_recipe_ingredients: allCells[1].textContent,
    new_recipe_ingredients: allCells[1].textContent,
    original_recipe_directions: allCells[2].textContent,
    new_recipe_directions: allCells[2].textContent,
  };

  // Replace the new value for the edited cell
  if (cell === allCells[0]) updatedRecipeData.new_recipe_name = newContent;
  if (cell === allCells[1])
    updatedRecipeData.new_recipe_ingredients = newContent;
  if (cell === allCells[2])
    updatedRecipeData.new_recipe_directions = newContent;

  // Now send this updatedRecipeData object in your fetch call
  try {
    const response = await fetch("/updateRecipe", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRecipeData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
    } else {
      console.error("Error updating recipe:", await response.text());
    }
  } catch (error) {
    console.error("Error updating recipe:", error);
  }

  // Revert the cell back to its original state
  cell.textContent = newContent;
  cell.addEventListener("click", function () {
    makeCellEditable(cell);
  });
};
const displayNoRecipes = function () {
  const recipeTable = document.querySelector("#recipe_table");
  recipeTable.innerHTML = "<tr><td colspan='4'>No recipes found.</td></tr>";
};

const displayError = function (message) {
  const recipeTable = document.querySelector("#recipe_table");
  recipeTable.innerHTML = `<tr><td colspan='4'>${message}</td></tr>`;
};
