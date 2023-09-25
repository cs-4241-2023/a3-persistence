
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

  let container = document.querySelector('.container');
  container.appendChild(currentPlayerElement);
  container.appendChild(top10PlayersElement);
}

window.onload = function () {
  getResults();
}