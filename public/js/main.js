document.addEventListener("DOMContentLoaded", function () {
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
    if (!validateYear()) {
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
    if (validateYear()) {
      return true;
    }
    return false;
  }

  function validateYear() {
    var yearInput = document.getElementById("year");
    var yearValue = yearInput.value;

    // Check if the input is a 4-digit number using a regular expression
    var yearPattern = /^\d{4}$/;

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

              for (let prop_name in server_data[i]) {
                // build rows
                let table_cell = data_row.insertCell(prop_index);
                table_cell.innerHTML = server_data[i][prop_name];
                prop_index++;
              }

              let rmBtnCell = data_row.insertCell(prop_index); // delete button
              let removeButton = rmBtnCell.appendChild(document.createElement("button"));

              let modifyBtnCell = data_row.insertCell(prop_index + 1); // modify button
              let modifyButton = modifyBtnCell.appendChild(document.createElement("button"));

              removeButton.className = 'rm-table-btn';
              removeButton.id = server_data[i].uuid;

              modifyButton.className = 'md-table-btn';
              modifyButton.id = server_data[i].uuid;

              removeButton.innerHTML = "Remove"; // name of delete button
              removeButton.onclick = function () {
                removeEntry(removeButton.id);
              };

              modifyButton.innerHTML = "Modify";
              modifyButton.onclick = function () {
                let form_data = user_form_data();
                if (form_data !== "") {
                  modifyEntry(modifyButton.id, form_data);
                } else {
                  handleValidationError();
                }
              }

            }

          }
        });
    } catch (error) {
      alert('An error occurred while fetching server data!');
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

});

