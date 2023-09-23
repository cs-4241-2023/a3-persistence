// FRONT-END (CLIENT) JAVASCRIPT HERE

function getCookie(name) {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  if (cookieValue) {
    return cookieValue.split('=')[1];
  } else {
    return null; // Cookie not found
  }
}
const usernameCookie = getCookie('username');

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  // Function to get the value of a specific cookie by name

  if (!usernameCookie) {
    console.log('Username cookie not found.');
    return; // Exit the function if the username cookie is not found
  }

  const 
        name = document.querySelector('#yourname').value,
        gamertag = document.querySelector('#gamertag').value,
        email = document.querySelector('#email').value,
        position = document.querySelector('#position').value,
        username = usernameCookie
        json = {yourname: name, gamertag: gamertag, email: email, position: position, username: username},
      
        body = JSON.stringify( json )


  
  function validate_input() {
    console.log("Validating input...");
    if (name === "" || gamertag === "" || email === "" || position === "") {
      return false;
    }
  return true;
  }

  if(validate_input() === false) {
    alert("Please fill out all fields.");
    return;
  }
  else
  {
    console.log("Input validated.");
  }

  const response = await fetch( '/submit', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  });

if (response.ok) {
  // Data was successfully submitted
  const text = await response.text();
  console.log('Server response:', text);

  // Clear form fields after submission
  document.querySelector('#yourname').placeholder = 'Your real name here.';
  document.querySelector('#gamertag').placeholder = 'Your gamertag here.';
  document.querySelector('#email').placeholder = 'Your email here.';
  document.querySelector('#position').placeholder = 'What\'s your position?';

  // Refresh the table to display updated data
  updateTable(usernameCookie);
} else {
  console.error('Error submitting data to the server');
}
};



// Function to update the table with data from the server
const updateTable = async function(username) {
  const response = await fetch(`/get?username=${username}`);

  if (response.ok) {
    const data = await response.json();
    console.log('Table data:', data);
    // Call a function to populate/update the table with the received data
    console.log('Populating table with data from the server')
    console.log(data)
    populateTable(data);
  } else {
    console.error('Error fetching data from the server');
  }
};

// Function to populate/update the table with received data
const populateTable = function(data) {
  const tableBody = document.querySelector('#table-body');
  tableBody.innerHTML = ''; // Clear existing table rows


  data.forEach(function(player){
    const row = document.createElement('tr');
    //Separate
    row.innerHTML = `
      <td> <input type="button" id=${player._id} onclick="editPlayer('${player._id}')" value="Edit"></td>
      <td> <input type="button" id=${player._id} onclick="deletePlayer('${player._id}')" value="Delete"></td>
      <td>${player.yourname}</td>
      <td>${player.gamertag}</td>
      <td>${player.email}</td>
      <td>${player.position}</td>
    `;
    tableBody.appendChild(row);
  });
};

// Function to delete a player from the table
const deletePlayer = async function(index) {
  console.log('Deleting player with index:', index);
  const response = await fetch('/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index: index })
  })
  updateTable(usernameCookie);
};

// Function to edit a player from the table
const editPlayer = async function(index) {
  //This is needed for playerData.
  const 
        name = document.querySelector('#yourname').value,
        gamertag = document.querySelector('#gamertag').value,
        email = document.querySelector('#email').value,
        position = document.querySelector('#position').value,
        username = usernameCookie
        json = {yourname: name, gamertag: gamertag, email: email, position: position username: username},

  console.log('Editing player with index:', index);
  console.log('Player name:',json.yourname)
  const response = await fetch('/edit', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index: index, playerdata: json})
  })
  updateTable(usernameCookie);
};


window.onload = function() {
  const button = document.querySelector("button");
  button.onclick = submit;

  // Get the username from the cookie
  const usernameCookie = getCookie('username');
  if (usernameCookie) {
    updateTable(usernameCookie); // Pass the username to updateTable
  }
}

// For Login Page  DEV NOTE: Not sure if I have to indicate what html. I think it's implied.

const login = async function( event ) {
  const 
        username = document.querySelector('#login').value,
        password = document.querySelector('#password').value,
        json = {username: username, password: password},
      
        body = JSON.stringify( json )

  const response = await fetch( '/login', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  });
}