let presentList = [];
 
const submit = function( e ) {
  e.preventDefault()

  const name  = document.querySelector( '#name' )
  const price   = document.querySelector( '#price'  )
        
  let json = {
    name:  name.value,
    year:   price.value,
  }
  
  name.value  = ""
  price.value   = ""
  
  let body = JSON.stringify(json)
  
  fetch( '/sumbit', {
    method: 'POST',
    body
  })
  .then( function( respose ) {
    fetch( '/fResults', {
    method: 'GET'
  })
  .then( function( response ) {
      response.json().then(function(data) {
        console.log(data)
      });
    })
  })
  
  return false  
  }

const prlist = function (e) {
  e.preventDefault()
  window.location = "prlist.html"
 
}

const clearButton = document.querySelector('#clearButton');
clearButton.addEventListener('click', function (e) {
  e.preventDefault();
  presentList = [];
});

window.onload = function() {
  const sButton = document.querySelector( '#submitButton' )
  sButton.onclick = submit
  
  const rButton = document.querySelector( '#resultsButton' )
  rButton.onclick = prlist
}