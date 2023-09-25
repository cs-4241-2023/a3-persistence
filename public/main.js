// FRONT-END (CLIENT) JAVASCRIPT HERE

async function reset() {
  const response = await fetch( '/reset', {
    method:'POST',
    headers: { "Content-Type": "application/json" }
  })
  const resetTrue = await response.json()
}

const login = async function(u, p) {

  const t = document.querySelector("#errorText");
  if ((u === '') || (p === '')) {
    t.textContent = "Username and Password are required fields!";
    const popup = document.querySelector( '#errorPop' );
    popup.style.visibility = "visible";
  }
  else {
    const response = await fetch( '/login', {
      method:'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username: u, password: p})
    })
    const loginTrue = await response.json()

    if (loginTrue) {
      window.location.href = 'scores.html';
    }
    else {
      t.textContent = "Username or Password incorrect!";
      const popup = document.querySelector( '#errorPop' );
      popup.style.visibility = "visible";
    }
  }
}

const register = async function(u, p) {
  const t = document.querySelector("#errorText");
  if ((u === '') || (p === '')) {
    t.textContent = "Username and Password are required fields!";
    const popup = document.querySelector( '#errorPop' );
    popup.style.visibility = "visible";
  }
  else {
    const response = await fetch( '/register', {
      method:'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username: u, password: p})
    })
    const registerTrue = await response.json()

    if (registerTrue) {
      window.location.href = 'scores.html';
    }
    else {
      t.textContent = "Username already exists!";
      const popup = document.querySelector( '#errorPop' );
      popup.style.visibility = "visible";
    }
  }
}

const submit = async function( event ) {
  event.preventDefault()

  const currentUser = await getUser();
  
  let isValid = true;
    
  const newGame = document.querySelector( '#game' );
  const newHigh = document.querySelector( '#highscore');
  const newNotes = document.querySelector( '#notes' );
  
  //check that form was filled in correctly
  isValid = validate(newGame.value, newHigh.value);
  
  if (isValid === true) {

    const json = { 
      user: currentUser,
      game: newGame.value,
      highscore: newHigh.value,
      notes: newNotes.value
    };
    const body = JSON.stringify( json )
  
    const response = await fetch( '/submit', {
      method:'POST',
      headers: { "Content-Type": "application/json" },
      body 
    })
    const newData = await response.json()
  
    startGrid();
  
    //reset form
    const form = document.querySelector( '#gameForm' );
    form.reset()
  }
  else {
    //show form error popup
    const popup = document.querySelector( '#errorPop' );
    popup.style.visibility = "visible";
  }   
  
}

async function getUser() {

  const response = await fetch('/user', {
    method: 'GET'
  })
  const curUser = await response.json();
  return curUser;
}
  
//check that form was filled in correctly
function validate(game, high) {
  const t = document.querySelector("#errorText");
  if ((game === '') || (high === '')) {
    t.textContent = "Game and High Score are required fields!";
    return false;
  }
  else {
    return true;
  }
}

//close form error popup
function exitPopup() {
  const popup = document.querySelector( '#errorPop' );
  popup.style.visibility = "hidden";
}

//reset the data display
async function setGrid(newData) {
  const currentUser = await getUser();
  
  const table = document.querySelector("#data");
  table.innerHTML = '';

  for (let i = 0; i < newData.length; i++) {
    const newThread = document.createElement("tr");
    table.appendChild(newThread);

    const gameText = document.createElement("td");
    gameText.innerText = newData[i].game;
    gameText.id = 'game' + i;
    newThread.appendChild(gameText);

    const highText = document.createElement("td");
    highText.innerText = newData[i].highscore;
    highText.id = 'high' + i;
    newThread.appendChild(highText);

    const noteText = document.createElement("td");
    noteText.innerText = newData[i].notes;
    noteText.id = 'notes' + i;
    newThread.appendChild(noteText);

    const delButton = document.createElement("button");
    delButton.innerText = 'x';
    delButton.id = 'x' + i;
    delButton.className = "nes-btn is-error";
    delButton.onclick = () => {
      const json = { 
        user: currentUser,
        game: newData[i].game,
        highscore: newData[i].highscore,
        notes: newData[i].notes
      };
      deleteRow(json);
    };

    const modButton = document.createElement("button");
    modButton.innerText = 'EDIT';
    modButton.id = 'mod' + i;
    modButton.className = "nes-btn is-primary";
    modButton.onclick = () => {
      modifyRow(i, newData);
    };

    const rowButtons = document.createElement("div");
    rowButtons.appendChild(delButton);
    rowButtons.appendChild(modButton);
    rowButtons.className = "table-btn center";

    const tableButtons = document.createElement("td");
    tableButtons.appendChild(rowButtons);
    newThread.appendChild(tableButtons);
  }
}

async function deleteRow(row) {
  const body = JSON.stringify(row);
  const response = await fetch('/json', {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" },
    body
  })

  const newGrid = await response.json();
  startGrid();
}

//show edit form, set input values to current data
function modifyRow(row, old) {

  let newVal = document.querySelector( '#game'+row ).textContent;
  document.querySelector( '#gameEdit' ).value = newVal;

  newVal = document.querySelector( '#high'+row ).textContent;
  document.querySelector( '#highscoreEdit' ).value = newVal;

  newVal = document.querySelector( '#notes'+row ).textContent;
  document.querySelector( '#notesEdit' ).value = newVal;

  const popup = document.querySelector( '#editwindow' );
  popup.style.visibility = "visible";

  const btn = document.querySelector( '#submitEdit' );
  btn.onclick = (event) => {
    event.preventDefault();
    editRow(row, old);
  };
}


async function editRow(row, oldData) {
  let isValid = true;

  const currentUser = await getUser();
  
  const newGame = document.querySelector( '#gameEdit' );
  const newHigh = document.querySelector( '#highscoreEdit');
  const newNotes = document.querySelector( '#notesEdit' );

  //check that form was filled in correctly
  isValid = validate(newGame.value, newHigh.value);

  if (isValid === true) {
    
    const json = { 
      ngame: newGame.value,
      nhighscore: newHigh.value,
      nnotes: newNotes.value,

      user: currentUser,
      game: oldData[row].game,
      highscore: oldData[row].highscore,
      notes: oldData[row].notes
    };
    const body = JSON.stringify(json);
    const response = await fetch('/json', {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body
    })

    const newGrid = await response.json();
    startGrid();
  }
  else {
    const popupE = document.querySelector( '#errorPop' );
    popupE.style.visibility = "visible";
  }
  const popup = document.querySelector( '#editwindow' );
  popup.style.visibility = "hidden";
}


//set up grid when page first loads
async function startGrid() {
  const response = await fetch('/json', {
    method: 'GET'
  })
  const newGrid = await response.json();
  setGrid(newGrid);
}

function switchLogRegister(type) {
  const form = document.querySelector( '#loginForm' );
  form.reset()

  const logtitle = document.querySelector('#logtitle');
  const logtext = document.querySelector('#logtext');
  const logbtn = document.querySelector('#submitLogin');

  if ((logtitle.innerHTML === "Login") || (type === "Login")) {
    logtitle.innerHTML = "Register";
    logtext.innerHTML = "Already have an account? <span class='linktext nes-pointer' id = 'textbtn' role='button'>Login</span>";
    logbtn.onclick = (event) => {
      event.preventDefault();
      const username = document.querySelector('#username').value;
      const password = document.querySelector('#password').value;
      register(username, password);
    };
  }
  else {
    logtitle.innerHTML = "Login";
    logtext.innerHTML = "Don't have an account? <span class='linktext nes-pointer' id = 'textbtn' role='button'>Register</span>";
    logbtn.onclick = (event) => {
      event.preventDefault();
      const username = document.querySelector('#username').value;
      const password = document.querySelector('#password').value;
      login(username, password);
    };
  }
  const textbtn = document.querySelector('#textbtn');
    textbtn.onclick = (event) => {
      event.preventDefault();
      switchLogRegister();
    };
}

window.onload = function() {
  
  const btn = document.querySelector('#submitForm');
  if (btn) {
    btn.onclick = submit;

    const logout = document.querySelector('#logout');
    logout.onclick = (event) => {
      event.preventDefault();
      window.location.href = 'index.html';
    };
    startGrid();
  }
  
  
  const logbtn = document.querySelector('#submitLogin');
  if (logbtn) {
    reset();
    logbtn.onclick = (event) => {
      event.preventDefault();
      const username = document.querySelector('#username').value;
      const password = document.querySelector('#password').value;
      login(username, password);
    };
    const textbtn = document.querySelector('#textbtn');
    textbtn.onclick = (event) => {
      event.preventDefault();
      switchLogRegister("Login");
    };
  }
  

}
  
  