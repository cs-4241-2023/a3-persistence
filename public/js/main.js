// FRONT-END (CLIENT) JAVASCRIPT HERE

let last_start_time
window.onload = function() {
  document.querySelector("#inputForm").onsubmit = addData;

  loadData()

  fetch( '/start_time' )
    .then((response) => response.json())
    .then((json) => last_start_time = json['start_time'])
}

const addData = async function(event) {
  event.preventDefault()
  if(await reloadIfRequired()) {
    return
  }

  const data = new FormData(event.target)

  const json = Object.fromEntries(data.entries())
  json['amount'] = Number(json['amount'])
  json['unit_value'] = Number(json['unit_value'])
  const body = JSON.stringify( json )

  const response = await fetch( '/add', {
    method:'POST',
    body 
  })

  const responseJson = await response.json()

  addTableRow(responseJson)
  document.querySelector('#inputForm').reset()
}

const addTableRow = function(data) {
  const table = document.querySelector("table")

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

const deleteData = async function(event) {
  event.preventDefault()
  if(await reloadIfRequired()) {
    return
  }
  
  const tableRow = this.parentElement.parentElement
  const uuid = tableRow.id

  const json = {
    uuid
  }
  const body = JSON.stringify(json)

  const response = await fetch( '/delete', {
    method:'POST',
    body
  })

  if(response.ok) {
    tableRow.remove()
    document.getElementById('form:'+uuid).remove()
  } else {
    alert('Failed to delete data')
  }
}

const modifyData = async function(event) {
  if(await reloadIfRequired()) {
    return
  }

  const tableRow = this.parentElement.parentElement
  const uuid = tableRow.id

  const itemData = tableRow.children[0]
  const itemInput = document.createElement('input')
  itemInput.value = itemData.textContent
  itemData.textContent = ''
  itemData.className = 'modifyTD'
  itemData.appendChild(itemInput)
  itemInput.type = 'text'
  itemInput.name = 'item'
  itemInput.required = true
  itemInput.setAttribute('form', 'form:'+uuid)

  const amountData = tableRow.children[1]
  const amountInput = document.createElement('input')
  amountInput.value = amountData.textContent.replaceAll(',', '')
  amountData.textContent = ''
  amountData.className = 'modifyTD'
  amountData.appendChild(amountInput)
  amountInput.type = 'number'
  amountInput.name = 'amount'
  amountInput.required = true
  amountInput.min = 0
  amountInput.setAttribute('form', 'form:'+uuid)

  const valueData = tableRow.children[2]
  const valueInput = document.createElement('input')
  valueInput.value = valueData.textContent.replaceAll(',', '')
  valueData.textContent = ''
  valueData.className = 'modifyTD'
  valueData.appendChild(valueInput)
  valueInput.type = 'number'
  valueInput.name = 'unit_value'
  valueInput.required = true
  valueInput.min = 0
  valueInput.step = 0.01
  valueInput.setAttribute('form', 'form:'+uuid)

  // Hide 'Modify', display 'Save'
  this.hidden = true
  this.parentElement.lastElementChild.hidden = false
}

const saveData = async function(event) {
  event.preventDefault()
  if(await reloadIfRequired()) {
    return
  }

  const data = new FormData(event.target)
  const uuid = event.target.id.slice(5)

  const json = Object.fromEntries(data.entries())
  json['amount'] = Number(json['amount'])
  json['unit_value'] = Number(json['unit_value'])
  json['uuid'] = uuid
  const body = JSON.stringify( json )

  const response = await fetch( '/modify', {
    method:'POST',
    body 
  })

  const responseJson = await response.json()

  tableRow = document.getElementById(uuid)

  tableRow.children[0].textContent = responseJson['item']
  tableRow.children[0].className = ''
  tableRow.children[1].textContent = responseJson['amount'].toLocaleString()
  tableRow.children[1].className = ''
  tableRow.children[2].textContent = responseJson['unit_value'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
  tableRow.children[2].className = ''
  tableRow.children[3].textContent = responseJson['total_value'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
  tableRow.children[3].className = ''

  // Hide 'Save', display 'Modify'
  tableRow.children[4].lastElementChild.hidden = true
  tableRow.children[4].firstElementChild.hidden = false
}

const clearTable = function() {
  document.querySelectorAll('table > tr').forEach((element) => element.remove())
  document.querySelectorAll('body > form').forEach((element) => element.remove())
}

const reloadIfRequired = async function() {
  const response = await fetch( '/start_time' )
  const json = await response.json()
  let reloadRequired = json['start_time'] > last_start_time

  if(reloadRequired) {
    alert('Table data is out of date. Reloading data.')
    clearTable()
    loadData()

    fetch( '/start_time' )
      .then((response) => response.json())
      .then((json) => last_start_time = json['start_time'])
  }

  return reloadRequired //true if reloaded, false otherwise
}

const loadData = function() {
  fetch( '/data' )
    .then((response) => response.json())
    .then((json) => json.forEach(element => addTableRow(element)))
}