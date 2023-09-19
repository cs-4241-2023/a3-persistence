//FRONT-END (CLIENT) JAVASCRIPT FOR CAPTURING LATEST ACCOUNT LOGIN HERE:
const loginInfo = document.getElementById("loginStatus")
const loginInfoParagraph = document.createElement('p')

function setLoginInfoParagraphID() {
  loginInfoParagraph.setAttribute('id', 'loginInfoPresent')
}

function getFirstIndexOfWhiteSpaceInString(inputString) { //The indexOf() method returns the position of the first occurrence of a value in a string.
    return inputString.indexOf(' ')
}

const loginSubmit = async function(event) { //The async keyword here means that submit always returns a promise. It also means that one or more await keywords are allowed inside the function body.
  
  if(document.getElementById("loginInfoPresent") !== null) {
    console.log("Child will be removed")
    loginInfo.removeChild(loginInfoParagraph)
  }

  event.preventDefault()

  const usern = document.querySelector('#username') //query the HTML file for the first element that uses id yourname
  const passw = document.querySelector('#password')

  let inputObj = {username: usern.value, password: passw.value}
  console.log(inputObj)

  if(inputObj.username.trim().length === 0 || inputObj.password.trim().length === 0) {
    loginInfoParagraph.innerHTML = `<strong>The login information you submitted cannot be sent to the server</strong>: Missing information in at least one input field.`
    loginInfo.appendChild(loginInfoParagraph)
    setLoginInfoParagraphID()
  }
  else if(getFirstIndexOfWhiteSpaceInString(inputObj.username) >= 0 || getFirstIndexOfWhiteSpaceInString(inputObj.password) >= 0) {
    loginInfoParagraph.innerHTML = `<strong>The login information you submitted cannot be sent to the server</strong>: Both the username and password cannot contain any whitespace.`
    loginInfo.appendChild(loginInfoParagraph)
    setLoginInfoParagraphID()
  }
  else {
    const body = JSON.stringify(inputObj)

    const response = await fetch('/userLogin', { 
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body 
    })
  
    const responseMessage = await response.json() 
    
    if(responseMessage.valueOf() === "SuccessfulLogin") {
        location.replace("build_music_listening_list.html")
    } 
    else if(responseMessage.valueOf() === "UserNotFound") {
        loginInfoParagraph.innerHTML = `<strong>User not found</strong>.`
        loginInfo.appendChild(loginInfoParagraph)
        setLoginInfoParagraphID()
    }
    else if(responseMessage.valueOf() === "NoPasswordMatch") {
        loginInfoParagraph.innerHTML = `<strong>Incorrect password entered for user </strong> ${inputObj.username}.`
        loginInfo.appendChild(loginInfoParagraph)
        setLoginInfoParagraphID()
    }
    else if(responseMessage.valueOf() === "InternalServerError") {
        loginInfoParagraph.innerHTML = `<strong>There was an internal server error that prevented successful login</strong>.`
        loginInfo.appendChild(loginInfoParagraph)
        setLoginInfoParagraphID()
    }
  }
}

window.addEventListener('load', function() { //At the time the window loads, query the HTML document for the first button element. Then, on the left-mouse click of the button submit the form.
  const submitLoginButton = document.getElementById("submitLogin")
  submitLoginButton.onclick = loginSubmit
})