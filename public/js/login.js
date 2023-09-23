// Function to redirect to the registration page
const redirectToRegistration = async function() {
    window.location.href = '/swap';
  };
  

// Function to redirect to the login page
const redirectToLogin = async function() {
    window.location.href = '/back'; // Redirect to the /back route I know it's messy.
  }
  

// For Register Button
const register = async function(event) {
    const username = document.querySelector('#login').value;
    const password = document.querySelector('#password').value;
    const json = { username: username, password: password };
  
    const body = JSON.stringify(json);
  
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });
  };
  