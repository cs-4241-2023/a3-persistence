const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  login(username, password);
});

const login = async function (username, password) {
  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  });
  const data = await response.json();
  if (data) {
    data.success ? alert("Login successful!") : alert("Created new user!");

    localStorage.setItem("loggedIn", true);
    localStorage.setItem("username", username);
    window.location.href = "todo.html";
  } else {
    alert("Incorrect user info. Please try again.");
  }
};
