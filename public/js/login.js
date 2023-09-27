document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login-form");

    //loginButton.addEventListener("click", () => {
     
      loginForm.addEventListener("submit", (event) => {
        const username = document.querySelector("#Username").value;
        const password = document.querySelector("#Password").value;
        const loginData = {username,password,};
        event.preventDefault(); 

        fetch("/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },body: JSON.stringify(loginData),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              alert(data.message); // Display a success message (replace with your desired action)
            } else {
              alert(data.message); // Display an error message (replace with your desired action)
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    });