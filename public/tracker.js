let trainingData = [];
let currentlyEditedIndex = null;
var map = [];

// Function to update the training data display
export function updateTrainingDataDisplay() {
  map = []; // clear on update to avoid redundancy
  document.getElementById("submit-button").onclick = handleSubmit;
  const trainingDataContainer = document.getElementById("training-data");
  trainingDataContainer.innerHTML = "";

  fetch( '/populate', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  .then( response => { if(response.ok) return response.json() })
  .then( json => { 
      trainingData = json.trainingData;
      for (let i = 0; i < trainingData.length; i++) {
        const data = trainingData[i];
        map.push(data._id);

        const row = document.createElement("tr");
        data.averageSpeed = (data.distance/(data.time/60));
        row.innerHTML = `
          <td>${data.date}</td>
          <td>${data.type}</td>
          <td>${data.distance.toFixed(2)}</td>
          <td>${data.time}</td>
          <td>${data.heartRate}</td>
          <td>${data.averageSpeed.toFixed(2)}</td>
          <td>
            <button class="btn btn-warning edit-button">Edit</button>
            <button class="btn btn-danger delete-button">Delete</button>
          </td>
        `;

        trainingDataContainer.appendChild(row);
        // Attach event listeners for edit and delete buttons
        const editButton = row.querySelector('.edit-button');
        const deleteButton = row.querySelector('.delete-button');
        editButton.addEventListener('click', () => editTrainingSession(i));
        deleteButton.addEventListener('click', () => deleteTrainingSession(i));
      }
  });
}

const handleSubmit = async (event) => {
  event.preventDefault();
  
  if (currentlyEditedIndex !== null) {
    return false;
  }

  const dateInput = document.getElementById("date");
  const typeInput = document.getElementById("type");
  const distanceInput = document.getElementById("distance");
  const timeInput = document.getElementById("time");
  const hrInput = document.getElementById("heart-rate");

  const editIndex = parseInt(document.querySelector('#edit-index').value);
  
  const entry = {
    date:dateInput.value,
    type:typeInput.value,
    distance:parseFloat(distanceInput.value),
    time:parseInt(timeInput.value),
    heartRate:parseInt(hrInput.value),
  }
  
  if(editIndex != -1) {
    return false;
  } 

  fetch( '/add-data', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify(entry)
  }).then( response => { if(response.ok) updateTrainingDataDisplay(); else console.log("Error") })

  return false;
};

const editTrainingSession = (index) => {
  if (currentlyEditedIndex !== null) {
    cancelEditSession(currentlyEditedIndex);
  }
  
  disableSubmit();

  currentlyEditedIndex = index;
  const sessionToEdit = trainingData[index];

  const dateInput = document.getElementById("date");
  const typeInput = document.getElementById("type");
  const distanceInput = document.getElementById("distance");
  const timeInput = document.getElementById("time");
  const heartRateInput = document.getElementById("heart-rate");

  dateInput.value = sessionToEdit.date;
  typeInput.value = sessionToEdit.type;
  distanceInput.value = sessionToEdit.distance;
  timeInput.value = sessionToEdit.time;
  heartRateInput.value = sessionToEdit.heartRate;

  const row = document.querySelector(`#training-data tr:nth-child(${index + 1})`);
  row.cells[6].innerHTML = `
    <button class="btn btn-success save-button">Save</button>
    <button class="btn btn-danger cancel-button">Cancel</button>
  `;

  // Attach event listeners for save and cancel buttons
  const saveButton = row.querySelector('.save-button');
  const cancelButton = row.querySelector('.cancel-button');
  saveButton.addEventListener('click', () => saveTrainingSession(index));
  cancelButton.addEventListener('click', () => cancelEditSession(index));
};

const cancelEditSession = (index) => {
  revertSubmit();
  
  const row = document.querySelector(`#training-data tr:nth-child(${index + 1})`);
  const originalSession = trainingData[index];

  // Forces original session content to be visually displayed
  row.cells[0].textContent = originalSession.date;
  row.cells[1].textContent = originalSession.type;
  row.cells[2].textContent = originalSession.distance.toFixed(1);
  row.cells[3].textContent = originalSession.time;
  row.cells[4].textContent = originalSession.heartRate;

  row.cells[6].innerHTML = `
    <button class="btn btn-warning edit-button">Edit</button>
    <button class="btn btn-danger delete-button">Delete</button>
  `;
  
  const editButton = row.querySelector('.edit-button');
  const deleteButton = row.querySelector('.delete-button');
  editButton.addEventListener('click', () => editTrainingSession(index));
  deleteButton.addEventListener('click', () => deleteTrainingSession(index));

  currentlyEditedIndex = null;
};

const revertSubmit = () => {
  const buttonSubmit = document.getElementById("submit-button");
  buttonSubmit.style.backgroundColor = "#333333";
}

const disableSubmit = () => {
  const buttonSubmit = document.getElementById("submit-button");
  buttonSubmit.style.backgroundColor = "#999999";
}

const saveTrainingSession = (index) => {
  revertSubmit();
  
  const row = document.querySelector(`#training-data tr:nth-child(${index + 1})`);
  const editedSession = {
    date: document.getElementById("date").value,
    type: document.getElementById("type").value,
    distance: parseFloat(document.getElementById("distance").value),
    time: parseInt(document.getElementById("time").value),
    heartRate: parseInt(document.getElementById("heart-rate").value),
    id: map[index],
  };
  
  // Visually update the session being edited
  // row.cells[0].textContent = editedSession.date;
  // row.cells[1].textContent = editedSession.type;
  // row.cells[2].textContent = editedSession.distance.toFixed(1);
  // row.cells[3].textContent = editedSession.time;
  // row.cells[4].textContent = editedSession.heartRate;

  fetch( '/update', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify(editedSession)
  }).then( response => { if(response.ok) updateTrainingDataDisplay(); else console.log("Error saving edited session") })
  currentlyEditedIndex = null;
  
  // Revert actions back to original state
  // row.cells[6].innerHTML = `
  //   <button class="btn btn-warning edit-button">Edit</button>
  //   <button class="btn btn-danger delete-button">Delete</button>
  // `;
  // const editButton = row.querySelector('.edit-button');
  // const deleteButton = row.querySelector('.delete-button');
  // editButton.addEventListener('click', () => editTrainingSession(index));
  // deleteButton.addEventListener('click', () => deleteTrainingSession(index));
};

const deleteTrainingSession = (index) => {
  console.log("Checking delete execution for table index " + index);
  fetch(`/delete`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify({id:map[index]})
  }).then((response) => {
      if (response.status === 200) {
        updateTrainingDataDisplay();
      } else {
        console.error('Error deleting session:', response.statusText);
      }
    });
  currentlyEditedIndex = null;
};