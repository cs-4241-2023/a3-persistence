// Collects the data in form inputs and sends it to the server to create a new task
const submit = async (event, id = null) => {
  event.preventDefault();

  let taskInput = document.getElementById("task");
  const task = taskInput.value;
  taskInput.value = "";

  let descInput = document.getElementById("description");
  const desc = descInput.value;
  descInput.value = "";

  let dueDate = new Date(
    document.getElementById("dueDate").value
  ).toLocaleDateString("en-US");

  const json = { id, task, desc, dueDate };
  const body = JSON.stringify(json);

  const submitButton = document.getElementById("submitButton");

  if (submitButton.textContent == "Submit Task") {
    try {
      const response = await fetch("/submit", {
        method: "POST",
        body,
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
      const response = await fetch("/", {
        method: "PUT",
        body: body,
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

// Uses fetch to delete a task instance from server, returns error if task deletion goes wrong
const deleteTask = async task => {
  const jsonString = JSON.stringify(task);

  try {
    const deleteResponse = await fetch("/json", {
      method: "DELETE",
      body: jsonString,
    });

    if (deleteResponse.status === 200) {
      fetchTasks();
    } else {
      throw new Error("Failed to delete task");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

const editTask = async task => {
  const taskInput = document.getElementById("task");
  const descInput = document.getElementById("description");
  const dateInput = document.getElementById("dueDate");
  const button = document.getElementById("submitButton");
  taskInput.value = task.task;
  descInput.value = task.desc;
  dateInput.value = task.date;
  button.textContent = "Edit Task";

  const submitWithId = e => {
    submit(e, task.id);
    button.textContent = "Submit Task";
  };

  button.onclick = submitWithId;
};

const createHeaderRow = () => {
  const header = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = ["ID", "Task", "Description", "Due Date", "Priority"];
  headers.forEach(text => {
    const headerCell = document.createElement("th");
    headerCell.textContent = text;
    headerRow.appendChild(headerCell);
  });

  header.appendChild(headerRow);
  return header;
};

const createButtons = task => {
  const cell = document.createElement("td");
  cell.style.width = "200px";

  const editButton = document.createElement("button");
  editButton.className = "taskButton";
  editButton.textContent = "Edit";
  editButton.onclick = () => {
    editTask(task);
  };

  const deleteButton = document.createElement("button");
  deleteButton.className = "taskButton";
  deleteButton.textContent = "Delete";
  deleteButton.onclick = () => {
    deleteTask(task);
  };

  cell.append(editButton, deleteButton);
  return cell;
};

const createRow = (id, task, desc, dueDate, priority, index) => {
  let row = document.createElement("tr");

  row.append(createCell(id));
  row.append(createCell(task));
  row.append(createCell(desc));
  row.append(createCell(dueDate));
  row.append(createCell(priority));
  row.append(createButtons(index));

  return row;
};

const createCell = data => {
  const cell = document.createElement("td");
  cell.textContent = data;
  return cell;
};

// Manages creation of table elements using data from server
const getTasks = data => {
  const table = document.querySelector("table");
  table.replaceChildren();
  table.append(createHeaderRow());
  data.forEach((task, index) => {
    let row = createRow(
      task.id,
      task.task,
      task.desc,
      task.dueDate,
      priorityCalculator(task.dueDate),
      task
    );
    table.append(row);
  });
};

// Helper function to fetch tasks from server and display them in a table
const fetchTasks = async () => {
  try {
    const fetchResponse = await fetch("/tasks", { method: "GET" });
    const data = await fetchResponse.json();
    getTasks(data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

window.onload = async function () {
  const button = document.getElementById("submitButton");
  button.onclick = submit;

  fetchTasks();
};
