// FRONT-END (CLIENT) JAVASCRIPT HERE
const submit = async function (event) {
  event.preventDefault();
  const body = user_form_data();

  console.log("Data being added to the table: " + body);
  if (body !== "") {
    clearForm();
    try {
      const response = await fetch('/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body
      });
      const responseData = await response.text()
      build_table();
      console.log('Post Request Status:', responseData)
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  } else {
    handleValidationError();
  }
}

function handleValidationError() {
  if (!validateYear(year_input.value)) {
    alert("Please enter a valid year");
  } else {
    alert("Please fill out all fields");
  }
}

function clearForm() {
  form.reset();
}

window.onload = function () {
  const submitButton = document.getElementById("submit");
  submitButton.onclick = submit;
  build_table();
}

const year_input = document.getElementById("year");
const make_input = document.getElementById("car_make");
const model_input = document.getElementById("model");
const service_type_input = document.getElementById("service-type");
const appointment_data_input = document.getElementById("appointment-date");
const form = document.getElementById("user-inputs");
var vehicle_data_table = document.getElementById("myTable");
var emptyDataText = document.getElementById("empty-text");

function user_form_data() {
  if (validate_form_input()) {
    user_vehicle_json_data = {
      year: year_input.value,
      car_make: make_input.value,
      model: model_input.value,
      service_type: service_type_input.value,
      appointment_date: appointment_data_input.value,
    }
    let body_val = JSON.stringify(user_vehicle_json_data)
    return body_val;
  } else {
    return "";
  }
}

function validate_form_input() {
  const inputs = [year_input, make_input, model_input, service_type_input, appointment_data_input];
  for (const input of inputs) {
    if (input.value === "") {
      return false;
    }
  }
  // Add additional validation checks here for the different input fields
  if (validateYear(year_input.value)) {
    return true;
  }
  return false;
}

function validateYear(yearValue) {
  var yearPattern = /^(?!0)\d{4}$/;

  if (yearPattern.test(yearValue)) {
    return true
  } else {
    return false;
  }
}

// Makes a 'GET' request to server data and adds elements to client table
const build_table = async function () {
  try {
    fetch('/req-server-data', {
      method: 'GET',
    }).then((response) => response.json())
      .then((server_data) => {
        console.log("Current Server Data:");
        console.log(server_data)
        // check if there is available data on the server
        if (server_data.length === 0) {
          console.log("No table data available to display");
          vehicle_data_table.getElementsByTagName("tbody")[0].innerHTML = vehicle_data_table.rows[0].innerHTML; // clear table
          emptyDataText.textContent = "Appointment list is EMPTY. Go ahead and add an appointment!";
        } else {
          emptyDataText.textContent = "";
          vehicle_data_table.getElementsByTagName("tbody")[0].innerHTML = vehicle_data_table.rows[0].innerHTML; // clear table

          // TRAVERSE THROUGH JSON OBJECTS STORED ON SERVER
          for (let i = 0; i < Object.entries(server_data).length; i++) {
            let prop_index = 0;
            let data_row = vehicle_data_table.insertRow(-1);
            data_row.setAttribute("id", server_data[i].uuid);

            for (let prop_name in server_data[i]) {
              // build rows
              let table_cell = data_row.insertCell(prop_index);
              table_cell.setAttribute("id", "td-" + prop_name);
              table_cell.innerHTML = server_data[i][prop_name];
              prop_index++;
            }

            let modifyBtnCell = data_row.insertCell(prop_index); // modify button
            modifyBtnCell.setAttribute("id", "md-cell" + server_data[i].uuid);
            let modifyButton = modifyBtnCell.appendChild(document.createElement("button"));

            let rmBtnCell = data_row.insertCell(prop_index + 1); // delete button
            rmBtnCell.setAttribute("id", "rm-cell" + server_data[i].uuid);
            let removeButton = rmBtnCell.appendChild(document.createElement("button"));

            removeButton.className = 'rm-table-btn';
            removeButton.id = "rm-" + server_data[i].uuid;

            modifyButton.className = 'md-table-btn';
            modifyButton.id = "md-" + server_data[i].uuid;

            removeButton.innerHTML = "Remove"; // name of delete button
            removeButton.onclick = function () {
              removeEntry(server_data[i].uuid);
            };

            modifyButton.innerHTML = "Modify"; // name of modify buttion
            modifyButton.onclick = function () {

              // get all td cells from specific row
              let desiredRow = document.getElementById(server_data[i].uuid)
              let tdListFromRow = desiredRow.querySelectorAll("td");

              console.log(tdListFromRow);

              // for each td value
              for (var j = 0; j < tdListFromRow.length - 4; j++) {
                let originalTDValue = tdListFromRow[j].innerHTML;

                const inputTag = document.createElement("input");
                if (tdListFromRow[j].id === "td-appointment_date") {
                  inputTag.setAttribute("type", "date");
                } else {
                  inputTag.setAttribute("type", "text");
                }
                inputTag.setAttribute("id", tdListFromRow[j].id + server_data[i].uuid);
                inputTag.setAttribute("class", "md-input-tags");
                inputTag.value = originalTDValue;

                // Replace the td values with the input element
                tdListFromRow[j].innerHTML = "";
                tdListFromRow[j].appendChild(inputTag);
              }

              // Hide the Modify and Remove button
              document.getElementById("md-" + server_data[i].uuid).style.display = "none";
              document.getElementById("rm-" + server_data[i].uuid).style.display = "none";

              // Check if the Save button already exists
              if (!document.getElementById("save-btn" + server_data[i].uuid)) {
                const save_btn = document.createElement("button");
                save_btn.setAttribute("type", "button");
                save_btn.setAttribute("class", "save-table-btn");
                save_btn.setAttribute("id", "save-btn" + server_data[i].uuid);
                save_btn.setAttribute("onclick", `save_edit('${server_data[i].uuid}')`);
                let text = document.createTextNode("Save");
                save_btn.appendChild(text);

                modifyBtnCell.appendChild(save_btn);
              } else {
                const save_btn = document.getElementById("save-btn" + server_data[i].uuid);
                save_btn.style.display = "inline-block";
              }

              // Check if cancel button already exists
              if (!document.getElementById("cancel-btn")) {
                const cancel_btn = document.createElement("button");
                cancel_btn.setAttribute("type", "button");
                cancel_btn.setAttribute("class", "cancel-table-btn");
                cancel_btn.setAttribute("id", "cancel-btn" + server_data[i].uuid);
                cancel_btn.setAttribute("onclick", "build_table()");
                let text = document.createTextNode("Cancel");
                cancel_btn.appendChild(text);

                rmBtnCell.appendChild(cancel_btn);
              } else {
                const cancel_btn = document.getElementById("cancel-btn" + server_data[i].uuid);
                cancel_btn.style.display = "inline-block";
              }
            }

          } // for-loop

        }
      });
  } catch (error) {
    alert('An error occurred while fetching server data!');
  }
}

function save_edit(uuid) {
  console.log("Save edit function: ");

  const yearInput = document.getElementById("td-year" + uuid);
  const makeInput = document.getElementById("td-car_make" + uuid);
  const modelInput = document.getElementById("td-model" + uuid);
  const serviceTypeInput = document.getElementById("td-service_type" + uuid);
  const appointmentDateInput = document.getElementById("td-appointment_date" + uuid);

  let form_data = {
    year: yearInput.value,
    car_make: makeInput.value,
    model: modelInput.value,
    service_type: serviceTypeInput.value,
    appointment_date: appointmentDateInput.value
  }

  const form_data_as_string = JSON.stringify(form_data);

  if (form_data.year !== "" && form_data.car_make !== "" && form_data.model !== ""
    && form_data.model !== "" && form_data.service_type !== "" && form_data.appointment_date !== "") {
    if (validateYear(form_data.year)) {
      modifyEntry(uuid, form_data_as_string);
    } else {
      alert("Cannot modify: Please enter a valid year!");
    }
  } else {
    alert("Please fill out all fields before saving log!");
  }
}

async function modifyEntry(UUID, user_data) {
  const req_data = [];

  req_data.push(UUID);
  req_data.push(user_data);

  console.log("Post Req Data Frm Modify: ");
  console.log(req_data);

  try {
    const response = await fetch('/modify-table-entry', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(req_data),
    });
    ``
    if (response.ok) {
      console.log(`Data ${UUID} was modified`);
      form.reset();
      build_table();
    } else {
      console.error(`Failed to modify data ${UUID}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }


}

async function removeEntry(UUID) {
  try {
    const response = await fetch('/delete-frm-table', {
      method: 'POST',
      body: UUID,
    });

    if (response.ok) {
      console.log(`Data ${UUID} was removed`);
      build_table();
    } else {
      console.error(`Failed to remove data ${UUID}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}