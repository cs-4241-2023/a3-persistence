
const reloadIfRequired = async function() {
  const response = await fetch( '/last_updated' )
  const json = await response.json()
  let reloadRequired = json['last_updated'] > last_updated

  if(reloadRequired) {
    alert('Table data is out of date. Reloading data.')
    clearTable()
    loadData()

    last_updated = json['last_updated']
  }

  return reloadRequired //true if reloaded, false otherwise
}

const clearTable = function() {
  document.querySelectorAll('table > tr').forEach((element) => element.remove())
  document.querySelectorAll('body > form').forEach((element) => element.remove())
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
    headers: { 'Content-Type': 'application/json' },
    body 
  })
  last_updated = Date.now()

  const responseJson = await response.json()

  addTableRow(responseJson)
  document.querySelector('#inputForm').reset()
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
    headers: { 'Content-Type': 'application/json' },
    body
  })
  last_updated = Date.now()

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
  amountInput.max = 999999999
  amountInput.setAttribute('form', 'form:'+uuid)

  const valueData = tableRow.children[2]
  const valueInput = document.createElement('input')
  valueInput.value = valueData.textContent.replace('$', '').replaceAll(',', '')
  valueData.textContent = ''
  valueData.className = 'modifyTD'
  valueData.appendChild(valueInput)
  valueInput.type = 'number'
  valueInput.name = 'unit_value'
  valueInput.required = true
  valueInput.min = 0
  valueInput.max = 999999999
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
    headers: { 'Content-Type': 'application/json' },
    body 
  })
  last_updated = Date.now()

  const responseJson = await response.json()

  tableRow = document.getElementById(uuid)

  tableRow.children[0].textContent = responseJson['item']
  tableRow.children[0].className = ''
  tableRow.children[1].textContent = numberFormat.format(responseJson['amount'])
  tableRow.children[1].className = ''
  tableRow.children[2].textContent = currencyFormat.format(responseJson['unit_value'])
  tableRow.children[2].className = ''
  tableRow.children[3].textContent = currencyFormat.format(responseJson['total_value'])
  tableRow.children[3].className = ''

  // Hide 'Save', display 'Modify'
  tableRow.children[4].lastElementChild.hidden = true
  tableRow.children[4].firstElementChild.hidden = false
}

