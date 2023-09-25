// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
 const input = document.querySelector( '#yourname' ),
        input2 = document.querySelector('#meetname'),
        input3 = document.querySelector('#locationname'),
        input4 = document.querySelector('#datetime'),
        json = { yourname: input.value, meetname: input2.value, locationname: input3.value, datetime: input4.value},
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })
  const today = new Date()
  //console.log(today)
  
  const text = await response.text()
  //console.log(JSON.parse(text))
  const data = JSON.parse(text)
  const list = document.createElement('ul')
    data.forEach( d =>{
    const meet = document.createElement('li')
    meet.innerHTML = `<b>Meeting Name</b>: ${d.name} | <b>Location</b>: ${d.location} | <b>Date</b>: ${d.date} | <b>Days Till Meeting</b>: ${d.daysTill}`
    list.appendChild(meet)
  })
  
  document.body.replaceChild(list,document.body.lastChild)
  
  //console.log( 'text:', text)
}

const additon = async function( event ) {
   event.preventDefault()
  
 const input = document.querySelector( '#yourname' ),
        input2 = document.querySelector('#meetname'),
        input3 = document.querySelector('#locationname'),
        input4 = document.querySelector('#datetime'),
        json = { yourname: input.value, meetname: input2.value, locationname: input3.value, datetime: input4.value},
        body = JSON.stringify( json )

  
const add = await fetch('/add', {
  method:'POST',
  headers: {'Content-Type': 'application/json'},
  body:JSON.stringify( json )
})
const data = await add.json()
showData(data)
console.log(data)
  
}

const deletion = async function( event ){
  event.preventDefault()
  const input2 = document.querySelector('#meetname'),
        json = {name: input2.value}
  
  const remove = await fetch('/remove',{
  method:'POST',
  headers: {'Content-Type': 'application/json'},
  body:JSON.stringify(json)
})
  const data = await remove.json()
  showData(data)
  console.log(data)
}

const updateMeet = async function ( event ){
     
  event.preventDefault()
  
 const input = document.querySelector( '#yourname' ),
        input2 = document.querySelector('#meetname'),
        input3 = document.querySelector('#locationname'),
        input4 = document.querySelector('#datetime'),
        json = { yourname: input.value, meetname: input2.value, locationname: input3.value, datetime: input4.value},
        body = JSON.stringify( json )
 const update = await fetch('/update',{
  method:'POST',
  headers: {'Content-Type': 'application/json'},
  body:JSON.stringify( json )
})
  const data = await update.json()
  showData(data)

}

const authorize = async function (event){
  event.preventDefault()
  const input = document.querySelector('#yourname'),
        input2 = document.querySelector('#yourpass'),
        json = {username: input.value, password: input2.value}
  
  const login = await fetch('/login',{
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body:JSON.stringify( json )
  })
  const data = await login.json()
  console.log(data)
  if(data != null){
    unlock()
    showData(data)
  }
}
function unlock(){
  document.getElementById("submitButton").disabled = true
  document.getElementById("yourname").disabled = true
  document.getElementById("yourpass").disabled = true
  document.getElementById("meetname").disabled = false
  document.getElementById("locationname").disabled = false
  document.getElementById("datetime").disabled = false
  document.getElementById("deleteButton").disabled = false
  document.getElementById("updateButton").disabled = false
  document.getElementById("addButton").disabled = false
}

function showData(datajson){
  //console.log(JSON.parse(text))
  //const data = JSON.parse(datajson)
  const list = document.createElement('ul')
    datajson.forEach( d =>{
    const meet = document.createElement('li')
    meet.innerHTML = `<b>Meeting Name</b>: ${d.name} | <b>Location</b>: ${d.location} | <b>Date</b>: ${d.date} | <b>Days Till Meeting</b>: ${d.daysTill}`
    list.appendChild(meet)
  })
  
  document.body.replaceChild(list,document.body.lastChild)
}

window.onload = function() {
  const loginButton = document.getElementById("submitButton");
  loginButton.onclick = authorize;
  const deleteButton = document.getElementById("deleteButton");
  deleteButton.onclick =  deletion;
  const updateButton = document.getElementById("updateButton");
  updateButton.onclick = updateMeet;
  const addButton = document.getElementById("addButton");
  addButton.onclick =  additon;
}