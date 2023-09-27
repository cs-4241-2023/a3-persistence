let play = []

window.onload = function() {
  fetch( '/fResults', {
    method: 'GET'
  })
  .then( function( response ) {
    response.json().then(function(data) {
      play = Object.values(data)
      createTable()
      
      const bButton = document.querySelector( '#backButton' )
       bButton.onclick = backIndex
    })
  })
}

const createTable = function() {
  let row = "<table id= dTable>"
      row += "<tr>"
      row += "<td>Present Name</td>"
      row += "<td>Price</td>"
      row += "</tr>"

      
      for(let i=0; i<play.length; i++) {
        
        row += "<tr>"
        row += "<td>"+play[i].name+"</td>"
        row += "<td>"+play[i].price+"</td>"
        row += "<tr>" 
      }
      
      row += "</table>"
      document.getElementById('createTable').innerHTML = row
}

const backIndex = function( e ) {
  e.preventDefault();
  window.location = "index.html"
}