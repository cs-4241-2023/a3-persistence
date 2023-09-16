// FRONT-END (CLIENT) JAVASCRIPT HERE
const urlParams = new URLSearchParams(window.location.search)
const acct = urlParams.get("account");

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const name = document.querySelector( '#artistname' ),
        genre = document.querySelector('#genre'),
        rating = document.querySelector('#rating'),
        json = { Artist: name.value, Genre: genre.value, Rating: rating.value, Account: acct},
        body = JSON.stringify( json )
  


  if(isNaN(+rating.value) || +rating.value < 0 || +rating.value > 10){
    document.getElementById("errorzone").innerText = "Please make sure that the rating is a valid number between 1 and 10"
    console.log("rating was invalid");
  }
  else{
    const response = await fetch( '/submit', {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body 
  })

  const text = await response.text()

  let data = JSON.parse(text);
  updateArtists(data);
  
  
  name.value = ""
  genre.value = ""
  rating.value = ""
  }

}

function updateArtists(artistList){
  document.getElementById("artistList").innerHTML = '';
  document.getElementById("errorzone").innerText = '';
  if(artistList.length === 0){
    updateFavoriteArtist(0);
  }
  for(let i = 0; i < artistList.length; i++){
    console.log("artistList[i]: " + artistList[i])
    if(artistList[i] !== undefined && artistList[i].Account === acct){
      let listElement = document.createElement('li');
      listElement.innerHTML = `Artist: <b>${artistList[i].Artist}</b><br> Genre: ${artistList[i].Genre}<br> Rating: ${artistList[i].Rating}<br> Leaderboard Ranking: ${artistList[i].Ranking}<br>`;
      listElement.id = `list${artistList[i].id}`; // don't know if I need this
      document.getElementById("artistList").appendChild(listElement);
      if(artistList[i].Ranking === 1){
        updateFavoriteArtist(artistList[i]);
      }
    }

  }
  
}

let fonts = ["Amatic SC, cursive",
"Chakra Petch, sans-serif",
"Cinzel, serif",
"Gruppo, sans-serif",
"Handjet, cursive",
"Poiret One, cursive",
"Rye, cursive"];

function updateFavoriteArtist(artist){
  if(artist === 0){
    document.getElementById("favartistlabel").innerHTML = 'No artists in database';
    document.getElementById('favrating').innerHTML = '';
  }
  else{
    document.getElementById("favartistlabel").innerHTML = `Your favorite artist is:<br>${artist.Artist}`;
    document.getElementById("favrating").innerHTML = `Rating: ${artist.Rating}`;

    let rand = Math.floor(Math.random()*7);
    document.getElementById("favartistinfo").style.fontFamily = fonts[rand];
  }
}

const remove = async function(artist, event){
  event.preventDefault();
  const response = await fetch('/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: artist
  })
  let srvResp = await response.json()
  if(response.status === 400){
    updateArtists(srvResp)
    document.getElementById("errorzone").innerText = "Cannot find this artist in the database :("
  }
  else{
    updateArtists(srvResp)
  }
  document.getElementById("delArtist").value = ""
}

async function getData(){
  const response = await fetch('/artists', {
    method: 'GET'
  })
  let data = await response.json();
  updateArtists(data);
}

window.onload = function() {
   const subbutton = document.querySelector("#submitbutton");
  subbutton.onclick = submit;

  const delbutton = document.getElementById("deletebutton");
  delbutton.onclick = function(event) {
    remove(document.getElementById("delArtist").value, event);
  }

  getData();
}

