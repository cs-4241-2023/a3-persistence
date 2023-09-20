const populateTable = async () => {
  const tableBody = document.querySelector("#data-table tbody");

  tableBody.innerHTML = "";

  try {
    const response = await fetch("/getData");
    const data = await response.json();

    data.forEach((item, index) => {
      const row = document.createElement("tr");

      const taskInput = document.createElement("input");
      taskInput.value = item.task;
      const taskCell = document.createElement("td");
      taskCell.appendChild(taskInput);

      const hoursInput = document.createElement("input");
      hoursInput.type = "number";
      hoursInput.value = item.hours;
      const hoursCell = document.createElement("td");
      hoursCell.appendChild(hoursInput);

      const dueDateInput = document.createElement("input");
      dueDateInput.type = "date";
      dueDateInput.value = item.dueDate;
      console.log("wowowo", item.dueDate);
      const dueDateCell = document.createElement("td");
      dueDateCell.appendChild(dueDateInput);

      const timeLeftInput = document.createElement("input");
      timeLeftInput.value = item.timeLeft;
      const timeLeftCell = document.createElement("td");
      timeLeftCell.appendChild(timeLeftInput);

      const priorityInput = document.createElement("input");
      priorityInput.value = item.priority;
      const priorityCell = document.createElement("td");
      priorityCell.appendChild(priorityInput);

      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteData(item.task));
      actionCell.appendChild(deleteButton);

      const modifyActionCell = document.createElement("td");
      const modifyButton = document.createElement("button");
      modifyButton.textContent = "Modify";
      modifyButton.addEventListener("click", () =>
        modifyData(
          index,
          taskInput,
          hoursInput,
          dueDateInput,
          timeLeftInput,
          priorityInput
        )
      );
      modifyActionCell.appendChild(modifyButton);

      row.appendChild(taskCell);
      row.appendChild(hoursCell);
      row.appendChild(dueDateCell);
      row.appendChild(timeLeftCell);
      row.appendChild(priorityCell);
      row.appendChild(actionCell);
      row.appendChild(modifyActionCell);

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const modifyData = async (
  index,
  taskInput,
  hoursInput,
  dueDateInput,
  timeLeftInput,
  priorityInput
) => {
  const updatedData = {
    task: taskInput.value,
    hours: hoursInput.value,
    dueDate: dueDateInput.value,
    timeLeft: timeLeftInput.value, 
    priority: priorityInput.value, 
  };

  try {
    const response = await fetch(`/modifyData/${index}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const result = await response.text();
    console.log("Server response:", result);
  } catch (error) {
    console.error("Error modifying data:", error);
  }
};

const deleteData = async (task) => {
  const body = JSON.stringify({ task });

  try {
    const response = await fetch("/submit", {
      method: "DELETE",
      body,
    });

    if (response.ok) {
      await populateTable();
    } else {
      console.error("Error deleting data:", response.statusText);
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

const submit = async function (event) {
  event.preventDefault();

  const taskInput = document.querySelector("#task");
  const hoursInput = document.querySelector("#hours");
  const dueDateInput = document.querySelector("#dueDate");

  const json = {
    task: taskInput.value,
    hours: parseFloat(hoursInput.value),
    dueDate: dueDateInput.value,
  };

  const body = JSON.stringify(json);

  try {
    const response = await fetch("/submit", {
      method: "POST",
      body,
    });

    const text = await response.text(); 

    if (!response.ok) {
      window.alert(`Error: ${text}`);
      return;
    }
    console.log("Response:", text);

    await populateTable();
  } catch (error) {
    console.error("Error:", error);
  }
};

window.onload = function () {
  const button = document.querySelector("button");
  button.onclick = submit;

  populateTable();
};
