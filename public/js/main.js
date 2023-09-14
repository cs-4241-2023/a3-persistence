// FRONT-END (CLIENT) JAVASCRIPT HERE
/**
 * Submits assignment to the server as JSON
 * @param event mouse click event
 * @returns {Promise<void>}
 */
const submitAssignment = async function(event) {
  // stop form submission from trying to load a new .html page for displaying results
  event.preventDefault();

  // get information from input text boxes and parse into a JSON
  const inputJSON = JSON.stringify({
    id: Date.now(), // timestamp id
    className: document.querySelector("#class-name").value,
    assignmentName: document.querySelector("#assignment-name").value,
    dueDate: document.querySelector("#due-date").value,
    difficulty: document.querySelector("#difficulty").value,
    priority: "" // priority is empty until we derive it in the server
  });

  // post JSON to server
  const response = await fetch( '/submit', {
    method: 'POST',
    body: inputJSON
  });

  // await response from server, the server is sending some example data back
  const dataResponse = await response.json();

  // status message element
  let message = document.querySelector("#submission-message");

  if(dataResponse.result === "success")
  {
    // show success message
    message.style.color = "green";
    message.textContent = "Success";
    clearTextBoxes();

    // update data table with new data
    await getAllData();
  }
  else
  {
    // show failure message
    message.style.color = "red";
    message.textContent = "Failure: " + dataResponse.message;
  }
  // un-hide element
  message.style.visibility = "visible"
}

/**
 * Clears all text boxes
 */
const clearTextBoxes = function() {
  // array of selectors that specify the text boxes
  let selectors = [
    "#class-name",
    "#assignment-name",
    "#due-date",
    "#difficulty"
  ];

  // set the value of each to the empty string
  selectors.forEach((selector) => {
    document.querySelector(selector).value = "";
  });
}

/**
 * Get all app data from the Node.js server and populate a table with the information
 * @returns {Promise<void>}
 */
const getAllData = async function () {
  // clear table before data fetch if it exists
  if(document.querySelector("table") !== null) {
    document.querySelector("table").remove();
  }

  // get app data from server as JSON
  const appResponse = await fetch('/assignment-data', {method: 'GET'});
  const appDataJSON = await appResponse.json();

  // create table element in HTML
  const table = document.createElement("table");
  table.innerHTML = "<th>Class Name</th> <th>Assignment Name</th> <th>Due Date</th> <th>Difficulty</th> <th>Priority</th>";

  // add assignment information to corresponding row
  appDataJSON.forEach((assignment) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${assignment.className}</td> 
                     <td>${assignment.assignmentName}</td>
                     <td>${assignment.dueDate}</td>
                     <td>${assignment.difficulty} out of 10</td>
                     <td>${assignment.priority} priority</td>
                     `
    // create delete button for table row
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    editButton.textContent = "Edit";

    deleteButton.style.paddingLeft = "5px";
    deleteButton.style.fontWeight = "light";
    editButton.style.paddingLeft = "5px";
    editButton.style.fontWeight = "light";

    deleteButton.onclick = () => {
      deleteAssignment(assignment);
    }

    editButton.onclick = () => {
      editPopUp(assignment);
    }

    row.appendChild(editButton)
    row.appendChild(deleteButton);
    table.appendChild(row);
  });
  document.querySelector("body").appendChild(table);
}

/**
 * Deletes a given assignment from the Node.js server
 * @param assignment the assignment to be deleted
 * @returns {Promise<void>}
 */
const deleteAssignment = async function(assignment) {
  const response = await fetch("/" ,{
    method: "DELETE",
    body: JSON.stringify(assignment)});

  await getAllData();
}
const editPopUp = function (assignment) {
  // hide original form and show pop-up
  document.querySelector("#assignment-form").style.visibility = "hidden";
  document.querySelector("#edit-window").style.visibility = "visible";
  document.querySelector("#edit-message").style.visibility = "hidden";
  document.querySelector("#submission-message").textContent = "";

  // populate text boxes with existing data
  document.querySelector("#class-name-edit").value = assignment.className;
  document.querySelector("#assignment-name-edit").value = assignment.assignmentName;
  document.querySelector("#due-date-edit").value = assignment.dueDate;
  document.querySelector("#difficulty-edit").value = assignment.difficulty;

  document.querySelector("#submit-button-edit").onclick = () => editAssignment(assignment.id);

  document.querySelector("#cancel-edit-button").onclick = () => {
    // hide pop-up and restore normal form
    document.querySelector("#assignment-form").style.visibility = "visible";
    document.querySelector("#edit-window").style.visibility = "hidden";
  }
}

/**
 * Edits a given assignment on the Node.js server
 * @param assignmentId the assignmentID of the original assignment
 * @returns {Promise<void>}
 */
const editAssignment = async function(assignmentId) {

  // generate new assignment JSON with the same original ID
  const editedJSON = JSON.stringify({
    id: assignmentId, // timestamp id
    className: document.querySelector("#class-name-edit").value,
    assignmentName: document.querySelector("#assignment-name-edit").value,
    dueDate: document.querySelector("#due-date-edit").value,
    difficulty: document.querySelector("#difficulty-edit").value,
    priority: "" // priority will be re-calculated on the server
  });

  const response = await fetch("/" ,{
    method: "PUT",
    body: editedJSON
  });

  const dataResponse = await response.json();
  let message = document.querySelector("#edit-message");

  if(dataResponse.result === "success")
  {
    // show success message
    message.style.color = "green";
    message.textContent = "Edit Successful!";

    // update data table with new data
    await getAllData();
  }
  else
  {
    // show failure message
    message.style.color = "red";
    message.textContent = "Edit Failure:  " + dataResponse.message;
  }
  // un-hide element
  message.style.visibility = "visible"

  document.querySelector("#assignment-form").style.visibility = "visible";
  document.querySelector("#edit-window").style.visibility = "hidden";
}

/**
 * Set up on-click event listeners once the window loads
 */
window.onload = function() {
  getAllData().then(() =>
      document.querySelector("#submit-button").onclick = submitAssignment
  );
}