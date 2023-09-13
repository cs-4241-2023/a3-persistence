// Get current date and first day of month
const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

// Set month names
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function populateExpenseList(data) {
    const tbody = document.querySelector("#expenseList tbody");
    let thisMonthCost = 0;
    tbody.innerHTML = "";
    let totalCost = 0;
    let currentMonth = '';

    // Sort data by date in ascending order
    data.sort((a, b) => {
        const dateA = new Date(a.Date);
        const dateB = new Date(b.Date);
        return dateB - dateA;
    });

    // Calculate time elapsed
    const firstDate = new Date(data[0].Date);
    const lastDate = new Date(data[data.length - 1].Date);
    const timeElapsed = Math.abs(lastDate - firstDate);

    data.forEach((expense, index) => {
        const expenseDate = new Date(expense.Date);
        const expenseMonth = expenseDate.getMonth();

        // Add a summary row for the previous month
        if (currentMonth !== '' && currentMonth !== expenseMonth) {
            createSummaryRow(tbody, `Total for ${MONTH_NAMES[currentMonth]}`, thisMonthCost, null);
            thisMonthCost = 0;
        }

        createExpenseRow(tbody, expense);
        totalCost += parseFloat(expense.Cost);
        thisMonthCost += parseFloat(expense.Cost);

        currentMonth = expenseMonth;
    });

    // Add a summary row for the last month
    if (currentMonth !== '') {
        createSummaryRow(tbody, `Total for ${MONTH_NAMES[currentMonth]}`, thisMonthCost, null);
    }

    // Add a row for the total cost
    createSummaryRow(tbody, "Total", totalCost, timeElapsed);
}

// Helper function to put the row into an editable state
function editExpense(expense, row) {
    const cells = row.cells;

    const itemInput = document.createElement("input");
    itemInput.type = "text";
    itemInput.value = expense.Item;

    const costInput = document.createElement("input");
    costInput.type = "number";
    costInput.value = expense.Cost;

    cells[0].innerHTML = "";
    cells[0].appendChild(itemInput);

    cells[1].innerHTML = "";
    cells[1].appendChild(costInput);

    const saveButton = document.createElement("button");
    saveButton.className = "btn-small waves-effect waves-light save-button";
    saveButton.textContent = "Save";
    saveButton.onclick = function () {
        window.saveExpense(expense, itemInput.value, costInput.value);
    };

    cells[3].innerHTML = "";
    cells[3].appendChild(saveButton);
}

// Helper function to create an expense row
function createExpenseRow(tbody, expense) {
    const row = tbody.insertRow();
    const cellItem = row.insertCell(0);
    const cellCost = row.insertCell(1);
    const cellDate = row.insertCell(2);
    const cellAction = row.insertCell(3);

    cellItem.textContent = expense.Item;
    cellDate.textContent = formatDate(expense.Date);
    cellCost.textContent = `$${parseFloat(expense.Cost).toFixed(2)}`;
    cellCost.style.textAlign = "center";

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn-small waves-effect waves-light delete-button";
    deleteButton.style.fontWeight = "bold";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        deleteExpense(expense);
    };

    const editButton = document.createElement("button");
    editButton.className = "btn-small waves-effect waves-light edit-button";
    editButton.style.fontWeight = "bold";
    editButton.textContent = "Edit";
    editButton.onclick = function () {
        editExpense(expense, row);
    };
    cellAction.appendChild(editButton);
    cellAction.appendChild(deleteButton);
    cellAction.style.textAlign = "center";
}

// Helper function to create a summary row
function createSummaryRow(tbody, label, cost, timeElapsed) {
    const row = tbody.insertRow();
    row.style.backgroundColor = "#f2f2f2";

    const cellItem = row.insertCell(0);
    const cellCost = row.insertCell(1);
    const cellDate = row.insertCell(2);

    cellItem.textContent = label;
    cellItem.style.fontWeight = "700";
    cellDate.textContent = timeElapsed ? formatTimeElapsed(timeElapsed) : "";
    cellDate.style.textAlign = "center";
    cellDate.style.fontWeight = "700";
    cellCost.textContent = `$${cost.toFixed(2)}`;
    cellCost.style.textAlign = "center";
    cellCost.style.fontWeight = "700";

    // Empty cell for alignment
    row.insertCell(3);
}

// Helper function to format time elapsed
function formatTimeElapsed(timeElapsed) {
    const daysElapsed = timeElapsed / (1000 * 60 * 60 * 24);
    const weeksElapsed = Math.floor(daysElapsed / 7);
    const monthsElapsed = Math.ceil(daysElapsed / 30);

    if (monthsElapsed > 0) {
        return `${monthsElapsed} months`;
    } else if (weeksElapsed > 0) {
        return `${weeksElapsed} weeks`;
    } else {
        return `${daysElapsed.toFixed(0)} days`;
    }
}

// Helper function to format the date as MM/DD/YYYY
function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
}