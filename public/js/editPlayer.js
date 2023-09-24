'use strict'

// CLIENT CODE

let playerList = undefined;

// Random int between min and max
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// When play button is clicked, submit form data to server
const submit = async function (event) {
  event.preventDefault(); // Stop page defualt reload behavior

  // hide div with input-container
  // const inputContainer = document.querySelector('#input-container');
  // inputContainer.style.display = 'none';

  const name = document.querySelector('#yourname'); // get form input element with id=yourname
  const color = document.querySelector('#color');

  let formData = {}  // json for client data
  formData.name = name.value
  formData.color = color.value
  formData.score = randomNum(1, 100); // Add random score between 1-100

  const response = await fetch('/submit', { // Send client data to server 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // **Added this to get body data in server
    body: JSON.stringify(formData) // Convert formData to JSON string
  })

  let serverData = await response.json() // Get server response
  console.log('SERVER DATA (after add player):')
  console.log(serverData) // Print current server data
  // populateList(serverData); // Populate list of players in html with server data
  window.location.href = '/game'; // Redirect to game
}

// Populate list of players in html with server data
function populateList(serverData) {
  playerList = document.getElementById('playerList');
  if (playerList) {
    playerList.remove();  // Reset player list by removing old list
  }

  playerList = document.createElement('ol'); // Ordered list of players 
  playerList.id = 'playerList';

  // document.body.appendChild(playerList);

  // add playerList to body inside the div with id=container
  let container = document.getElementById('container');
  container.appendChild(playerList);

  // For each player in server data, create a list item
  serverData.forEach(d => {
    const player = document.createElement('li') // Player list item

    // Add edit button
    const editButton = document.createElement('button')
    editButton.innerHTML = 'Edit'
    editButton.class = 'editButton'

    // Add delete button
    const deleteButton = document.createElement('button')
    deleteButton.innerHTML = 'Delete'
    deleteButton.class = 'deleteButton'

    // Server Data to be displayed in list player
    player.innerHTML = `Name: ${d.name}, Color: ${d.color}, Score: ${d.score}, Rank: ${d.rank}`
    player.className = 'player'
    player.id = `${d.name}`; // Set id of player list item to name of player

    // Add buttons in li player
    player.appendChild(editButton)
    player.appendChild(deleteButton)

    // Add player <li> to list <ol>
    playerList.appendChild(player)
  })
}

// When page loads, add event listeners to buttons
window.onload = function () {
  const playbutton = document.querySelector('#playbutton');
  playbutton.onclick = submit;

  // Delete button clicked
  document.addEventListener('click', function (e) {
    if (e.target && e.target.class == 'deleteButton') {
      let player = e.target.closest('.player');
      if (confirm(`Are you sure you want to delete Player: ${player.id}?`) == true) {
        deletePlayer(player.id); // player id is name of player
      }
    }
  });

  // Edit button clicked
  document.addEventListener('click', function (e) {
    if (e.target && e.target.class == 'editButton') {
      let player = e.target.closest('.player');
      editPlayer(player.id); // player id is name of player
    }
  });

}

// Edit player name on server
async function editPlayer(playerName) {
  let newName = prompt("Enter new name:", "New Name"); // Get new name from user
  if (newName == null || newName == "") {
    alert("Player name not changed"); // If user cancels or enters empty string, do nothing
  } else {
    let editPlayer = {}
    editPlayer.name = playerName
    editPlayer.newName = newName // New name to be changed to

    const response = await fetch('/edit', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }, // **Added this to get body data in server
      body: JSON.stringify(editPlayer)
    })

    let serverData = await response.json()
    console.log('SERVER DATA (after edit):');
    console.log(serverData);
    populateList(serverData);
  }
}

// Delete player from server
async function deletePlayer(playerName) {
  let deletePlayer = {}
  deletePlayer.name = playerName // Player name to be deleted

  const response = await fetch('/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }, // **Added this to get body data in server
    body: JSON.stringify(deletePlayer)
  })

  let serverData = await response.json()
  console.log('SERVER DATA (after delete):');
  console.log(serverData);
  populateList(serverData);
}