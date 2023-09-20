let btn = document.getElementById("loginbutton");
let usrnm = document.getElementById("userinput");
let pass = document.getElementById("passinput");

let errorZone = document.getElementById('errortext');

let newAcctBtn = document.getElementById('newacctbutton');
let newUsername = document.getElementById('newusername');
let newPassword = document.getElementById('newpassword')

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
        if(req.status !== 200){
            errorZone.innerText = `Account ${document.getElementById('newusername').value} already exists`
        }
        else{
            let acct = await req.json();
            console.log("new account: " + acct);
            errorZone.innerText = `New account ${acct.username} created` 
            addToAcctList(acct) 
        }
    }
    document.getElementById('newusername').value = "";
    document.getElementById('newpassword').value = ""; 
}

const addToAcctList = function(account){
    let element = document.createElement("li")
    element.innerHTML = `${account.username}`
    document.getElementById("acctlist").appendChild(element)
}

const getUsers = async function(){
    const response = await fetch("/users", {
        method:"GET"
    })
    const data = await response.json();
    console.log("data: " + data)
    return data
}

window.onload = async function(){
    const users = await getUsers()
    console.log(users)
    for(let i = 0; i < users.length; i++){
        console.log("users: " + users[i])
        addToAcctList(users[i])
    }
}

