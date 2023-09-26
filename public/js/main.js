// FRONT-END (CLIENT) JAVASCRIPT HERE
let data = null
const submit = function (event) {
  
  event.preventDefault();

  const date = document.querySelector("#date"),
    exercise = document.querySelector("#exercise"),
    sets = document.querySelector("#sets"),
    reps = document.querySelector("#reps"),
    weight = document.querySelector("#weight");

  const jsonData = {
    date: date.value,
    exercise: exercise.value,
    sets: sets.value,
    reps: reps.value,
    weight: weight.value,
  };

  let body = JSON.stringify(jsonData);

  fetch("/submit", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body,
  }).then(function (response) {
    refreshTable();
  });
};

const deleteLog = function(index){
  const json = { deleteResponse:index }
  let body = JSON.stringify(json)
  fetch("/delete", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body,
        }).then(function(){
            refreshTable();
        })
}

const refreshTable = function () {
  const table = document.querySelector("table");

  table.innerHTML = '<tr class="text-white h4 text-left"><th>Date</th><th>Exercise</th><th>Sets</th><th>Reps</th><th>Weight</th><th>Volume</th><th>Delete</th></tr>'

  fetch("/fetchData", {
    method: "GET",
  })
    .then((response) => response.json())
  
    .then(function (json) {        
        let workoutdata = json[0]['workoutdata']
        data = workoutdata
        //Iterate over workout data and add to the table
        workoutdata.forEach(function(currentElement, index){ 
        let row = table.insertRow(-1),
          date = row.insertCell(0),
          exercise = row.insertCell(1),
          sets = row.insertCell(2),
          reps = row.insertCell(3),
          weight = row.insertCell(4),
          volume = row.insertCell(5),
          deleteCell = row.insertCell(6)

          date.innerHTML = currentElement.date;
          exercise.innerHTML = currentElement.exercise;
          sets.innerHTML = currentElement.sets;
          reps.innerHTML = currentElement.reps;
          weight.innerHTML = currentElement.weight;
          volume.innerHTML = currentElement.volume;
          deleteCell.innerHTML = `<button class='delete' onclick=deleteLog(${index})>Delete</button>`;
        })
    });
};

window.onload = function () {
  const button = document.querySelector("#submit");
  button.onclick = submit;
  refreshTable();
};
