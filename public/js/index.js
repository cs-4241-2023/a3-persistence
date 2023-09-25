document
  .querySelector("#login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    const body = {
      username: username,
      password: password,
    };

    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.status === 200) {
        console.log("successful login")
        window.location.href = '/task.html'
    } else if (response.status === 401) {
      alert("Password incorrect, please try again.");
    } else if (response.status === 404) {
      alert(
        "User not found, creating account with given username and password. Please enter the username and password again."
      );
    }
  });
