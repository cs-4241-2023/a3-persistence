document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const result = await response.json();
        if (result.success) {
            window.location.href = "/"; // Redirect to the main page
        } else {
            alert("Invalid login credentials.");
        }
    } else {
        alert("Error logging in.");
    }
});
