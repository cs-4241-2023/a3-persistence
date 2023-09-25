/*
Constants used to keep track of user's total grocery budget and
what they are spending
defaultValue: fixed so prices formatted with two decimal places
totalCost: total cost of groceries
budget: user input budget
remaining: difference between budget and totalCost
*/
let defaultValue = 0;
defaultValue = defaultValue.toFixed(2);
let totalCost = defaultValue;
let budget = defaultValue;
let remaining = defaultValue;

/*
This is a function to handle the submit action in the addItem button
Variables item, quantity, price, productType, and productDetails are
collected from user input
If any of the input values is missing, a validation error will pop
up at the top of the screen stating which field is missing
Json object created using this data and showResults function is called
*/
const submit = async function (event) {
  event.preventDefault();
  const item = document.querySelector("#item");
  const quantity = document.querySelector("#quantity");
  const price = document.querySelector("#price");
  const productType = document.querySelector("#productType");
  const productDetails = document.querySelector("#productDetails");

  //Validation error messages
  if (item.value === "") {
    window.alert("Please fill out item");
    return;
  } else if (quantity.value === "") {
    window.alert("Please fill out quantity");
    return;
  } else if (price.value === "") {
    window.alert("Please fill out price");
    return;
  } else if (productType.value === "") {
    window.alert("Please fill out product type");
    return;
  }

  //Create json object with user input
  const json = {
    item: item.value,
    quantity: quantity.value,
    price: price.value,
    cost: 0,
    productType: productType.value,
    productDetails: productDetails.value,
  };
  const body = JSON.stringify(json);
  const newItem = await fetch("/add", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  });
  let data = await newItem.json();
  console.log("add: " + JSON.stringify(data));

  //Display table of data
  showResults(data, false);
};

/*
Constantly updates the table each time an item is added or removed
If the page is reloaded, all items in the server will still display
Each time an item is added, a new row in the table will appear
When an item is added, the remaining budget and total cost are
adjusted accordingly
*/
const showResults = function (data, pageReloaded) {
  let cost = 0.0; // initial cost for new item
  let resultsTable = document.querySelector("#resultsTable"); // table
  // when page reloaded or item is removed, all items in server
  // must be added back to table
  // add header in table
  resultsTable.innerHTML =
    "<tr><th>Item</th><th>Quantity</th><th>Price</th><th>Cost</th><th>Product Type</th><th>Product Details</th><th>Remove Item</th><th>Update Item</th></tr>";

  data.forEach((item) => {
    console.log("show results: " + JSON.stringify(Object.values(item)));
    formatTable(item, resultsTable);
  });

  totalCost = defaultValue; // reset cost
  // for each item in server, add its cost to totalCost
  data.forEach((item) => {
    cost = parseFloat(item.cost);
    totalCost = (parseFloat(totalCost) + parseFloat(cost)).toFixed(2);
  });

  // update budgets and cost labels
  updateBudgetCostLabels();
};

/*
Updates table
Adds row each time an item is added
Gets the correct attribute value from the json Object element
*/
const formatTable = function (grocery, resultsTable) {
  console.log(resultsTable);
  // get item price and format it to have 2 decimals
  let price = parseFloat(grocery.price).toFixed(2);
  // format strings to have dollar sign
  let priceText = toPriceString(price);
  let costText = toPriceString(grocery.cost);
  // create new row in table
  const row = resultsTable.insertRow();
  const cellItem = row.insertCell(); // create new cell
  cellItem.innerHTML = grocery.item; // add data to cell
  const cellQuantity = row.insertCell(); // create new cell
  cellQuantity.innerHTML = grocery.quantity; // add data to cell
  const cellPrice = row.insertCell(); // create new cell
  cellPrice.innerHTML = priceText; // add data to cell
  const cellCost = row.insertCell(); // create new cell
  cellCost.innerHTML = costText; // add data to cell
  const cellProductType = row.insertCell(); // create new cell
  cellProductType.innerHTML = grocery.productType; // add data to cell
  const cellProductDetails = row.insertCell(); // create new cell
  cellProductDetails.innerHTML = grocery.productDetails; // add data to cell
  // in last column, create a button to remove items
  row.innerHTML += "<td>" + `<button id="removeButton" onclick="remove(\'${grocery._id}\')">Remove</button>` + "</td>";
  row.innerHTML += "<td>" + `<button id="updateButton" onclick="update(\'${grocery._id}\')">Update</button>` + "</td>";
};

/*
This is a function to handle the remove action in the removeItem button
When an item is removed, the table is automatically updated along
with the total cost label and remaining budget label
When all items are removed, the table should just show the header
*/
const remove = async function (item) {
  let json = { removeId: item };
  let body = JSON.stringify(json);
  const response = await fetch("/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _id: json.removeId }),
  });
  const data = await response.json();
  console.log("remove: " + json.removeId);
  console.log("after removal: " + data);

  //Display table of data
  showResults(data, false);
};

const update = async function (id) {
  const item = document.querySelector("#item");
  const quantity = document.querySelector("#quantity");
  const price = document.querySelector("#price");
  const productType = document.querySelector("#productType");
  const productDetails = document.querySelector("#productDetails");
  
  const newData = {
    updateId: id,
    item: item.value,
    quantity: quantity.value,
    price: price.value,
    cost: 0,
    productType: productType.value,
    productDetails: productDetails.value,
  };
  
  let body = JSON.stringify(newData);
  const updatedItem = await fetch("/update", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  });
  const data = await updatedItem.json();
  console.log("update: " + newData.updateId);
  console.log("after update: " + JSON.stringify(data));

  //Display table of data
  showResults(data, false);
};

/*
Formats strings so they have a dollar sign, negative sign if
applicable, and two decimal places
*/
const toPriceString = function (price) {
  if (price >= 0) {
    return "$" + `${price.toString()}`;
  } else {
    return "-$" + `${(price * -1).toString()}`;
  }
};

/*
Allows user to create or modify budget for entire shopping trip
*/
const addBudget = function () {
  // get budget input by user
  let budgetInput = document.querySelector("#budgetInput").value;
  // format budget so it is a float with 2 decimal places
  budget = parseFloat(budgetInput).toFixed(2);
  // if budget is not a number, reset remaining budget to 0
  if (isNaN(budget)) {
    remaining = defaultValue;
  }
  // if budget is not a number, set to 0; otherwise set to budget
  budget = isNaN(budget) ? defaultValue : budget;
  // update labels
  updateBudgetCostLabels();
};

/*
Update the labels for the total budget, total cost, and remaining
budget for the grocery trip
*/
const updateBudgetCostLabels = function () {
  // get labels
  let totalBudgetLabel = document.querySelector("#totalBudget");
  let totalCostLabel = document.querySelector("#totalCost");
  let remainingBudgetLabel = document.querySelector("#remainingBudget");
  // if budget is not 0, update the remaining budget
  if (budget != 0) {
    remaining =
      isNaN(budget) || isNaN(totalCost) ? defaultValue : budget - totalCost;
    remaining = remaining.toFixed(2);
  }
  // update labels
  totalBudgetLabel.innerHTML = "Total Budget: " + toPriceString(budget);
  totalCostLabel.innerHTML = "Total Cost: " + toPriceString(totalCost);
  remainingBudgetLabel.innerHTML =
    "Remaining Budget: " + toPriceString(remaining);
};

window.onload = function () {
  const addItem = document.querySelector("#addItem");
  const removeItem = document.querySelector("#removeItem");
  addItem.onclick = submit;
  fetch("/data", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((json) => {
      showResults(json, true);
    });
};
