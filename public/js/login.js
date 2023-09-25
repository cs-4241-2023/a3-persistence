const login = async function (event) {
    event.preventDefault();
   
  //get inputs
    const usernameInput = document.querySelector("#username");
    const passwordInput = document.querySelector("#password");

  //parse as strings and floats
   
    const username = usernameInput.value;
    const password = passwordInput.value;


    //create new array with data
    const userData = {
      username: username,
      password: password,
    };

  
    //pass newuser to server and wait for response
    const response = await fetch("/login", {
        method: "POST",
        body: JSON.stringify(userData)
    });
    
    const nameDisplay = document.querySelector("#error-message");

        const contentType = response.headers.get("content-type");
    
        if (contentType && contentType.includes("application/json")) {
            try {
                const data = await response.json();
                if (response.status === 404) {
                    nameDisplay.textContent = `Username: ${data.username} could not be found.`;
                } else if (response.status === 400) {
                    console.log("incorrect password");
                    nameDisplay.textContent = `Password for ${data.username} was incorrect `;
                } else {
                    console.error("Error: " + response.status);
                    nameDisplay.textContent = "Error: " + response.status;
                }
            } catch (error) {
                console.error("Error while parsing JSON:", error);
                console.log("Response as HTML:", await response.text());
                // You might display the HTML response or handle it differently.
            }
        } else if (contentType && contentType.includes("text/html")) {
            // Handle the HTML response
            const htmlResponse = await response.text();
            // Display the HTML response or handle it as needed
            // For example, you can set the content of an element with the HTML
           document.documentElement.innerHTML = htmlResponse;
           window.location.replace('/index.html');
        } else {
            console.error("Unexpected content type:", contentType);
            console.log("Response as text:", await response.text());
            // Handle other unexpected content types here.
        }
    }

document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.querySelector("#logIn");
    loginButton.onclick = login;
  });