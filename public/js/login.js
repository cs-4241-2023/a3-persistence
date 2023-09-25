window.onload = function() {
    const button = document.querySelector("#login");
    const signupbutton = document.querySelector("#signup")
    button.onclick = login;
    signupbutton.onclick = signup;
}

async function login(event) {
    event.preventDefault()

    const body = JSON.stringify({
        'username': document.querySelector("#lg_username").value,
        'password': document.querySelector("#lg_password").value
    })

    const response = await fetch( '/login', {
        method:'POST',
        body 
    })
    
    const text = await response.text()
    const respObj = JSON.parse(text)

    if (respObj.success) {
        window.location.href = "/";
    } else {
        document.querySelector("#lg_fail_text").innerHTML = "Incorrect Username or Password";
    }
}

async function signup(event) {
    event.preventDefault()

    const body = JSON.stringify({
        'username': document.querySelector("#su_username").value,
        'password': document.querySelector("#su_password").value
    })

    const response = await fetch( '/signup', {
        method:'POST',
        body 
    })
    
    const text = await response.text()
    const respObj = JSON.parse(text)

    if (respObj.success) {
        window.location.href = "/";
    } else {
        document.querySelector("#su_fail_text").innerHTML = "User Already Exists!";
    }
}