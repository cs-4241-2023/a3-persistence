//FRONT-END (CLIENT) JAVASCRIPT FOR CAPTURING LATEST ACCOUNT CREATION HERE:
const newUserInfo = document.getElementById("failedAccountCreation")
const newUserInfoParagraph = document.createElement('p')

function setNewUserInfoParagraphID() {
  newUserInfoParagraph.setAttribute('id', 'newUserInfoPresent')
}

function getFirstIndexOfWhiteSpaceInString(inputString) { //The indexOf() method returns the position of the first occurrence of a value in a string.
    return inputString.indexOf(' ')
}

const createAccountSubmit = async function(event) { //The async keyword here means that submit always returns a promise. It also means that one or more await keywords are allowed inside the function body.
  
  if(document.getElementById("newUserInfoPresent") !== null) {
    console.log("Child will be removed")
    loginInfo.removeChild(newUserInfoParagraph)
  }

  event.preventDefault()

  const usern = document.querySelector('#newusername') //query the HTML file for the first element that uses id yourname
  const passw = document.querySelector('#newuserpassword')

  let inputObj = {username: usern.value, password: passw.value}
  console.log(inputObj)

  if(inputObj.username.trim().length === 0 || inputObj.password.trim().length === 0) {
    newUserInfoParagraph.innerHTML = `<strong>The new account information you submitted cannot be sent to the server</strong>: Missing information in at least one input field.`
    newUserInfo.appendChild(newUserInfoParagraph)
    setNewUserInfoParagraphID()
  }
  else if(getFirstIndexOfWhiteSpaceInString(inputObj.username) >= 0 || getFirstIndexOfWhiteSpaceInString(inputObj.password) >= 0) {
    newUserInfoParagraph.innerHTML = `<strong>The new account information you submitted cannot be sent to the server</strong>: Both the username and password cannot contain any whitespace.`
    newUserInfo.appendChild(newUserInfoParagraph)
    setNewUserInfoParagraphID()
  }
  else {
    const body = JSON.stringify(inputObj)

    const response = await fetch('/createNewUser', { 
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body 
    })
  
    const responseMessage = await response.json() 
    
    if(responseMessage.valueOf() === "SuccessfulUserCreation") {
        newUserInfoParagraph.innerHTML = `<strong>Your account has been successfully created</strong>. Now login with your new username and password to access Music Listening Builder features.`
        newUserInfo.appendChild(newUserInfoParagraph)
        setNewUserInfoParagraphID()
    } 
    else if(responseMessage.valueOf() === "ErrorCreatingNewUser") {
        newUserInfoParagraph.innerHTML = `<strong>There was a server error that prevented the creation of a new account for you</strong>.`
        newUserInfo.appendChild(newUserInfoParagraph)
        setNewUserInfoParagraphID()
    }
    else if(responseMessage.valueOf() === "UsernameTakenByPreviousUserCreation") {
        newUserInfoParagraph.innerHTML = `<strong>Your account could not be created as there is already a Music Listening Builder user with the same username as the one you entered. Choose a different username</strong>.`
        newUserInfo.appendChild(newUserInfoParagraph)
        setNewUserInfoParagraphID()
    }
  }
}

window.addEventListener('load', function() { //At the time the window loads, query the HTML document for the first button element. Then, on the left-mouse click of the button submit the form.
  const submitCreateAccountButton = document.getElementById("submitCreateAccount")
  submitCreateAccountButton.onclick = createAccountSubmit
})