const currentAccount = ''

const login = async function( event ) {
  event.preventDefault()
  
  const input1 = document.querySelector( '#user' ),
        input2 = document.querySelector( '#pass' ),
        json = { user: input1.value, pass: input2.value, projects: []},
        body = JSON.stringify( json )

  const response = await fetch( '/login', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body 
  })

  const text = await response.text()
  
  console.log( 'text:', text )
  if (text == 'Unauthorized') {
    invPass.innerHTML = "Invalid Password"
  } else {
    invPass.innerHTML = ""
    var account = JSON.parse(text)
    const currentAccount = account.user
    location.href='account.html?acc='+account.user
  }
  
}

window.onload = function() {
  const button = document.querySelector("#login");
  button.onclick = login;
}