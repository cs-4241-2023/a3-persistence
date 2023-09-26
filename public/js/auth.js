console.log("Hey have this be the client side log in code")

const auth = async function (e) {
    e.preventDefault();

    let uname = document.getElementById("username").value;
    let pw = document.getElementById("password").value;
    let body = JSON.stringify({uname, pw});

    const response = await fetch("/auth", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: body
    })
}

const accountCreation = async function (e) {
    e.preventDefault();

    let uname = document.getElementById("username").value;
    let pw = document.getElementById("password").value;
    let body = JSON.stringify({uname, pw});

    const response = await fetch("/newAc", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: body
    })
}

window.onload = function(){
    const login = document.getElementById('login')
    const reg = document.getElementById('register')
    login.onclick = auth;
    reg.onclick = accountCreation;
}