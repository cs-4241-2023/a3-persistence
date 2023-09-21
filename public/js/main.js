const submit = async function( event ) {
  event.preventDefault()
  
  const todo = document.querySelector( '#todo-name' ),
        date = document.querySelector( '#due-date' ),
        //desc = document.querySelector( '#description' ),
        id = Math.random().toString(36).substring(2, 10),
        json = { id: id, task: todo.value, date: date.value },//, desc: desc.value
        body = JSON.stringify( json )
  console.log(body)
  
  let response
  // if a task is selected, edit the task
  const selectedTask = document.querySelector('input[type="checkbox"]:checked')
  if (selectedTask) {
    const createButton = document.querySelector('#create-button')

    const id = selectedTask.id
    response = await fetch(`/edit-row/${id}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body
    })
  }
  else {
    response = await fetch( '/submit', {
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body
    })
  }
  
  if (response.status === 200) {
    updateList()
  }
  const text = await response.text()

  console.log( 'text:', text )
}

const updateList = async function() {
  const response = await fetch( '/get-list', {
    method:'GET'
  })
  const json = await response.json()
  const table = document.querySelector( '#table-body' )
  // clear the table body
  table.innerHTML = ''
  json.forEach( (row) => {
    // Insert a new row for the task
    const newRow = table.insertRow(-1)
    newRow.setAttribute('data-id', row.id)
    const selectCell = newRow.insertCell(0)
    const selectButton = document.createElement('input')
    selectButton.setAttribute('type', 'checkbox')
    selectButton.setAttribute('id', row.id)
    selectCell.appendChild(selectButton)
    const taskCell = newRow.insertCell(1)
    taskCell.innerHTML = row.task
    const dateCell = newRow.insertCell(2)
    dateCell.innerHTML = row.date
    // const descCell = newRow.insertCell(3)
    // descCell.innerHTML = row.desc
    // const priorityCell = newRow.insertCell(3)
    // priorityCell.innerHTML = row.priority
  })
  const deleteButton = document.querySelector('#delete-button')
  if (table.rows.length > 0) {
    deleteButton.style.display = 'block'
    deleteButton.onclick = deleteRow
  }
}

const deleteRow = async function() {
  const selectedTask = document.querySelector('input[type="checkbox"]:checked')
  // if a task is selected, delete the task
  if (selectedTask) {
    const id = selectedTask.id
    console.log(id)
    const response = await fetch(`/delete-row/${id}`, {
      method: 'POST'
    })
    if (response.status === 200) {
      updateList()
    }
  }
}

window.onload = function() {
  const button = document.querySelector("button");
  button.onclick = submit;
}