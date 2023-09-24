
const modifyData = async function(event_button) {
  const tableRow = event_button.parentElement.parentElement
  const _id = tableRow.id

  const newForm = document.createElement('form')
  newForm.id = 'form:' + _id
  newForm.autocomplete = 'off'
  newForm.action = '/modify'
  newForm.method = 'POST'
  document.body.appendChild(newForm)

  const idInput = document.createElement('input')
  idInput.type = 'hidden'
  idInput.name = '_id'
  idInput.value = _id
  newForm.appendChild(idInput)


  const itemData = tableRow.children[0]
  const itemInput = document.createElement('input')
  itemInput.value = itemData.textContent
  itemData.textContent = ''
  itemData.className = 'modifyTD'
  itemData.appendChild(itemInput)
  itemInput.type = 'text'
  itemInput.name = 'item'
  itemInput.required = true
  itemInput.setAttribute('form', 'form:'+_id)

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
  amountInput.max = 999999999999
  amountInput.setAttribute('form', 'form:'+_id)

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
  valueInput.setAttribute('form', 'form:'+_id)

  // Hide 'Modify', display 'Save'
  event_button.hidden = true
  event_button.parentElement.lastElementChild.hidden = false
}
