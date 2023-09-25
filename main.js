let currentUsername = null;

function addTask() {
    const taskInput = document.getElementById('new-task-name');
    const taskDateInput = document.getElementById('new-task-date');
    const taskPriorityInput = document.getElementById('new-task-priority');
    const taskText = taskInput.value.trim();
    const taskDate = taskDateInput.value;
    const taskPriority = taskPriorityInput.value;

    if (taskText !== '' && taskDate !== '') {
        const task = {
            text: taskText,
            completed: false,
            creation_date: taskDate,
            priority: taskPriority,
            username: currentUsername
        };

        fetch('/appdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(loadTasks);
    } else {
        alert('Please enter a task and a creation date.');
    }
}

function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username && password) {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.isAuthenticated) {
                currentUsername = data.username;
                document.getElementById('user-name').textContent = currentUsername;
                document.getElementById('login-box').style.display = 'none';
                document.getElementById('welcome-section').classList.remove('d-none');
                loadTasks();
            } else {
                alert('Incorrect password.');
            }
        });
    } else {
        alert('Please enter a username and password.');
    }
}

function toggleTaskCompletion(taskIndex, isCompleted) {
    fetch(`/appdata/${taskIndex}/completion`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: isCompleted, username: currentUsername })  
    })
    .then(response => response.json())
    .then(loadTasks);
}


const editTask = (taskIndex) => {
    const newTaskText = prompt('Edit task text:');
    const newPriority = prompt('Edit task priority (high/medium/low):');
    const newDate = prompt('Edit task date (YYYY-MM-DD):');
    if (newTaskText && newPriority && newDate) {
        fetch(`/appdata/${taskIndex}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: newTaskText,
                priority: newPriority,
                creation_date: newDate,
                username: currentUsername
            })
        })
        .then(response => response.json())
        .then(loadTasks);
    }
};


function logout() {
    currentUsername = null;
    document.getElementById('login-box').style.display = 'block';
    document.getElementById('welcome-section').classList.add('d-none');
    location.reload();
}
function deleteTask(taskIndex) {
    return fetch(`/appdata/${taskIndex}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentUsername })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.warn("Server responded with failure:", data.message);
        }
        loadTasks();
    })
    .catch(err => console.error("Error while deleting task:", err));
}


function addTaskToDOM(task, index) {
    const taskList = document.getElementById('task-list');
    const newTaskItem = document.createElement('div');
    newTaskItem.classList.add('task-item');

    if (task.priority === "high") {
        newTaskItem.style.backgroundColor = "red";
    } else if (task.priority === "medium") {
        newTaskItem.style.backgroundColor = "orange";
    } else {
        newTaskItem.style.backgroundColor = "green";
    }

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        deleteTask(index);
    });
    newTaskItem.appendChild(deleteButton);

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
        toggleTaskCompletion(index, checkbox.checked);
    });
    newTaskItem.appendChild(checkbox);

    // Task Text
    const taskText = document.createElement('span');
    taskText.classList.add('task-text');
    const formattedDate = new Date(task.creation_date).toLocaleDateString('en-US');
    taskText.textContent = `${task.text} (${formattedDate})`;
    newTaskItem.appendChild(taskText);

    // Edit Button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        editTask(index);
    });
    newTaskItem.appendChild(editButton);

    taskList.appendChild(newTaskItem);
}

function loadTasks() {
    fetch(`/appdata?username=${currentUsername}`)
    .then(response => response.json())
    .then(data => {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        data.forEach((task, index) => {
            addTaskToDOM(task, index);
        });
    });
}

window.onload = loadTasks;
