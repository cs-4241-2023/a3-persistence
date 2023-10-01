const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  //   console.log(username, password);
  const data = {
    username: username,
    password: password,
  };

  // Send the data to the backend using fetch
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {
        window.location.href = "/index.html";
      } else if (response.status === 201) {
        response.json().then((data) => {
          alert(data.message);
          window.location.href = "/index.html";
        });
      } else {
        alert("Invalid username or password");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error logging in. Please try again.");
    });
});
