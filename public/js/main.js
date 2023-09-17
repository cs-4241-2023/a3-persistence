// FRONT-END (CLIENT) JAVASCRIPT HERE

let form, taskInput, dateInput, submitButton;

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
    item.id = t.taskId;

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

    let deleteButton = document.createElement('button');
    deleteButton.innerText = "x";
    deleteButton.addEventListener('click', async function() {
      const json = {id: item.id};
      const body = JSON.stringify(json);

      const postResponse = await fetch('/deleteTask', {
        method: 'POST',
        body
      })
    
      const getResponse = await fetch('/tasks', {
        method: 'GET',
      })
    
      const text = await getResponse.text();
      const tasks = JSON.parse(text);

      updateTasks(tasks);
    });

    item.appendChild(taskLabel);
    item.appendChild(dateLabel);
    item.appendChild(daysRemainingLabel);
    item.appendChild(priorityLabel);
    item.appendChild(deleteButton);
    list.appendChild(item);
  });
}

function updateTasks(taskList) {
  let currentTasks = document.querySelectorAll('.task-item');
  let previousList = Array.from(currentTasks);

  let ids = [];
  taskList.forEach(t => { ids.push(t.taskId) });

  for (let i = 0; i < previousList.length; i++) {
    if (!ids.includes(parseInt(previousList[i].id))) {
      previousList[i].remove();
      break;
    }
  }
}

const submit = async function( event ) {
  event.preventDefault()

  const taskInput = document.querySelector('#taskName').value,
        dateInput = document.querySelector('#dueDate').value,
        priorityInput = document.querySelector('#priorityFlag').value;

  const json = { taskName: taskInput, dueDate: dateInput, priority: priorityInput};
  const body = JSON.stringify(json);

  const postResponse = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const getResponse = await fetch('/tasks', {
    method: 'GET',
  })

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