let btn = document.getElementById("loginbutton");
let usrnm = document.getElementById("userinput");
let pass = document.getElementById("passinput");

let errorZone = document.getElementById('errortext');

let newAcctBtn = document.getElementById('newacctbutton');
let newUsername = document.getElementById('newusername');
let newPassword = document.getElementById('newpassword')

let users = []

btn.onclick = async function(event) {
    event.preventDefault();

    document.getElementById('errortext').value = "";


    let u = usrnm.value, p = pass.value

    document.getElementById('userinput').value = "";
    document.getElementById('passinput').value = "";

    if(p === '' || u === ''){
        errorZone.innerHTML = "Please enter a username and password";
    }
    else{
        let body = {"username": u, "password": p};
        body = JSON.stringify(body)
        const req = await fetch('/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: body
            })
        console.log("status code: " + req.status);
        if(req.status !== 200){
            errorZone.innerText = "Incorrect Credentials"
            return;
        }
        else{
            window.location.replace(`/index.html?account=${u}`) //redirect to main page
        }
    }
    
    //Verify login in this function. Maybe connect to a different collection that contains login information, or some other way to deal with having to save and have data persist.
}

newAcctBtn.onclick = async function(event){
    event.preventDefault();

    document.getElementById('errortext').value = "";
    

    let u = newUsername.value, p = newPassword.value
    if(p === '' || u === ''){
        errorZone.innerHTML = "Please enter a username and password";
    }
    else{
        let body = {"username": u, "password": p};
        body = JSON.stringify(body);
        const req = await fetch('/newacct', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body
        })
        console.log("status code: " + req.status);
        let acct = await req.json();
        console.log("new account: " + acct);
        errorZone.innerText = `New account ${acct.username} created`
    }

    document.getElementById('newusername').value = "";
    document.getElementById('newpassword').value = ""; 
}

