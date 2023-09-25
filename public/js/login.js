// mode is either /login or /signup
// returns {valid: [boolean], message: [string]}
const authenticate = async function(mode, username, password) {

    json = JSON.stringify({
        username: username,
        password: password
    });
  
    const response = await fetch( mode, {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
    },
      body: json 
    })
  
    const serverResponse = await response.json();
    console.log( 'server:', serverResponse );

    const success = serverResponse.status === 200;
    
    // display success/error message
    const messageElement = document.getElementById("message");

    messageElement.textContent = serverResponse.message;
    if (success) messageElement.style.color = "lightgreen";
    else messageElement.style.color = "red";

    // fade message out after one second
    messageElement.style.opacity = '1';
        setTimeout(function() {
            messageElement.style.opacity = '0';
        }, 2000);

    if (success) {
        // redirect to main page
        window.location.href = '/main';
    }
}

window.onload = function() {

    const usernameElement = document.getElementById("username");
    const passwordElement = document.getElementById("password");

    document.getElementById("login").onclick = function() {
        authenticate('/login', usernameElement.value, passwordElement.value);
    };

    document.getElementById("signup").onclick = function() {
        authenticate('/signup', usernameElement.value, passwordElement.value);
    };
}
