// FRONT-END (CLIENT) JAVASCRIPT HERE

let playerData;


const submit = async function( event ) {
  event.preventDefault()
  
  const name = document.querySelector( '#name' )
  const outside = document.querySelector( '#outside' )
  const inside = document.querySelector( '#inside' )
  const athleticism = document.querySelector( '#athleticism' )
  const playmaking = document.querySelector( '#playmaking' )
  const defense = document.querySelector( '#defense' )
  const json = {
          "name": name.value,
          "outside": parseInt(outside.value),
          "inside": parseInt(inside.value),
          "athleticism": parseInt(athleticism.value),
          "playmaking": parseInt(playmaking.value),
          "defense": parseInt(defense.value),
          "rating": 1,
          "user": null,
        }
  fetch( '/add', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify({ "newPlayer":json })
  })
  .then( response => response.json() )
  .then( json => populateTable(json) )
}

const deletePlayerOnServer = async function (name, event) {
  // event.preventDefault()
  const data = { name: name };

  fetch('/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data) // Stringify the object as JSON
  })
    .then((response) => response.json())
    .then((json) => populateTable(json))
    .catch((error) => {
      console.error('Fetch error:', error);
    });
};

const update = async function( name, event ) {
  // event.preventDefault()
  const outside = document.querySelector( '#outsideUpdate' )
  const inside = document.querySelector( '#insideUpdate' )
  const athleticism = document.querySelector( '#athleticismUpdate' )
  const playmaking = document.querySelector( '#playmakingUpdate' )
  const defense = document.querySelector( '#defenseUpdate' )
  const json = {
          "name": name,
          "outside": outside.value,
          "inside": inside.value,
          "athleticism": athleticism.value,
          "playmaking": playmaking.value,
          "defense": defense.value,
          "rating": 1
        }
  fetch( '/update', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify({ "newPlayer":json })
  })
  .then( response => response.json() )
  .then( json => populateTable(json) )
}

  
//getData()
const getData = async function( event ) {
  event.preventDefault()

  fetch('/get', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((json) => populateTable(json),(json) => loadDeleteDropdown(json)), (json) => loadUpdateDropdown(json)
    .catch((error) => {
      console.error('Fetch error:', error);
    });
}

const getDataLoad = async function( event ) {
  // if (event) {
  //   event.preventDefault();
  // }
  fetch('/get', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((json) => populateTable(json))
    .catch((error) => {
      console.error('Fetch error:', error);
    });
}

const loadDeleteDropdown = function (data){
  const dropdown = document.getElementById('deleteDropdown')
  dropdown.innerHTML = '';
  data.forEach(item => {
    const option = document.createElement('option');
    option.textContent = item.name;
    dropdown.appendChild(option);
  });
}
const loadUpdateDropdown = function (data){
  const dropdown = document.getElementById('updateDropdown')
  dropdown.innerHTML = '';
  data.forEach(item => {
    const option = document.createElement('option');
    option.textContent = item.name;
    dropdown.appendChild(option);
  });
}
window.onload = function() {
  // document.getElementById('tab1').style.display = "block";
  const button = document.querySelector("#submit");
  button.onclick = submit;
  getDataLoad();
}

function populateTable(data) {
  const tableBody = document.getElementById("playerData");
  tableBody.innerHTML = ''
  for(player in data){
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${data[player].name}</td>
          <td>${data[player].outside}</td>
          <td>${data[player].inside}</td>
          <td>${data[player].athleticism}</td>
          <td>${data[player].playmaking}</td>
          <td>${data[player].defense}</td>
          <td>${data[player].rating}</td>

      `;

      tableBody.appendChild(row);
  };
  loadDeleteDropdown(data)
  loadUpdateDropdown(data)
}

const nbaPlayerData = [
  {
    "name": "LeBron James",
    "outside": 88,
    "inside": 90,
    "athleticism": 92,
    "playmaking": 96,
    "defense": 85,
    "rating": 90
  },
  {
    "name": "Stephen Curry",
    "outside": 98,
    "inside": 75,
    "athleticism": 88,
    "playmaking": 92,
    "defense": 70,
    "rating": 85
  },
  {
    "name": "Giannis Antetokounmpo",
    "outside": 78,
    "inside": 95,
    "athleticism": 97,
    "playmaking": 84,
    "defense": 90,
    "rating": 89
  },
  {
    "name": "Kevin Durant",
    "outside": 95,
    "inside": 88,
    "athleticism": 90,
    "playmaking": 85,
    "defense": 82,
    "rating": 88
  },
  {
    "name": "Kawhi Leonard",
    "outside": 88,
    "inside": 80,
    "athleticism": 92,
    "playmaking": 75,
    "defense": 95,
    "rating": 86
  },
  {
    "name": "Luka Dončić",
    "outside": 90,
    "inside": 85,
    "athleticism": 86,
    "playmaking": 94,
    "defense": 78,
    "rating": 86
  },
  {
    "name": "Anthony Davis",
    "outside": 75,
    "inside": 92,
    "athleticism": 89,
    "playmaking": 72,
    "defense": 96,
    "rating": 85
  },
  {
    "name": "James Harden",
    "outside": 96,
    "inside": 85,
    "athleticism": 84,
    "playmaking": 93,
    "defense": 72,
    "rating": 86
  },
  {
    "name": "Joel Embiid",
    "outside": 72,
    "inside": 95,
    "athleticism": 87,
    "playmaking": 70,
    "defense": 89,
    "rating": 83
  },
  {
    "name": "Damian Lillard",
    "outside": 97,
    "inside": 75,
    "athleticism": 86,
    "playmaking": 90,
    "defense": 68,
    "rating": 83
  },
  {
    "name": "Jimmy Butler",
    "outside": 84,
    "inside": 88,
    "athleticism": 86,
    "playmaking": 82,
    "defense": 90,
    "rating": 86
  },
  {
    "name": "Karl-Anthony Towns",
    "outside": 80,
    "inside": 85,
    "athleticism": 84,
    "playmaking": 72,
    "defense": 78,
    "rating": 80
  },
  {
    "name": "Devin Booker",
    "outside": 92,
    "inside": 78,
    "athleticism": 86,
    "playmaking": 80,
    "defense": 70,
    "rating": 81
  },
  {
    "name": "Rudy Gobert",
    "outside": 45,
    "inside": 88,
    "athleticism": 80,
    "playmaking": 55,
    "defense": 96,
    "rating": 73
  },
  {
    "name": "Chris Paul",
    "outside": 87,
    "inside": 70,
    "athleticism": 82,
    "playmaking": 95,
    "defense": 76,
    "rating": 82
  },
 

];

// tab switcher
function openTab(event, tabName) {
  var i, tabcontent, tablinks;
  // Hide all tab content
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }
  // Deactivate all tab links
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove("active");
  }
  // Show the selected tab content
  document.getElementById(tabName).style.display = "block";
  //if tab 2, update list
  if(tabName === 'tab2'){
    //update contents of dropdown 
  }
  // Activate the clicked tab link
  event.currentTarget.classList.add("active");
}



// Event listener for the delete button click
const deletePlayer = function(event){
  // event.preventDefault()
  //delete button for dropdown
  const dropdown = document.getElementById('deleteDropdown');
  // Get the selected option
  const selectedOption = dropdown.options[dropdown.selectedIndex];
  
  if (selectedOption) {
    // Remove the selected option
    dropdown.remove(selectedOption.index);
    //console.log(selectedOption.innerHTML)
    deletePlayerOnServer(selectedOption.innerHTML)
  } else {
    alert('No option selected to delete.');
  }
}
// Event listener for the update button click
const updatePlayer = function(event){
  // event.preventDefault()
  //delete button for dropdown
  const dropdown = document.getElementById('updateDropdown');
  // Get the selected option
  const selectedOption = dropdown.options[dropdown.selectedIndex];
  
  if (selectedOption) {
    //console.log(selectedOption.innerHTML)
    update(selectedOption.innerHTML)
    //console.log('yeet', selectedOption.innerHTML)
  } else {
    alert('No option selected to delete.');
  }
}
