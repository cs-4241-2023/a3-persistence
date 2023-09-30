// FRONT-END (CLIENT) JAVASCRIPT HERE

let currentEditId = null; // global variable to store the id of the task being edited

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const form = document.querySelector("#addTaskForm");
  const formData = new FormData(form);
  // get all fields in variables
  const taskName = formData.get("taskName");
  const taskDescription = formData.get("taskDescription");
  const taskDeadline = formData.get("taskDeadline");
  const taskPriority = formData.get("taskPriority");
  const taskCreated = new Date().toISOString().slice(0, 10);
  console.log("taskCreated: ", taskCreated);

  const json = {
    taskName,
    taskDescription,
    taskDeadline,
    taskPriority,
    taskCreated,
  };

  const response = await fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error submitting task:", errorData.message);
    return;
  }

  const text = await response.text();
  tasks = JSON.parse(text);
  console.log("new tasks list: ", tasks);
  updateTaskTable(tasks);
};

const updateTaskTable = function (tasks) {
  const table = document.getElementById("tasksTable");
  // clear the current rows
  let rows = document.querySelectorAll("table tr");

  rows.forEach(function (row) {
    if (row !== rows[0]) {
      row.remove();
    }
  });

  for (let i = 0; i < tasks.length; i++) {
    const currentTask = tasks[i];
    // create a new cell for each field
    const taskNameCell = document.createElement("td");
    const taskDescriptionCell = document.createElement("td");
    const taskCreatedCell = document.createElement("td");
    const taskDeadlineCell = document.createElement("td");
    const taskPriorityCell = document.createElement("td");
    const taskTotalTimeCell = document.createElement("td");
    const taskTimeRemainingCell = document.createElement("td");
    const taskDeleteCell = document.createElement("td");
    const taskEditCell = document.createElement("td");
    // add the text to each cell
    taskNameCell.innerText = currentTask.taskName;
    taskDescriptionCell.innerText = currentTask.taskDescription;
    taskCreatedCell.innerText = currentTask.taskCreated;
    taskDeadlineCell.innerText = currentTask.taskDeadline;
    taskPriorityCell.innerText = currentTask.taskPriority;
    taskTotalTimeCell.innerText = currentTask.totalTime;
    if (currentTask.timeRemaining < 0) {
      taskTimeRemainingCell.innerText = "OVERDUE";
    } else {
      taskTimeRemainingCell.innerText = currentTask.timeRemaining;
    }
    taskDeleteCell.innerHTML = `<button class="delete-btn" onclick="deleteTask('${currentTask._id}')">X</button>`;
    taskEditCell.innerHTML = `<button class="edit-btn" onclick="editTask('${currentTask._id}')">Edit</button>`;
    // append each cell to the row
    const currentRow = document.createElement("tr");
    currentRow.appendChild(taskNameCell);
    currentRow.appendChild(taskDescriptionCell);
    currentRow.appendChild(taskCreatedCell);
    currentRow.appendChild(taskDeadlineCell);
    currentRow.appendChild(taskPriorityCell);
    currentRow.appendChild(taskTotalTimeCell);
    currentRow.appendChild(taskTimeRemainingCell);
    currentRow.appendChild(taskDeleteCell);
    currentRow.appendChild(taskEditCell);
    // append the row to the table
    table.appendChild(currentRow);
  }
};

const editTask = function (id) {
  const taskToEdit = tasks.find((task) => task._id === id);
  if (!taskToEdit) {
    console.log("Error: task to edit not found.");
    return;
  }
  // populate the form fields with current values
  document.querySelector('input[name="taskName"]').value = taskToEdit.taskName;
  document.querySelector('textarea[name="taskDescription"]').value =
    taskToEdit.taskDescription;
  document.querySelector('input[name="taskDeadline"]').value =
    taskToEdit.taskDeadline;
  document.querySelector('select[name="taskPriority"]').value =
    taskToEdit.taskPriority;

  // change the submit button text to "Update Task"
  document.getElementById("addTaskFormSubmitBtn").innerText = "Update Task";

  currentEditId = id; // set the global edit id

  // change the submit button onclick listener
  document.getElementById("addTaskFormSubmitBtn").onclick =
    updateTaskOnClickListener;
};

const updateTaskOnClickListener = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const form = document.querySelector("#addTaskForm");
  const formData = new FormData(form);
  // get all fields in variables
  const taskName = formData.get("taskName");
  const taskDescription = formData.get("taskDescription");
  const taskDeadline = formData.get("taskDeadline");
  const taskPriority = formData.get("taskPriority");
  const taskCreated = new Date().toISOString().slice(0, 10);
  console.log("taskCreated: ", taskCreated);

  const json = {
    id: currentEditId,
    taskName,
    taskDescription,
    taskDeadline,
    taskPriority,
    taskCreated,
  };

  const response = await fetch("/updateTask", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error updating task:", errorData.message);
    return;
  }

  const text = await response.text();
  tasks = JSON.parse(text);
  console.log("new tasks list: ", tasks);
  updateTaskTable(tasks);

  // reset the form
  document.getElementById("addTaskFormSubmitBtn").onclick = submit;
  document.getElementById("addTaskFormSubmitBtn").innerText = "Add Task";
  document.getElementById("addTaskForm").reset();
};

const deleteTask = async function (id) {
  const response = await fetch("/deleteTask", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error deleting task:", errorData.message);
    return;
  }

  const text = await response.text();
  tasks = JSON.parse(text);
  console.log("new tasks list: ", tasks);
  updateTaskTable(tasks);
};

const initializeTable = async function () {
  const response = await fetch("/getTasks", {
    method: "GET",
  });

  const text = await response.text();

  tasks = JSON.parse(text);
  updateTaskTable(tasks);
  console.log("tasks list: ", tasks);
};

window.onload = function () {
  initializeTable();
  const button = document.getElementById("addTaskFormSubmitBtn");
  button.onclick = submit;
};
