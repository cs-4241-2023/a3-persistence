const createUser = async function (event) {
    event.preventDefault();
   
  //get inputs
    const usernameInput = document.querySelector("#username");
    const passwordInput = document.querySelector("#password");
    const REpasswordInput = document.querySelector("#REpassword");
    const balanceInput = document.querySelector("#balance");
  //parse as strings and floats
    const balance = parseFloat(balanceInput.value);
    const username = usernameInput.value;
    const password = passwordInput.value;
    const REpassword = REpasswordInput.value;

    //create new array with data
    const userData = {
      username: username,
      password: password,
      REpassword: REpassword,
      balance: balance
    };

  
    //pass newuser to server and wait for response
    const response = await fetch("/createUser", {
        method: "POST",
        body: JSON.stringify(userData)
    });
    
    const nameDisplay = document.querySelector("#nameDisplay");
    
    if (response.status === 302) {
        // Handle the redirection here, if needed
        console.log("Redirecting...");
        // You might also directly redirect the client, like this:
        // window.location.href = response.url;
    } else {
        const contentType = response.headers.get("content-type");
    
        if (contentType && contentType.includes("application/json")) {
            try {
                const data = await response.json();
                if (response.status === 200) {
                    console.log("Success: User created");
                    nameDisplay.textContent = `New User Created: ${data.username}!`;
                } else if (response.status === 300) {
                    nameDisplay.textContent = `Username: ${data.username} Already Exists.`;
                } else if (response.status === 301) {
                    console.log("Passwords do not match");
                    nameDisplay.textContent = "Passwords do not match";
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
}
document.addEventListener("DOMContentLoaded", function() {
    const createButton = document.querySelector("#createUser");
    createButton.onclick = createUser;
  });