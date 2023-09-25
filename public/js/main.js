// FRONT-END (CLIENT) JAVASCRIPT HERE
/**
 * On load script that accomplishes the following:
 *  - disable back button such that un-authenticated users cannot go back after logging out
 *  - handle user sign-up by attempting to POST new credentials to the Node.js server
 *  - format login status message on login page
 *  - checks if a given user is authorized and loads in necessary data from server if true
 * @returns {Promise<void>}
 */
window.onload = async () =>  {
  // disable the back button so non-authenticated users cannot navigate to app
  history.pushState(null, null, window.location.href);
  history.back();
  window.onpopstate = () => history.forward();

  // handle user sign-up on index.html
  let signUpButton = document.querySelector("#sign-up-button")
  if(signUpButton !== null) {
    document.querySelector("#sign-up-button").onclick = async () => {
      let newAccountJSON = JSON.stringify({
        username: document.querySelector("#username-input")?.value,
        password: document.querySelector("#password-input")?.value
      });

      let createAccountResponse = await (await fetch("/account-lookup", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: newAccountJSON
      })).json();
      document.querySelector("#login-status").textContent = createAccountResponse.status;
    }
  }

  // remove placeholder from login status <p> tag
  let loginStatus = document.querySelector("#login-status");
  if(loginStatus !== null && loginStatus.innerText === "<%= status %>") {
    loginStatus.innerText = "";
  }

  // check if authorized user
  let auth = await (await fetch("/auth", {
    method: "GET",
    headers: {'Content-Type': 'application/json'},
  })).json();

  // if authorized then load in data from database
  if(auth.status) {
    await getAllData();
    document.querySelector("#current-username").textContent = "Current User: " + auth.currentUser;
    document.querySelector("#submit-button").onclick = (event) => {
      submitAssignment(event);
    }
  }
}

/**
 * POSTs an assignment created from HTML form to Node.js server.
 * Displays success message if the data was successfully inserted, displays failure otherwise.
 * @param event mouse click event
 * @returns {Promise<void>}
 */
const submitAssignment = async function(event) {
  // stop form submission from trying to load a new .html page for displaying results
  event.preventDefault();


  // get information from input text boxes and parse into a JSON
  const inputJSON = {
    className: document.querySelector("#class-name").value,
    assignmentName: document.querySelector("#assignment-name").value,
    dueDate: document.querySelector("#due-date").value,
    difficulty: document.querySelector("#difficulty").value,
    completed: document.querySelector("#completed").checked,
    priority: "" // priority is empty until we derive it in the server
  };

  // post JSON to Node.js server and get returned JSON
  const dataResponse = await (await fetch("/submit", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(inputJSON)
  })).json();

  // status message element
  let message = document.querySelector("#submission-message");

  if(dataResponse.result === "success") {
    // show success message
    message.style.color = "green";
    message.textContent = "Success";

    // clear text boxes
    document.querySelector("#class-name").value = "";
    document.querySelector("#assignment-name").value = "";
    document.querySelector("#due-date").value = "";
    document.querySelector("#difficulty").value = "";
    document.querySelector("#completed").checked = false;

    // update data table with new data
    await getAllData();

  } else {
    // show failure message
    message.style.color = "red";
    message.textContent = "Failure: " + dataResponse.message;
  }
  // show message
  message.style.visibility = "visible"
}

/**
 * Gets all assignment data from the Node.js server and populates an HTML table with the returned information
 * @returns {Promise<void>}
 */
const getAllData = async function () {
  // clear table before data fetch if it exists
  if(document.querySelector("table") !== null) {
    document.querySelector("table").remove();
  }

  // get app data from server as JSON
  const assignmentData = await (await fetch('/assignment-data', {method: 'GET'})).json();

  // create table element in HTML
  const table = document.createElement("table");
  table.innerHTML = "<th>Class</th> <th>Name</th> <th>Due Date</th> <th>Difficulty</th> <th>Completed</th> <th>Priority</th>";

  // add assignment information to corresponding row
  assignmentData.forEach((assignment) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${assignment.className}</td> 
                     <td>${assignment.assignmentName}</td>
                     <td>${assignment.dueDate}</td>
                     <td>${assignment.difficulty} out of 10</td>
                     <td>${assignment.completed}</td>
                     <td>${assignment.priority} priority</td>
                     `
    // create delete button for table row
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.fontWeight = "normal";

    deleteButton.onclick = (event) => {
      deleteAssignment(event, assignment);
    }

    // create edit button for table row
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.style.fontWeight = "normal";
    editButton.style.marginLeft = "25px"

    editButton.onclick = (event) => {
      editPopUp(event, assignment);
    }

    // append elements together
    row.appendChild(editButton)
    row.appendChild(deleteButton);
    table.appendChild(row);
  });
  // append table to HTML body
  document.querySelector("body").appendChild(table);
}

/**
 * Deletes a given assignment from the Node.js server
 * @param event mouse event
 * @param assignment the assignment to be deleted
 * @returns {Promise<void>}
 */
const deleteAssignment = async function(event, assignment) {
  // prevent html page reload on click
  event.preventDefault();

  // send DELETE request to Node.js server
  await fetch("/assignment-delete" ,{
    method: "DELETE",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assignment)});

  // repopulate table
  await getAllData();
}
/**
 * Displays edit pop-up window when a given assignment's edit button is pressed.
 * @param event mouse event
 * @param assignment the assignment that the edit button was clicked for
 */
const editPopUp = function (event, assignment) {
  // prevent html page reload on click
  event.preventDefault();

  // hide original assignment form and show edit pop-up form
  document.querySelector("#assignment-form").style.display = "none"
  document.querySelector("#edit-window").style.display = "block";

  // populate text boxes with existing data
  document.querySelector("#class-name-edit").value = assignment.className;
  document.querySelector("#assignment-name-edit").value = assignment.assignmentName;
  document.querySelector("#due-date-edit").value = assignment.dueDate;
  document.querySelector("#difficulty-edit").value = assignment.difficulty;
  document.querySelector("#completed-edit").checked = assignment.completed;

  // set on-click listener for edit submission
  document.querySelector("#submit-button-edit").onclick = async (event) => {
    event.preventDefault();
    await editAssignment(event, assignment._id);
  }

  // close pop-up window and show original form if cancel is clicked
  document.querySelector("#cancel-edit-button").onclick = (event) => {
    event.preventDefault();
    document.querySelector("#edit-window").style.display = "none";
    document.querySelector("#assignment-form").style.display = "block";
    document.querySelector("#submission-message").textContent = "";
  }
}

/**
 * Edits a given assignment on the Node.js server
 * @param event mouse event
 * @param assignmentId the assignmentID of the original assignment
 * @returns {Promise<void>}
 */
const editAssignment = async function(event, assignmentId) {
  // generate new assignment JSON with the same original database ID
  const editedJSON = {
    _id: assignmentId, // database generated ID
    className: document.querySelector("#class-name-edit").value,
    assignmentName: document.querySelector("#assignment-name-edit").value,
    dueDate: document.querySelector("#due-date-edit").value,
    difficulty: document.querySelector("#difficulty-edit").value,
    completed: document.querySelector("#completed-edit").checked,
    priority: "" // priority will be re-calculated on the server
  };

  // send edit request to server
  const response = await (await fetch("/assignment-edit", {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(editedJSON)
  })).json();

  if(response.result === "success") {
    // show success message
    document.querySelector("#submission-message").style.color = "green";
    document.querySelector("#submission-message").textContent = "Edit Successful!";

    // close edit pop-up form
    document.querySelector("#submission-message").style.visibility = "visible"
    document.querySelector("#assignment-form").style.display = "block";
    document.querySelector("#edit-window").style.display = "none";

    // update data table with new data
    await getAllData();
  }
}