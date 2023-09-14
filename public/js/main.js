// Create function to get expenses
async function getExpenses() {
  try {
    const response = await fetch("/api/expenses", { method: "GET" });
    const data = await response.json();
    populateExpenseList(data.expenses);
  } catch (error) {
    console.error("Error fetching expenses: ", error);
  }
}

// Attach to the render function
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("expenseForm");
  const fetchExpensesBtn = document.getElementById("fetchExpensesBtn");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const item = document.getElementById("expense").value;
    let cost = document.getElementById("cost").value;
    cost = parseFloat(cost).toFixed(2);

    fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Item: item, Cost: cost, Date: new Date().toISOString() }),
    }).then(response => response.json())
      .then(() => getExpenses());

    document.getElementById("expense").value = "";
    document.getElementById("cost").value = "";
  });

  // Add delete event
  window.deleteExpense = function (expense) {
    fetch(`/api/expenses`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: expense._id })
    }).then(response => response.json())
      .then(() => getExpenses());
  };

  // Add save event
  window.saveExpense = function (expense, newItem, newCost) {
    const updatedExpense = {
      _id: expense._id,
      Item: newItem,
      Cost: parseFloat(newCost).toFixed(2),
      Date: expense.Date
    };

    fetch(`/api/expenses`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedExpense)
    })
      .then(response => response.json())
      .then(() => getExpenses());
  };

  // Add refresh button click event
  fetchExpensesBtn.addEventListener("click", getExpenses);

  // On load populate the list
  getExpenses();
});