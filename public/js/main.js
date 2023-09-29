let editIndex = null

const submit = async function (event) {

  event.preventDefault();
  let evt = event.target
  let json = {}
  if (evt.getAttribute('formaction') === '/submit'){
    json = {
      height: document.querySelector("#height").value,
      weight: document.querySelector("#weight").value,
      age: document.querySelector("#age").value,
      gender: document.querySelector('input[name="gender"]:checked').value,
    }
   }else if (evt.getAttribute('formaction') === '/delete'){
    json={id:evt.getAttribute('id')}
   } else if (evt.getAttribute('formaction') === '/edit'){
      //add the index to the json
      //change button form action to submit
      //reset the edit index
   }

    await fetch(evt.getAttribute('formaction'), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    }).then(async function(response) {
      let data = await response.json();
      populateTable(data)
  });
};


function calculateBMI(height, weight, age, gender) {
  let bmi;
  if (gender === 'male') {
      bmi = (0.74 * weight) / (height/100 * height/100);
      bmi += (0.063 * age) - 3.3;
  } else if (gender === 'female') {
      bmi = (0.74 * weight) / (height * height);
      bmi += (0.063 * age) + 5.1;
  } else {
      throw new Error('Invalid gender');
  }

  return parseFloat(bmi.toFixed(2));
}

function editRow(){
  //get the row from the table using the index and populate the form
  //change the button form action to edit
  //set the edit index
}

function populateTable(data){
  const tableparse = document.querySelector("tbody");
    tableparse.innerHTML = "";

    let resultHTML = tableparse.innerHTML;

    let userData = data[0]['data']

    userData.forEach(function (data, index){
      row = document.createElement("tr");
      row.id = index;
      
      for (const cellKey in data) {
        const cell = document.createElement("td");
          cell.innerText = data[cellKey];
          row.appendChild(cell);
  
      }
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.className = "my-deletebutton";
      deleteButton.formAction = '/delete'
      deleteButton.id=index;
      deleteButton.onclick = submit

      const deleteCell = document.createElement("td");
      deleteCell.appendChild(deleteButton);
      const editButton = document.createElement("button");
      editButton.innerText = "Edit";
      editButton.className = "my-editbutton";
      editButton.formAction = '/edit'
      editButton.id=index;
      editButton.onclick = submit
      deleteCell.appendChild(editButton);
      row.appendChild(deleteCell);

      tableparse.appendChild(row)

    });
      }


async function fetchData(){
  await fetch('/docs', {
    method: 'GET',
  }).then(async function(response) {
    let data = await response.json()
    populateTable(data)
  })
}

fetchData()

window.onload = function () {
  const button = document.querySelector("button");
  button.onclick = submit;
};