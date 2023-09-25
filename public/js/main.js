// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input1 = document.querySelector( '#yourName' ),
        input2 = document.querySelector( '#yourKills' ),
        input3 = document.querySelector( '#yourDeaths' ),
        input4 = document.querySelector( '#yourAssists' ),
        json = { id: ++largestIdSoFar, yourName: input1.value , yourKills: Number(input2.value),
                 yourDeaths: Number(input3.value), yourAssists: Number(input4.value)},
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body 
  })

  const data = await response.json()

  appending(data)


}

let largestIdSoFar = 0

const deleteEvent = async function( event ){

  const parent = this.parentElement.parentElement
  const data = parent.children

  let json = { id: Number(parent.id) , yourName: data[0].textContent, yourKills: Number(data[1].textContent),  yourDeaths: Number(data[2].textContent),
          yourAssists: Number(data[3].textContent),  KDA: Number(data[4].textContent)}
  let body = JSON.stringify(json) 

  const response = await fetch( '/delete', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body 
  })
        
  parent.remove()

}

const modifyEvent = async function( event ){
  const parent = this.parentElement.parentElement
  const data = parent.children

  document.querySelectorAll('button').forEach(e => e.hidden = false) 

  document.querySelector('#modify').hidden = false 
  this.hidden = true
  modifyID = Number(parent.id)

  

}

let modifyID = -1;

const modifyHelp = async function ( event ){
  event.preventDefault()

  const input1 = document.querySelector( '#modifyName' ),
  input2 = document.querySelector( '#modifyKills' ),
  input3 = document.querySelector( '#modifyDeaths' ),
  input4 = document.querySelector( '#modifyAssists' ),
  json = { id: modifyID, yourName: input1.value , yourKills: Number(input2.value),
           yourDeaths: Number(input3.value), yourAssists: Number(input4.value)},
  body = JSON.stringify( json )

  const response = await fetch( '/modify', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body 
  })

  const data = await response.json()

  let rowData = document.getElementById(`${modifyID}`).children

  rowData[0].textContent = data.yourName
  rowData[1].textContent = data.yourKills
  rowData[2].textContent = data.yourDeaths
  rowData[3].textContent = data.yourAssists
  rowData[4].textContent = data.KDA

  hideModify()

}

const hideModify = function(){

  document.querySelectorAll('button').forEach(e => e.hidden = false) 
  document.querySelector('#modify').hidden = true

}

window.onload = async function() {
  const form = document.querySelector('#submission');
  form.onsubmit = submit;

  const formModify = document.querySelector('#modify');
  formModify.onsubmit = modifyHelp;

  const cancel = document.querySelector('#cancelButton');
  cancel.onclick = hideModify;

  const response = await fetch( '/start' )
  const appData = await response.json()

  for(let i=0; i < appData.length; i++){
    appending(appData[i])
  }
  console.log(appData)


}

const appending = function(data) {

  const table = document.querySelector("#scoreData")

  const row = document.createElement('tr')
  table.appendChild(row)
  row.id = data.id
  if(data.id > largestIdSoFar){
    largestIdSoFar = data.id
  }
  row.className = "c-table__row"

  const column1 = document.createElement('td')
  row.appendChild(column1)
  column1.textContent = data.yourName
  column1.className = "c-table__cell"

  const column2 = document.createElement('td')
  row.appendChild(column2)
  column2.className = "values"
  column2.textContent = data.yourKills
  column2.className = "c-table__cell"

  const column3 = document.createElement('td')
  column3.className = "values"
  row.appendChild(column3)
  column3.textContent = data.yourDeaths
  column3.className = "c-table__cell"

  const column4 = document.createElement('td')
  column4.className = "values"
  row.appendChild(column4)
  column4.textContent = data.yourAssists
  column4.className = "c-table__cell"

  const column5 = document.createElement('td')
  column5.className = "values"
  row.appendChild(column5)
  column5.textContent = data.KDA
  column5.className = "c-table__cell"

  const button = document.createElement('button')
  const buttonColumn = document.createElement('td')
  buttonColumn.appendChild(button)
  row.appendChild(buttonColumn)
  buttonColumn.className = "c-table__cell"
  button.textContent = "Delete"
  button.onclick = deleteEvent
  button.className = "c-button"

  const button1 = document.createElement('button')
  const buttonColumn1 = document.createElement('td')
  buttonColumn1.appendChild(button1)
  row.appendChild(buttonColumn1)
  buttonColumn1.className = "c-table__cell"
  button1.textContent = "Modify"
  button1.onclick = modifyEvent
  button1.className = "c-button"




}