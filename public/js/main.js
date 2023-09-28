const submit = async function (event) {

  event.preventDefault();
  let evt = event.target
  let json = {}
  if (evt.getAttribute('formaction') === '/submit'){
    json = {
      height: document.querySelector("#height").value,
      weight: document.querySelector("#weight").value,
      age: document.querySelector("#age").value,
      gender: document.querySelector("#gender").value,

   
    }
   }else {
    json={id:evt.getAttribute('id')}
   }


    fetch(evt.getAttribute('formaction'), {
      method: "POST",
      body: JSON.stringify(json),
    }).then(async function (response) {
      let data = await response.json();

    const tableparse = document.querySelector("tbody");
    tableparse.innerHTML = "";

    let resultHTML = tableparse.innerHTML;
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const row = document.createElement("tr");
       row.id = data[key].id;

        // for loop for each cell
        for (const cellKey in data[key]) {
          const cell = document.createElement("td");
            cell.innerText = data[key][cellKey];
            row.appendChild(cell);
          
        }

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.className = "my-deletebutton";
        deleteButton.formAction = '/delete'
        deleteButton.id=data[key].id;

        deleteButton.onclick = submit

        const deleteCell = document.createElement("td");
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        tableparse.appendChild(row);

      }
    }
  });
};

window.onload = function () {
  const button = document.querySelector("button");
  button.onclick = submit;
};