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
      
      const prioritySymbol = document.createElement('span');
      prioritySymbol.className = `prioritySymbol ${task.priority}`;
      prioritySymbol.textContent = task.priority;
      taskElement.appendChild(prioritySymbol);


      const taskText = document.createElement("span");
      taskText.textContent = task.taskName;
      taskElement.appendChild(taskText);

      const taskDescription = document.createElement("div");
      taskDescription.className = "taskDescription";
      taskDescription.textContent = task.description;
      taskElement.appendChild(taskDescription);

      const taskInfo = document.createElement("div");
      taskInfo.className = "taskInfo";
      
      const taskAssignedTo = document.createElement("span");
      taskAssignedTo.className = "taskAssignedTo";
      taskAssignedTo.textContent = `Assigned to: ${task.assignedTo}`;
      taskAssignedTo.style.right = `${taskAssignedTo.textContent.length}px`;
      taskInfo.appendChild(taskAssignedTo);

      const dueDate = document.createElement("span");
      dueDate.className = "dueDate";
      dueDate.textContent = `Due: ${task.dueDate}`;
      taskInfo.appendChild(dueDate);
      taskElement.appendChild(taskInfo);

      const deleteButton = document.createElement("button");
      deleteButton.className = "deleteTask";
      deleteButton.textContent = "delete";
      deleteButton.onclick = async function () {
        const response = await fetch("/deleteTask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task: task.task, dueDate: task.dueDate }),
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
      taskElement.appendChild(deleteButton);

      const updateButton = document.createElement("button");
      updateButton.className = "updateTask";
      updateButton.textContent = "update";
      updateButton.onclick = async function () {
        const response = await fetch("/deleteTask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task: task.task, dueDate: task.dueDate }),
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
      taskElement.appendChild(updateButton);

      tasksContainer.appendChild(taskElement);
    });
  } catch (error) {
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
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error adding task.",
      });
    }
  } else {
    const errorData = await response.json();
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: errorData.error,
    });
  }
});

window.onload = fetchAndDisplayTasks;
