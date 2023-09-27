// client-side js
// run by the browser each time your view template is loaded
import { updateTrainingDataDisplay } from "./tracker.js"


// our default array of dreams
const dreams = []

// define variables that reference elements on our page
const userName = document.getElementById("username");
const userPass = document.getElementById("password");

const login = document.getElementById("login");
const register = document.getElementById("register");

console.log(login);
console.log(register);

// listen for a login action
login.onclick = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();

  const user = userName.value;
  const pass = userPass.value;
  
  // consolidate login information for validation
  const profile = {
    "username": user,
    "password": pass
  };

  // reset form 
  userName.value = '';
  userPass.value = '';
  userName.focus();
  
  fetch( '/login', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify(profile)
  })
  .then( response => { if(response.ok) return response.json() })
  .then( json => { 
    if(json.authenticated == 1) {
      const htmlContent = json.htmlContent;
      document.body.innerHTML = htmlContent;
      updateTrainingDataDisplay();
    }
  })
};

// listen for a register action
register.onclick = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();

  const user = userName.value;
  const pass = userPass.value;
  
  // consolidate login information for validation
  const profile = {
    "username": user,
    "password": pass
  };

  // reset form 
  userName.value = '';
  userPass.value = '';
  userName.focus();
  
  fetch( '/register', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify(profile)
  })
  .then( response => response.json() )
  .then( json => console.log( json ) )
};