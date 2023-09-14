const googleLoginBtn = document.getElementById('googleLoginBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');

if (loginBtn != null) {
    loginBtn.addEventListener('click', function (event) {
        event.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        fetch('/auth/local', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }).then(response => {
            console.log("Received response", response);
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(err => {
                    throw new Error(err.error || 'Invalid username or password.');
                });
            }
        }).then(data => {
            if (data.success) {
                document.location.href = '/expenses.html';
            } else {
                alert('Invalid username or password.');
            }
        }).catch(error => {
            alert('Invalid username or password.');
        });
    });
}

if (googleLoginBtn != null) {
    googleLoginBtn.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = '/auth/google';
    });
}