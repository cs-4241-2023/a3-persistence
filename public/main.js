async function fetchAndDisplayTasks() {
  try {
    const response = await fetch("/getTasks");
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const tasks = await response.json();
    const tasksContainer = document.getElementById("tasksContainer");
    tasksContainer.innerHTML = ""; // Clear previous tasks

    tasks.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.className = "card";

      const cardContent = document.createElement("div");
      cardContent.className = "card-content";

      const prioritySymbol = document.createElement('span');
      prioritySymbol.className = `badge ${task.priority}`;
      prioritySymbol.textContent = task.priority.toUpperCase();
      cardContent.appendChild(prioritySymbol);

      const taskText = document.createElement("span");
      taskText.className = "card-title";
      taskText.textContent = task.taskName;
      cardContent.appendChild(taskText);

      const taskDescription = document.createElement("p");
      taskDescription.textContent = task.description;
      cardContent.appendChild(taskDescription);

      const taskInfo = document.createElement("p");
      const taskAssignedTo = document.createElement("span");
      taskAssignedTo.textContent = `Assigned to: ${task.assignedTo}`;
      taskInfo.appendChild(taskAssignedTo);

      const dueDate = document.createElement("span");
      dueDate.textContent = `Due: ${task.dueDate}`;
      taskInfo.appendChild(dueDate);
      cardContent.appendChild(taskInfo);

      taskElement.appendChild(cardContent);

      const cardAction = document.createElement("div");
      cardAction.className = "card-action";

      const deleteButton = document.createElement("a");
      deleteButton.href = "#!";
      deleteButton.textContent = "Delete";
      deleteButton.onclick = async function () {
        const response = await fetch("/deleteTask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskName: task.taskName, dueDate: task.dueDate }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Remove the task element from the DOM
            tasksContainer.removeChild(taskElement);
          } else {
            alert("Error deleting task.");
          }
        } else {
          const errorData = await response.json();
          alert(errorData.error);
        }
      };
      cardAction.appendChild(deleteButton);

      const updateButton = document.createElement("a");
      updateButton.href = "#!";
      updateButton.textContent = "Update";
      updateButton.onclick = async function () {
        const response = await fetch("/deleteTask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskName: task.taskName, dueDate: task.dueDate }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            document.getElementById("taskName").value = task.taskName;
            document.getElementById("description").value = task.description;
            document.getElementById("assignedTo").value = task.assignedTo;
            document.getElementById("priority").value = task.priority;

            // Remove the task element from the DOM
            tasksContainer.removeChild(taskElement);
          } else {
            alert("Error deleting task.");
          }
        } else {
          const errorData = await response.json();
          alert(errorData.error);
        }
      };
      cardAction.appendChild(updateButton);

      taskElement.appendChild(cardAction);
      tasksContainer.appendChild(taskElement);
    });
  } catch (error) {
    M.toast({ html: 'Error fetching and displaying tasks.' });
    console.error("Error fetching and displaying tasks:", error);
  }
}

document.getElementById("todoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const description = document.getElementById("description").value;
  const assignedTo = document.getElementById("assignedTo").value;
  const priority = document.getElementById("priority").value;

  const response = await fetch("/addTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      taskName,
      description,
      assignedTo,
      priority,
    }),
  });

  if (response.ok) {
    const result = await response.json();
    if (result.success) {
      document.getElementById("todoForm").reset();
      fetchAndDisplayTasks(); // Refresh the list of tasks
      M.toast({ html: 'Task added successfully!' });
    } else {
      M.toast({ html: 'Error adding task.' });
    }
  } else {
    const errorData = await response.json();
    M.toast({ html: errorData.error });
  }
});

// Initialize Materialize components
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
});

// Fetch and display tasks on page load
window.onload = fetchAndDisplayTasks;
