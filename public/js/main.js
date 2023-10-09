document.addEventListener("DOMContentLoaded", () => {
  const publishableKey =
    "pk_test_ZW5vcm1vdXMtY2hpcG11bmstNS5jbGVyay5hY2NvdW50cy5kZXYk";
  async function startClerk() {
    const Clerk = window.Clerk;

    try {
      // Load Clerk environment and session if available
      await Clerk.load();

      const userButton = document.getElementById("user-button");
      const authLinks = document.getElementById("auth-links");

      Clerk.addListener(({ user }) => {
        // Display links conditionally based on user state
        if (authLinks) {
          authLinks.style.display = user ? "none" : "block";
        }
      });

      if (Clerk.user) {
        // Mount user button component
        Clerk.mountUserButton(userButton);
        userButton.style.margin = "auto";
      }
    } catch (err) {
      console.error("Error starting Clerk: ", err);
    }
  }

  (() => {
    const script = document.createElement("script");
    script.setAttribute("data-clerk-publishable-key", publishableKey);
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`;
    script.crossOrigin = "anonymous";
    script.addEventListener("load", startClerk);
    script.addEventListener("error", () => {
      document.getElementById("no-frontend-api-warning").hidden = false;
    });
    document.body.appendChild(script);
  })();

  async function fetchTasks() {
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
  }
  const addTaskButton = document.getElementById("add-task");
  addTaskButton.addEventListener("click", async (event) => {
    await submit(event);
    fetchTasks(); // Fetch tasks after adding a new task
  });

  function displayTasks(tasks) {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Clear the existing list

    tasks.forEach((task, index) => {
      const listItem = document.createElement("li");

      // Create a div to contain task details (including description)
      const taskDetails = document.createElement("div");
      taskDetails.classList.add("task-details");

      // Check if task properties are defined before creating elements
      if (task.task) {
        const taskName = document.createElement("span");
        taskName.textContent = `Task: ${task.task}`;
        taskDetails.appendChild(taskName);
      }

      if (task.description) {
        const taskDescription = document.createElement("span");
        taskDescription.textContent = `Description: ${task.description}`;
        taskDetails.appendChild(taskDescription);
      }

      if (task.dueDate) {
        const dueDate = document.createElement("span");
        dueDate.textContent = `Due Date: ${task.dueDate}`;
        taskDetails.appendChild(dueDate);
      }

      if (task.priority) {
        const priority = document.createElement("span");
        priority.textContent = `Priority: ${task.priority}`;
        taskDetails.appendChild(priority);
      }

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";

      // Add an event listener to the delete button
      deleteButton.addEventListener("click", () => {
        // Call a function to handle task deletion (you need to implement this)
        handleDeleteTask(task._id); // Pass the task ID to the handler
        // Remove the task item from the DOM
        taskList.removeChild(listItem);
      });

      // Append the task details div to the task item
      listItem.appendChild(taskDetails);
      listItem.appendChild(deleteButton); // Append the delete button here

      // Append the task item to the task list
      taskList.appendChild(listItem);
    });
  }

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
    const inputTaskDescription = document.querySelector("#task-description");
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
      description: inputTaskDescription.value,
      dueDate: dueDateInput.value,
      priority: prioritySelect.value,
    };
    const body = JSON.stringify(json);

    const response = await fetch("/tasks", {
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
  /*
  window.onload = function () {
    const button = document.querySelector("button");
    button.onclick = submit;

    // Fetch and display tasks from the server
    fetchTasks();
  };*/
});
