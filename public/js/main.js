// const submit = async function( event ) {
//   event.preventDefault()
  
  
  
//   let response
//   // if a task is selected, edit the task
//   const selectedTask = document.querySelector('input[type="checkbox"]:checked')
//   if (selectedTask) {
//     const createButton = document.querySelector('#create-button')

//     const id = selectedTask.id
//     response = await fetch(`/edit-row/${id}`, {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'},
//       body
//     })
//   }
//   else {
//     const todo = document.querySelector( '#todo-name' ),
//         date = document.querySelector( '#due-date' ),
//         //desc = document.querySelector( '#description' ),
//         id = Math.random().toString(36).substring(2, 10),
//         json = { id: id, task: todo.value, date: date.value },//, desc: desc.value
//         body = JSON.stringify( json )
//   console.log(document.querySelector('#Username'))
//   console.log(body)
//     response = await fetch( '/submit', {
//       method:'POST',
//       headers: {'Content-Type': 'application/json'},
//       body
//     })
//   }
  
//   if (response.status === 200) {
//     updateList()
//   }
//   const text = await response.text()

//   console.log( 'text:', text )
// }
// const getUserPass = async function(){
  
// }
// const updateList = async function() {
//   const response = await fetch( '/get-list', {
//     method:'GET'
//   })
//   const json = await response.json()
//   const table = document.querySelector( '#table-body' )
//   // clear the table body
//   table.innerHTML = ''
//   json.forEach( (row) => {
//     // Insert a new row for the task
//     const newRow = table.insertRow(-1)
//     newRow.setAttribute('data-id', row.id)
//     const selectCell = newRow.insertCell(0)
//     const selectButton = document.createElement('input')
//     selectButton.setAttribute('type', 'checkbox')
//     selectButton.setAttribute('id', row.id)
//     selectCell.appendChild(selectButton)
//     const taskCell = newRow.insertCell(1)
//     taskCell.innerHTML = row.task
//     const dateCell = newRow.insertCell(2)
//     dateCell.innerHTML = row.date
//     // const descCell = newRow.insertCell(3)
//     // descCell.innerHTML = row.desc
//     // const priorityCell = newRow.insertCell(3)
//     // priorityCell.innerHTML = row.priority
//   })
//   const deleteButton = document.querySelector('#delete-button')
//   if (table.rows.length > 0) {
//     deleteButton.style.display = 'block'
//     deleteButton.onclick = deleteRow
//   }
// }

// const deleteRow = async function() {
//   const selectedTask = document.querySelector('input[type="checkbox"]:checked')
//   // if a task is selected, delete the task
//   if (selectedTask) {
//     const id = selectedTask.id
//     console.log(id)
//     const response = await fetch(`/delete-row/${id}`, {
//       method: 'POST'
//     })
//     if (response.status === 200) {
//       updateList()
//     }
//   }
// }

// window.onload = function() {
//   const button = document.querySelector("button");
//   button.onclick = submit;
// }

var user;

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const taskName = document.querySelector('#todo-name'),
          deadline = document.querySelector('#due-date'),
          uniqueId = Math.random().toString(36).slice(2, 10),
          payload = { user: user, id: uniqueId, task: taskName.value, date: deadline.value },
          requestData = JSON.stringify(payload);

    let serverResponse;
    const chosenTask = document.querySelector('input[type="checkbox"]:checked');
    if (chosenTask) {
        const taskId = chosenTask.id;
        serverResponse = await fetch(`/edit-row/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: requestData
        });
  
        const responseText = await serverResponse.text();
        console.log('Task updated', responseText);
    } else {
        serverResponse = await fetch(`/submit`, {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestData
        });
  
        const responseText = await serverResponse.text();
        console.log('Task added', responseText);
    }
  
    if (serverResponse.status === 200) {
        refreshList();
    }
};

const refreshList = async () => {
    const serverResponse = await fetch(`/get-list/${user}`, { 
      method:'GET'
     });
    const taskList = await serverResponse.json();
    const taskTable = document.querySelector('#table-body');
    taskTable.innerHTML = '';
    taskList.forEach((task) => {
        const newRow = taskTable.insertRow(-1);
        newRow.setAttribute('data-id', task.id);
        const selectCell = newRow.insertCell(0);
        const selectCheckbox = document.createElement('input');
        selectCheckbox.setAttribute('type', 'checkbox');
        selectCheckbox.setAttribute('id', task.id);
        const label = document.createElement('label');
        label.setAttribute('for', task.id);
        label.innerHTML = '⠀'; 
        selectCell.appendChild(label);
        selectCell.appendChild(selectCheckbox);
        const taskCell = newRow.insertCell(1);
        taskCell.innerHTML = task.task;
        const dateCell = newRow.insertCell(2);
        dateCell.innerHTML = task.date;
    });
    const removeButton = document.querySelector('#delete-button');
    if (taskTable.rows.length > 0) {
        removeButton.style.display = 'block';
        removeButton.onclick = removeTask;
    }
};

const removeTask = async () => {
    const selectedTask = document.querySelector('input[type="checkbox"]:checked');
    if (selectedTask) {
        const taskId = selectedTask.id;
        const serverResponse = await fetch(`/delete-row/${taskId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
  
        const responseText = await serverResponse.text();
        console.log('Task removed', responseText);
  
        if (serverResponse.status === 200) {
            refreshList();
        }
    }
};

window.onload = () => {
    //const logIn = localStorage.getItem('logIn');
    if (!localStorage.getItem('logIn')) {
        window.location = 'login.html';
    }
    user = localStorage.getItem('user');
    const appHeader = document.getElementById('app-header');
    appHeader.innerHTML = ` ${user}'s Todo List`;
    refreshList();
    const addButton = document.querySelector("button");
    addButton.onclick = handleSubmit;
};