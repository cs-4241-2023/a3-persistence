let username;
const submit = async (event, _id) => {
  event.preventDefault();

  let taskInput = document.getElementById("task");
  let descInput = document.getElementById("description");

  const task = taskInput.value;
  const desc = descInput.value;
  let dueDate = new Date(
    document.getElementById("dueDate").value
  ).toLocaleDateString("en-US");

  taskInput.value = "";
  descInput.value = "";

  const json = {
    username: username,
    task: task,
    desc: desc,
    dueDate: dueDate,
  };
  const body = JSON.stringify(json);

  const submitButton = document.getElementById("submitButton");
  if (submitButton.textContent == "Submit Task") {
    try {
      const response = await fetch("/tasks", {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        fetchTasks();
        taskInput.value = "";
        descInput.value = "";
      } else {
        throw new Error("Failed to submit task");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  } else if (submitButton.textContent == "Edit Task") {
    try {
      const response = await fetch(`/tasks/${_id}`, {
        method: "PUT",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      fetchTasks();
      taskInput.value = "";
      descInput.value = "";
      const updatedResource = await response.json();
      console.log("Updated resource:", updatedResource);
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  }
};

const daysBetween = (date1, date2) => {
  const utcDate1 = Date.UTC(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate()
  );
  const utcDate2 = Date.UTC(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate()
  );
  return Math.floor((utcDate2 - utcDate1) / (1000 * 60 * 60 * 24));
};

const priorityCalculator = dueDate => {
  const today = new Date();
  const dateDiff = daysBetween(today, new Date(dueDate));
  let priority = "P1";

  if (dateDiff > 7) {
    priority = "P3";
  } else if (dateDiff > 2) {
    priority = "P2";
  }
  return priority;
};

const deleteTask = async _id => {
  try {
    const deleteResponse = await fetch(`/tasks/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (deleteResponse.ok) {
      fetchTasks();
    } else if (deleteResponse.status === 404) {
      console.error("Task not found");
    } else {
      console.error("Failed to delete task");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

const editTask = async taskObject => {
  const taskInput = document.getElementById("task");
  const descInput = document.getElementById("description");
  const dateInput = document.getElementById("dueDate");
  const button = document.getElementById("submitButton");
  taskInput.value = taskObject.task;
  descInput.value = taskObject.desc;
  dateInput.value = taskObject.date;
  button.textContent = "Edit Task";

  const submitWithId = e => {
    submit(e, taskObject._id);
    button.textContent = "Submit Task";
  };

  button.onclick = submitWithId;
};

const createHeaderRow = () => {
  const header = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = ["Task", "Description", "Due Date", "Priority", "Buttons"];
  headers.forEach(text => {
    const headerCell = document.createElement("th");
    headerCell.textContent = text;
    headerRow.appendChild(headerCell);
  });

  header.appendChild(headerRow);
  return header;
};

const createButtons = taskObject => {
  const cell = document.createElement("td");

  const editButton = document.createElement("button");
  editButton.classList.add("mr-2", "taskButton", "btn", "btn-dark");
  editButton.textContent = "Edit";
  editButton.onclick = () => {
    editTask(taskObject);
  };

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("taskButton", "btn", "btn-dark");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = () => {
    deleteTask(taskObject._id);
  };

  cell.append(editButton, deleteButton);
  return cell;
};

const createRow = (task, desc, dueDate, priority, taskObject) => {
  let row = document.createElement("tr");

  row.append(createCell(task));
  row.append(createCell(desc));
  row.append(createCell(dueDate));
  row.append(createCell(priority));
  row.append(createButtons(taskObject));

  return row;
};

const createCell = data => {
  const cell = document.createElement("td");
  cell.classList.add("align-middle");
  cell.textContent = data;
  return cell;
};

// Manages creation of table elements using data from server
const getTasks = data => {
  const table = document.querySelector("table");
  table.replaceChildren();
  table.append(createHeaderRow());
  data.forEach(taskObject => {
    let row = createRow(
      taskObject.task,
      taskObject.desc,
      taskObject.dueDate,
      priorityCalculator(taskObject.dueDate),
      taskObject
    );
    table.append(row);
  });
};

// Helper function to fetch tasks from server and display them in a table
const fetchTasks = async () => {
  try {
    const fetchResponse = await fetch(`/tasks/${username}`, { method: "GET" });

    if (fetchResponse.ok) {
      const data = await fetchResponse.json();
      getTasks(data);
    } else {
      throw new Error("Fetch request failed");
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

window.onload = function () {
  const loggedIn = localStorage.getItem("loggedIn");
  if (!loggedIn) {
    window.location = "index.html";
  }
  username = localStorage.getItem("username");
  fetchTasks();

  const submitButton = document.getElementById("submitButton");
  const submitWithId = e => {
    submit(e, null);
  };
  submitButton.onclick = submitWithId;
};
