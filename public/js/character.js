// FRONT-END (CLIENT) JAVASCRIPT HERE

window.addEventListener('load', function() {
  
    document.getElementById("create").onclick = async function( event ) {
      // stop form submission from trying to load
      // a new .html page for displaying results...
      // this was the original browser behavior and still
      // remains to this day
      event.preventDefault()
      
      const name = document.querySelector( '#name').value
      const attack = document.querySelector( '#attack').value
      const defense = document.querySelector( '#defense').value
      const speed = document.querySelector( '#speed').value
      var username = window.localStorage.getItem("user");
      var token = window.localStorage.getItem("token");
      const  json = { name: name, attack: attack, defense: defense, speed: speed, username: username }
      const body = JSON.stringify( json )
      let header = {'Content-Type': 'application/json', 'x-access-token': token}
      const response1 = await fetch( '/api/character/add', {
        method:'POST',
        headers: header,
        body 
      })
      let text = await response1.json()

      const json2 = { username: username }
      const body2 = JSON.stringify( json2 )
      const response2 = await fetch( '/api/character/getCharacters', {
            method:'POST',
            headers: header,
            body 
      })
      text = await response2.json()
      document.getElementById("Homework3").reset()
      createTableFromJSON(text)
    }

    document.getElementById("delete").onclick = async function( event ) {
      // stop form submission from trying to load
      // a new .html page for displaying results...
      // this was the original browser behavior and still
      // remains to this day
      event.preventDefault()
      
      const radio_elements = document.getElementsByName('type_radio')
      var name = null
  
      for (let i=0; i < radio_elements.length; i++) {
        if (radio_elements[i].checked) {
          name = radio_elements[i].value
          break
        }
      }
      let json = { name: name }
      let body = JSON.stringify( json )
      const token = window.localStorage.getItem("token");
      const username = window.localStorage.getItem("user");
      const header = {'Content-Type': 'application/json', 'x-access-token': token}
      const response1 = await fetch( '/api/character/delete', {
        method:'POST',
        headers: header,
        body 
      })
  
      let text = await response1.json()

      json = { username: username}
      body = JSON.stringify( json )
      const response2 = await fetch( '/api/character/getCharacters', {
        method:'POST',
        headers: header,
        body 
      })
      text = await response2.json()
      createTableFromJSON(text)
    }

    document.getElementById("get").onclick = async function( event ) {
      // stop form submission from trying to load
      // a new .html page for displaying results...
      // this was the original browser behavior and still
      // remains to this day
      event.preventDefault()
      
      const username = window.localStorage.getItem("user");
      const token = window.localStorage.getItem("token");
      var json = { "username": username }
      var body = JSON.stringify( json )
      const header = {'Content-Type': 'application/json', 'x-access-token': token}
      response = await fetch( '/api/character/getCharacters', {
        method:'POST',
        headers: header,
        body 
      })
      text = await response.json()
      document.getElementById("Homework3").reset()
      createTableFromJSON(text)
    }
    
    function createTableFromJSON(json) {
      let placeholder = document.querySelector("#data-output");
        let out = "";
        console.log(json.length)
        for(let i = 0; i < json.length; i++) {
          let product = json[i]
          out += `
              <tr>
                  <td><input value=${product.name} name="type_radio" type="radio"> </td>
                  <td>${product.name}</td>
                  <td>${product.attack}</td>
                  <td>${product.defense}</td>
                  <td>${product.speed}</td>
                  <td>${product.average}</td>
                  <td>${product.recommended}</td>
              </tr>
            `;
        }
        placeholder.innerHTML = out;
        console.log(out)
    }
});

