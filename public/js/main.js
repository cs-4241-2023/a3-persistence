// FRONT-END (CLIENT) JAVASCRIPT HERE
let taskData = [];
let currentNote = 0;
let counter = 0;

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const form = document.querySelector("form");
  const body = parseForm(form);

  if(body.title === "") {
    alert("Please add a title");
    return
  }

  let edit = { ...body, id: currentNote };

  const response = await fetch("/submit", {
    method: "POST",
    body: JSON.stringify(edit),
  });

  const text = await response.text();
  taskData = JSON.parse(text);

  loadTasks();
};

window.onload = async function () {
  const button = document.querySelector("#save");
  button.onclick = submit;

  const response = await fetch("/init", {
    method: "POST",
    body: JSON.stringify("test"),
  });

  const text = await response.text();
  taskData = JSON.parse(text);
  loadTasks();
};

// collect form data and create an object that will be passed to the server
function parseForm(formData) {
  let body = {};
  Object.keys(formData).forEach((key) => {
    let element = formData.elements[key];
    if (
      element.type !== "submit" &&
      element.type !== "button" &&
      element.type !== "select"
    ) {
      body[element.name] = element.value;
    } else if (element.type === "select") {
    }
  });
  return body;
}

function loadTasks() {
  const sidebar = document.getElementById("sidebar");

  // Clear the sidebar so we don't get any side effects
  sidebar.innerHTML = "";
  const title = document.getElementById("task-title");
  const date = document.getElementById("task-date");
  const dueDate = document.getElementById("due-date");
  const priority = document.getElementById("task-priority");
  const description = document.getElementById("task-body");

  // Iterate through the new data recieved
  taskData.forEach((task) => {
    // Create a new div object
    let newTask = document.createElement("div");

    // If program was just initialized/we are changing task, as we iterate keep the same task highlighted
    if (currentNote === 0 || task.id === currentNote) {
      // When we get to the currently selected task, populate form with the data of the task
      newTask.className = "tasks-list--task selected";
      currentNote = task.id;
      title.value = task.title;
      date.value = task.date;
      dueDate.value = task.dueDate;
      priority.value = task.priority;
      description.value = task.description;
    } else {
      // Else we style the non-selected buttons the same
      newTask.className = "tasks-list--task";
    }
    // Add title and id to the html-object (definitely not the best way of doing this)
    newTask.innerText = task.title;
    newTask.id = task.id;

    // Add an event listener to swap notes
    newTask.addEventListener("click", async (event) => {
      // Get the current task and change its class so it isn't selected
      document.getElementById(currentNote).className = "tasks-list--task";

      // Make the form fields match the values of the task in the database
      currentNote = event.target.id;

      // Make the new selected task look selected
      event.target.className = "tasks-list--task selected";
      const taskID = await findTask(currentNote);
      title.value = taskID.title;
      date.value = taskID.date;
      dueDate.value = taskID.dueDate;
      priority.value = taskID.priority;
      description.value = taskID.description;
    });

    // Add the task to the sidebar
    sidebar.appendChild(newTask);

    generateTable();
  });

  // Finally add the add task button to the sidebar
  const form = document.querySelector("form");
  let newTask = document.createElement("div");
  newTask.innerText = "Make a new note!";

  // Add onclick event to div
  newTask.addEventListener("click", async (event) => {
    // Send a request for a new task
    const response = await fetch("/new", {
      method: "POST",
      body: JSON.stringify("make a new note"),
    });

    const text = await response.text();

    taskData = JSON.parse(text);

    currentNote = taskData.slice(-1)[0].id;

    form.reset();
    loadTasks();
  });
  newTask.className = "tasks-list--new";
  sidebar.appendChild(newTask);
}

// Function to find a note within the array given an id
async function findTask(id) {
  let returnTask = null;
  taskData.forEach((task) => {
    if (task.id === id) {
      returnTask = task;
    }
  });
  return returnTask;
}

// Function to delete a note
async function deleteTask() {
  const noteToDelete = await findTask(currentNote);

  const response = await fetch("/delete", {
    method: "POST",
    body: JSON.stringify(noteToDelete),
  });

  const text = await response.text();
  taskData = JSON.parse(text);

  // Need to now default to 0 since the current note is now gone (can default to something else but lazy)
  currentNote = 0;

  loadTasks();
}

async function editNote() {
  const noteToEdit = await findTask(currentNote);

  const response = await fetch("/edit", {
    method: "POST",
    body: JSON.stringify(noteToEdit),
  });

  const text = await response.text();
  taskData = JSON.parse(text);

  loadTasks();
}

function generateTable() {
  const tablebody = document.getElementById("tablebody");
  tablebody.innerHTML = "";
  Object.keys(taskData).forEach((taskKey) => {
    let newRow = document.createElement("tr");
    let idCell = newRow.insertCell(0);
    let titleCell = newRow.insertCell(1);
    let dateCell = newRow.insertCell(2);
    let dueDateCell = newRow.insertCell(3);
    let priorityCell = newRow.insertCell(4);
    let descriptionCell = newRow.insertCell(5);
    Object.keys(taskData[taskKey]).forEach((key, index) => {
      switch (key) {
        case "id":
          idCell.innerHTML = taskData[taskKey][key];
          break;
        case "title":
          titleCell.innerHTML = taskData[taskKey][key];
          break;
        case "date":
          dateCell.innerHTML = taskData[taskKey][key];
          break;
        case "dueDate":
          dueDateCell.innerHTML = taskData[taskKey][key];
          break;
        case "priority":
          priorityCell.innerHTML = taskData[taskKey][key];
          break;
        case "description":
          descriptionCell.innerHTML = taskData[taskKey][key];
          break;
      }
    });
    tablebody.appendChild(newRow)
  });
}
