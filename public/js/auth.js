console.log("Hey have this be the client side log in code")

const auth = async function (e) {
    e.preventDefault();

    let uname = document.getElementById("username").value;
    let pw = document.getElementById("password").value;
    let body = JSON.stringify({uname, pw});

    const response = await fetch("/auth", {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        body: body
    })
}