// FRONT-END (CLIENT) JAVASCRIPT HERE
String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

let form, taskInput, dateInput, submitButton;
let update_id = "";
let user = "";

function checkValidity() {
  if (taskInput.validity.valid && dateInput.validity.valid) {
    submitButton.removeAttribute('disabled');
  }
  else {
    submitButton.setAttribute('disabled', 'true');
  }
}

function loadTasks(taskList) {
  let currentTasks = document.querySelectorAll('.task-item');
  let previousList = Array.from(currentTasks);

  previousList.forEach(t => t.remove());

  let list = document.querySelector('ul');

  taskList.forEach(t => {
    let item = document.createElement('li');
    item.className = 'task-item'
    item._id = t._id;

    let taskLabel = document.createElement('label');
    taskLabel.innerHTML = t.taskName;
    taskLabel.className = 'list-label';

    let dateLabel = document.createElement('label');
    dateLabel.innerHTML = t.dueDate;
    dateLabel.className = 'list-label';

    let daysRemainingLabel = document.createElement('label');
    daysRemainingLabel.innerHTML = t.daysRemaining;
    daysRemainingLabel.className = 'list-label';

    let priorityLabel = document.createElement('label');
    priorityLabel.innerHTML = t.priority;
    priorityLabel.className = 'list-label';

    let modifyButton = document.createElement('button');
    modifyButton.innerText = "+";
    modifyButton.className = 'modifier';
    modifyButton.addEventListener('click', async function() {
      let taskInput = document.querySelector("#taskName");
      let dateInput = document.querySelector("#dueDate");
      let priorityInput = document.querySelector("#priorityFlag");
      let addButton = document.querySelector("#addTaskButton");

      taskInput.value = t.taskName;
      dateInput.value = t.dueDate;
      priorityInput.value = t.priority;
      addButton.innerText = "Update";
      update_id = t._id;
    });

    let deleteButton = document.createElement('button');
    deleteButton.innerText = "x";
    deleteButton.className = 'deleter';
    deleteButton.addEventListener('click', async function() {
      const json = {_id: item._id};
      const body = JSON.stringify(json);

      const postResponse = await fetch('/deleteTask', {
        method: 'POST',
        body
      });

      this.parentElement.remove();
    });

    item.appendChild(taskLabel);
    item.appendChild(dateLabel);
    item.appendChild(daysRemainingLabel);
    item.appendChild(priorityLabel);
    item.appendChild(modifyButton);
    item.appendChild(deleteButton);
    list.appendChild(item);
  });
}

const submit = async function( event ) {
  event.preventDefault()

  const taskInput = document.querySelector('#taskName').value,
  dateInput = document.querySelector('#dueDate').value,
  priorityInput = document.querySelector('#priorityFlag').value;

  const json = { taskName: taskInput, dueDate: dateInput, priority: priorityInput};

  if (this.innerText === "Add") {
    const body = JSON.stringify(json);
    const postResponse = await fetch( '/submitTasks', {
    method:'POST',
    body 
    });
  }
  else if (this.innerText === "Update") {
    json._id = update_id;
    const body = JSON.stringify(json);
    const postResponse = await fetch( '/updateTask', {
      method:'POST',
      body 
    });

    this.innerText = "Add";
  }

  const getResponse = await fetch('/getTasks', {
    method: 'GET',
  });

  const text = await getResponse.text();
  const tasks = JSON.parse(text);

  loadTasks(tasks);

  console.log('text:', text);
}

const login = async function(event) {
  event.preventDefault();

  const modalErrorMessage = document.querySelector("#errorMessage");
  modalErrorMessage.innerHTML = "";

  const usernameInput = document.querySelector("#usernameInput");
  const passwordInput = document.querySelector("#passwordInput");

  const json = { username: usernameInput.value, password: passwordInput.value.hashCode() };
  const body = JSON.stringify(json);

  const postResponse = await fetch('/login', {
    method: 'POST',
    body
  });

  const postText = await postResponse.text();

  try {
    const accountUsername = JSON.parse(postText);
    user = accountUsername.username;

    const modal = document.querySelector('#modal');
    const loginButton = document.querySelector('#loginButton');

    modal.style.display = "none";
    loginButton.innerText = user;

    const getResponse = await fetch('/getTasks', {
      method: 'GET',
    });
  
    const text = await getResponse.text();
    const tasks = JSON.parse(text);
  
    loadTasks(tasks);
  } catch (error) {
    modalErrorMessage.innerText = postText;
  }
}

window.onload = function() {
  const button = document.querySelector("#addTaskButton");
  button.onclick = submit;

  const signInButton = document.querySelector("#signInButton");
  signInButton.onclick = login;

  form = document.querySelector('.inputs');
  taskInput = document.querySelector('#taskName');
  dateInput = document.querySelector('#dueDate');
  submitButton = document.querySelector('#addTaskButton');

  taskInput.addEventListener('input', checkValidity);
  dateInput.addEventListener('input', checkValidity);

  const modal = document.querySelector('#modal');

  const loginButton = document.querySelector("#loginButton");
  loginButton.onclick = function() {
    modal.style.display = "block";
  };

  const closeButton = document.querySelector('.close');
  closeButton.onclick = function() {
    modal.style.display = "none";
  };

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}