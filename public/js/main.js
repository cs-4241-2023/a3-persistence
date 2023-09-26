// FRONT-END (CLIENT) JAVASCRIPT HERE

window.addEventListener('load', function() {

    document.getElementById("signin").onclick = async function( event ) {
      // stop form submission from trying to load
      // a new .html page for displaying results...
      // this was the original browser behavior and still
      // remains to this day
      event.preventDefault()
      
      const username = document.querySelector( '#username').value
      const password = document.querySelector( '#password').value
      var json = { "username": username, "password": password }
      var body = JSON.stringify( json )
      var response = await fetch( '/api/auth/signin', {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body 
      })
  
      var text = await response.json()
      console.log( 'text:', text )
      
      const token = text.accessToken;
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("user", username);
      console.log(token)
      /*
      const header = {'Content-Type': 'application/json', 'x-access-token': token}

      response = await fetch( '/api/character/getCharacters', {
        method:'POST',
        headers: header,
        body 
      })
      text = await response.json()
      console.log( 'text:', text )
      //window.location.href("/index.html")
      //document.getElementById("Homework3").reset()
      window.location.replace("/character.html")
      createTableFromJSON(text)
      */
      window.location.replace("/character.html")
    }

    document.getElementById("signup").onclick = async function( event ) {
      // stop form submission from trying to load
      // a new .html page for displaying results...
      // this was the original browser behavior and still
      // remains to this day
      event.preventDefault()
      
      const username = document.querySelector( '#username').value
      const password = document.querySelector( '#password').value
      var json = { "username": username, "password": password }
      var body = JSON.stringify( json )
      var response = await fetch( '/api/auth/signup', {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body 
      })
      var text = await response.json()
      console.log( 'text:',  text)   
      document.getElementById("Signscreen").reset()
      //window.location.replace("/character.html")
    }
});
  
