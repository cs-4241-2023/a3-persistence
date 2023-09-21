// FRONT-END (CLIENT) JAVASCRIPT HERE

let form, taskInput, dateInput, submitButton;
let update_id = "";

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

window.onload = function() {
  const button = document.querySelector("#addTaskButton");
  button.onclick = submit;

  form = document.querySelector('.inputs');
  taskInput = document.querySelector('#taskName');
  dateInput = document.querySelector('#dueDate');
  submitButton = document.querySelector('#addTaskButton');

  taskInput.addEventListener('input', checkValidity);
  dateInput.addEventListener('input', checkValidity);
}