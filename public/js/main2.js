const submit = async function( event ) {
    event.preventDefault()
    
    const todo = document.querySelector( '#username' ),
          date = document.querySelector( '#password' )
          json = { username: username.value, password: password.value },//, desc: desc.value
          body = JSON.stringify( json )
    console.log(body)
    
    // let response
    //  {
    response = await fetch( '/login', {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: body
    })
    //}
}

// window.onload = function() {
//     const button = document.getElementById("buttonLogin");
//     button.onclick = submit;
// }

window.onload = function() {
    
    const button = document.getElementById("loginButton");
    button.onclick = submit;
  }