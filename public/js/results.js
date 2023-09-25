
// Show only current session player's info from mongodb in results.html
// Query the database collection for the current session player's info
async function getResults() {
  const response = await fetch('/getResults', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  let results = await response.json() // Get server response
  console.log(results) // Print current server data
  display(results); // Populate list of players in html with server data
}

// Populate list of players in html with server data
// function display(results) {

//   currentPlayer = document.getElementById('currentPlayer');
//   if (currentPlayer) {
//     currentPlayer.remove();  // Reset player list by removing old list
//   }

//   top10Players = document.getElementById('top10Players');
//   if (top10Players) {
//     top10Players.remove();  // Reset player list by removing old list
//   }

//   currentPlayer = document.createElement('p'); // Current player
//   currentPlayer.id = 'currentPlayer';

// // Current player html should have name, color, score, rank, and edit and delete buttons
//   currentPlayer.innerHTML = `
//     ${results[0].name}, Color: ${results[0].color}, Score: ${results[0].score}, Rank: ${results[0].rank}</li>
//     <button onclick="editPlayer()">Edit</button>
//     <button onclick="deletePlayer()">Delete</button>
//   `;

//   top10Players = document.createElement('ol'); // Top 10 players
//   top10Players.id = 'top10Players';

//   // Top 10 players html should have name, color, score, and rank
//   for (let i = 1; i < results.length; i++) {
//     top10Players.innerHTML += `
//       <li>${results[i].name}, ${results[i].color}, Score: ${results[i].score}, Rank: ${results[i].rank}</li>
//     `;
//   }

//   let container = document.getElementById('container');
//   container.appendChild(currentPlayer);
//   container.appendChild(top10Players);


// }

// //


// window.onload = function () {
//   getResults();
// }


function display(results) {
  // Remove existing currentPlayer and top10Players if they exist
  let currentPlayerElement = document.getElementById('currentPlayer');
  if (currentPlayerElement) {
    currentPlayerElement.remove();
  }

  let top10PlayersElement = document.getElementById('top10Players');
  if (top10PlayersElement) {
    top10PlayersElement.remove();
  }

  // Create currentPlayer Element
  currentPlayerElement = document.createElement('div');
  currentPlayerElement.id = 'currentPlayer';
  currentPlayerElement.innerHTML = `
    <strong>Current Player:</strong> ${results[0].name}, Color: ${results[0].color}, Score: ${results[0].score}, Rank: ${results[0].rank}
    <button onclick="editPlayer()">Edit</button>
    <button onclick="deletePlayer()">Delete</button>
  `;

  // Create top10Players table
  top10PlayersElement = document.createElement('table');
  top10PlayersElement.id = 'top10Players';
  
  // Table header
  top10PlayersElement.innerHTML = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Color</th>
        <th>Score</th>
        <th>Rank</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `;

  // Populating the table with data
  const tbody = top10PlayersElement.querySelector('tbody');
  for (let i = 1; i < results.length; i++) {
    const row = `
      <tr>
        <td>${results[i].name}</td>
        <td>${results[i].color}</td>
        <td>${results[i].score}</td>
        <td>${results[i].rank}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  }

  let container = document.getElementById('container');
  container.appendChild(currentPlayerElement);
  container.appendChild(top10PlayersElement);
}

window.onload = function () {
  getResults();
}
