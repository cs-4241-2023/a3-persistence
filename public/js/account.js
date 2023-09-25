const currentAccount = location.href.split('=').pop()

const add = async function(event) {
  const input = document.querySelector('#addP'),
        json = {user: currentAccount, name: input.value},
        body = JSON.stringify(json)
  
  const response = await fetch('/add', {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body 
  })

  const text = await response.text()
  
  var table = makeTable(text)

  results.replaceChild(table, results.childNodes[0])
}

const remove = async function(event) {
  const input = document.querySelector('#delP'),
        json = {user: currentAccount, name: input.value},
        body = JSON.stringify(json)
  
  const response = await fetch('/remove', {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body 
  })

  const text = await response.text()
  
  var table = makeTable(text)

  results.replaceChild(table, results.childNodes[0])
}

const update = async function(event) {
  const input = document.querySelector('#upPName'),
        input2 = document.querySelector('#upPVal'),
        json = {user: currentAccount, name: input.value, new: input2.value},
        body = JSON.stringify(json)
  
  const response = await fetch('/update', {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body 
  })

  const text = await response.text()
  
  var table = makeTable(text)

  results.replaceChild(table, results.childNodes[0])
}

const info = async function(event) {
  
  const json = {user: currentAccount},
        body = JSON.stringify(json)
  
  const response = await fetch('/info', {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body 
  })

  const text = await response.text()
  console.log(text)
  
  var table = makeTable(text)

  results.replaceChild(table, results.childNodes[0])
  
}

const logout = async function(event) {
  location.href='index.html'
}

function makeTable(text) {
  var tableData = JSON.parse(text)
  table = document.createElement("table")
  columns = ['Projects']

  thead = document.createElement("thead")
  tr = document.createElement("tr")

  columns.forEach((element) => {
    th = document.createElement("th")
    th.innerText = element
    tr.appendChild(th)
  });
  thead.appendChild(tr)
  table.appendChild(tr)
  
  
  
  console.log(tableData)
  tableData.forEach((element) => {
    values = Object.values(element)
    values[3].forEach((element) => {
      tr = document.createElement("tr")
      td = document.createElement("td")
      td.innerText = element
      tr.appendChild(td)
      table.appendChild(tr)
    })
    
});

  return table
}

window.onload = function() {
  const button = document.querySelector("#logout")
  button.onclick = logout;
  const button2 = document.querySelector("#info")
  button2.onclick = info
  const button3 = document.querySelector("#add")
  button3.onclick = add
  const button4 = document.querySelector("#delete")
  button4.onclick = remove
  const button5 = document.querySelector("#update")
  button5.onclick = update
  username.innerHTML = currentAccount
  info()
}