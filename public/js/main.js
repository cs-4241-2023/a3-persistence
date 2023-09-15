let editingExpense = null;
let isEditMode = false;
let githubId = '';

const headers = {
    'Content-Type': 'application/json',
    'GitHub-ID': githubId
};

async function populateGitHubId() {
    try {
        const response = await fetch('/user-info', { method: 'GET', headers });
        if (!response.ok) throw new Error(response.statusText);

        const userData = await response.json();
        githubId = userData.githubId;
        console.log('GitHub ID:', githubId);
    } catch (error) {
        console.error('Failed to fetch user information:', error);
    }
}

function toggleView() {
    isEditMode = !isEditMode;
    const toggleDisplay = (id, value) => document.getElementById(id).style.display = value;
    toggleDisplay('addExpenseSection', isEditMode ? 'none' : 'block');
    toggleDisplay('updateExpenseSection', isEditMode ? 'block' : 'none');
    
    const updateButton = document.getElementById('update');
    updateButton.textContent = isEditMode ? 'Update Changes' : 'Add Expense';
}

const handleSubmit = (handler) => async (event) => {
    event.preventDefault();
    try {
        await handler();
    } catch (error) {
        console.error(error);
    }
};

async function add() {
    try {
        await submitExpense('/add', '#name', '#amount', '#category');
        alert('Expense added successfully');
    } catch (error) {
        console.error(error);
        alert('Failed to add expense: ' + error.message);
    }
}

async function updateExpense() {
    try{
        await submitExpense('/update', '#newName', '#newAmount', '#newCategory', '#oldName');
        alert('Expense updated successfully');
    } catch (error) {
        console.error(error);
        alert('Failed to update expense: ' + error.message);
    }
}

async function submitExpense(url, nameSel, amountSel, categorySel, oldNameSel) {
    const getValue = (selector) => document.querySelector(selector).value;
    const clearValue = (selector) => document.querySelector(selector).value = '';
    
    const name = getValue(nameSel);
    const amount = parseFloat(getValue(amountSel));
    const category = getValue(categorySel);

    if ([name, amount, category].some(val => val === '')) {
        return alert('Please fill out all fields');
    }

    const json = { name, amount, category };
    if(oldNameSel) json.oldName = getValue(oldNameSel);

    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(json) });
    if (response.status === 400) {
        const errorResponse = await response.json();
        return alert(errorResponse.error);
    }

    const data = await response.json();

    [nameSel, amountSel, categorySel].forEach(clearValue);
    if(oldNameSel) clearValue(oldNameSel);

    if (isEditMode) toggleView();

    updateExpenseList(data);
}

async function updateExpenseList(data) {
    const list = document.getElementById('expense-list');
    list.innerHTML = '';
    const {expenses, remainingBudget} = data;

    expenses.forEach(expense => {
        const item = document.createElement('li');
        item.className = 'list-group-item text-white d-flex flex-column align-items-center';
        item.style.backgroundColor = '#333';
        item.style.marginBottom = '10px';
        item.innerHTML = `
            <div class="text-center">
                <p>Expense: ${expense.name}</p>
                <p>Amount: ${expense.amount}</p>
                <p>Category: ${expense.category}</p>
                <p>Remaining Budget: ${remainingBudget}</p>
            </div>
            <div>
                <button class="btn btn-primary btn-sm" data-expense-name="${expense.name}">Edit</button>
                <button class="btn btn-danger btn-sm" data-expense-name="${expense.name}">Delete</button>
            </div>
        `;
        list.appendChild(item);
    });

    document.querySelectorAll('.btn.btn-danger.btn-sm').forEach(button => button.addEventListener('click', deleteExpense));
    document.querySelectorAll('.btn.btn-primary.btn-sm').forEach(button => button.addEventListener('click', editExpense));
}

const deleteExpense = async function (event) {
    const expenseName = event.target.dataset.expenseName;

    if (editingExpense === expenseName) {
        editingExpense = null;
    }

    const response = await fetch('/delete', { method: 'POST', headers, body: JSON.stringify({ action: 'delete', name: expenseName }) });
    const data = await response.json();
    updateExpenseList(data);
    alert('Expense deleted');
};

const editExpense = async function (event) {
    const expenseName = event.target.dataset.expenseName;
    try {
        const response = await fetch('/getExpense', { method: 'POST', headers, body: JSON.stringify({ name: expenseName }) });
        if (!response.ok) throw new Error(response.statusText);

        const edit = await response.json();
        const setValue = (selector, value) => document.querySelector(selector).value = value;
        setValue('#newName', edit.name);
        setValue('#newAmount', edit.amount);
        setValue('#newCategory', edit.category);
        setValue('#oldName', edit.name);

        editingExpense = expenseName;

        if (!isEditMode) {
            toggleView();
        }
    } catch (error) {
        console.error('Error while retrieving expense:', error);
    }
};

window.onload = async function () {
    populateGitHubId();
    
    document.querySelector('#add').onclick = handleSubmit(add);
    document.querySelector('#update').onclick = handleSubmit(updateExpense);

    /*
    document.getElementById('logout').addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', { method: 'GET', headers });
            if (response.status !== 200) throw new Error(response.statusText);
            window.location.href = '/auth/github';
        } catch (error) {
            console.error('Error while logging out:', error);
        }
    });
    */

    document.getElementById('toggleViewButton').addEventListener('click', toggleView);
    document.getElementById('toggleViewButton2').addEventListener('click', toggleView);

    const response = await fetch('/fetch', { method: 'GET', headers });
    const data = await response.json();
    updateExpenseList(data);
};