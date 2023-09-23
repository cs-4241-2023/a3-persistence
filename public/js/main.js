// Function to fetch tasks from the server
const fetchTasks = async function () {
  try {
    const response = await fetch("/tasks");
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const tasks = await response.json();
    displayTasks(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

const displayTasks = function (tasks) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Clear the existing list

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");

    // Create a div to contain task details (including description)
    const taskDetails = document.createElement("div");
    taskDetails.classList.add("task-details");

    const taskName = document.createElement("span");
    taskName.textContent = `Task: ${task.task}`;

    const taskDescription = document.createElement("span");
    taskDescription.textContent = `Description: ${task.description}`;

    const dueDate = document.createElement("span");
    dueDate.textContent = `Due Date: ${task.dueDate}`;

    const priority = document.createElement("span");
    priority.textContent = `Priority: ${task.priority}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    // Add an event listener to the delete button
    deleteButton.addEventListener("click", () => {
      // Call a function to handle task deletion (you need to implement this)
      handleDeleteTask(task.id); // Pass the task ID to the handler
      // Remove the task item from the DOM
      taskList.removeChild(listItem);
    });

    // Append elements to the task details div
    taskDetails.appendChild(taskName);
    taskDetails.appendChild(taskDescription);
    taskDetails.appendChild(dueDate);
    taskDetails.appendChild(priority);
    taskDetails.appendChild(deleteButton); // Append the delete button here

    // Append the task details div to the task item
    listItem.appendChild(taskDetails);

    taskList.appendChild(listItem);
  });
};

const handleDeleteTask = async (taskId) => {
  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    // Refresh the task list from the server
    fetchTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

const submit = async function (event) {
  event.preventDefault();

  const inputTaskName = document.querySelector("#task-input");
  const inputTaskDescription = document.querySelector("#task-description"); // Add this line
  const dueDateInput = document.querySelector("#due-date");
  const prioritySelect = document.querySelector("#priority");

  // Check if any of the queried elements are null before accessing their values
  if (
    !inputTaskName ||
    !inputTaskDescription ||
    !dueDateInput ||
    !prioritySelect
  ) {
    console.error("One or more form elements not found.");
    return;
  }

  const json = {
    task: inputTaskName.value,
    description: inputTaskDescription.value, // Send the task description
    dueDate: dueDateInput.value,
    priority: prioritySelect.value,
  };
  const body = JSON.stringify(json);

  const response = await fetch("/submit", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    // If the task was added successfully, fetch and display the updated list of tasks
    fetchTasks();
    inputTaskName.value = ""; // Clear the input field for task name
    inputTaskDescription.value = ""; // Clear the input field for task description
  } else {
    console.error("Failed to add task");
  }
};

// Fetch and display tasks when the page loads
window.onload = function () {
  const button = document.querySelector("button");
  button.onclick = submit;

  // Fetch and display tasks from the server
  fetchTasks();
};
