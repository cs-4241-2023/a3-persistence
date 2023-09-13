// FRONT-END (CLIENT) JAVASCRIPT HERE

let last_updated = Date.now()

window.onload = function() {
  document.getElementById('inputForm').onsubmit = addData;

  loadData()
}

const loadData = function() {
  fetch( '/data' )
    .then((response) => response.json())
    .then((json) => json.forEach(element => addTableRow(element)))
}

const addTableRow = function(data) {
  const table = document.getElementById('dataTable')

  const newForm = document.createElement('form')
  newForm.id = 'form:' + data['uuid']
  newForm.autocomplete = 'off'
  newForm.onsubmit = saveData
  document.body.appendChild(newForm)

  const newRow = document.createElement('tr')
  newRow.id = data['uuid']
  table.append(newRow)


  const itemData = document.createElement('td')
  itemData.textContent = data['item']
  newRow.appendChild(itemData)

  const amountData = document.createElement('td')
  amountData.textContent = data['amount'].toLocaleString()
  newRow.appendChild(amountData)

  const unitValueData = document.createElement('td')
  unitValueData.textContent = data['unit_value'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
  newRow.appendChild(unitValueData)

  const totalValueData = document.createElement('td')
  totalValueData.textContent = data['total_value'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
  newRow.appendChild(totalValueData)

  const modifyButtonData = document.createElement('td')
  modifyButtonData.className = 'tableButton'
  const modifyButton = document.createElement('button')
  modifyButton.textContent = 'Modify'
  modifyButton.onclick = modifyData
  modifyButtonData.appendChild(modifyButton)
  newRow.appendChild(modifyButtonData)

  const saveButton = document.createElement('button')
  saveButton.textContent = 'Save'
  saveButton.hidden = true
  saveButton.setAttribute('form', 'form:'+data['uuid'])
  saveButton.type = 'submit'
  modifyButtonData.appendChild(saveButton)

  const deleteButtonData = document.createElement('td')
  deleteButtonData.className = 'tableButton'
  const deleteButton = document.createElement('button')
  deleteButton.textContent = 'Delete'
  deleteButton.onclick = deleteData
  deleteButtonData.appendChild(deleteButton)
  newRow.appendChild(deleteButtonData)
}
