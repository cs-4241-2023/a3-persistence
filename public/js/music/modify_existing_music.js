//FRONT-END (CLIENT) JAVASCRIPT FOR MODIFY EXISTING MUSIC HERE
const modifyInfo = document.getElementById("submissionForModifyInfo")
const modifyInfoParagraph = document.createElement('p')
const additionalModifyInfoParagraph = document.createElement('p')

function setModifyInfoParagraphID() {
  modifyInfoParagraph.setAttribute('id', 'modifyInfoPresent')
}

function setAdditionalModifyInfoParagraphID() {
  additionalModifyInfoParagraph.setAttribute('id', 'additionalModifyInfoPresent') 
}

const modifySubmit = async function(event) { //The async keyword here means that submit always returns a promise. It also means that one or more await keywords are allowed inside the function body.
  
  if(document.getElementById("modifyInfoPresent") !== null) {
    console.log("Child will be removed")
    modifyInfo.removeChild(modifyInfoParagraph)
  }
  
  if(document.getElementById("additionalModifyInfoPresent") !== null) {
    console.log("child will be removed")
    modifyInfo.removeChild(additionalModifyInfoParagraph)
  }

  //preventDefault cancels an event as long as it is cancelable.
  //stop form submission from trying to load
  //a new .html page for displaying results...
  //this was the original browser behavior and still
  //remains to this day
  event.preventDefault()

  //Take in three different inputs
  //Create object using key-value pairs  
  
  const currentYear = 2023
  const startingYear = 0

  const IDInput =  document.querySelector('#enterlistID') //IDInput is a string even when the input type is set to number
  const bandInput = document.querySelector('#modifybandname') //query the HTML file for the first element that uses id yourname
  const albumInput = document.querySelector('#modifyalbumname')
  const releaseYearInput = document.querySelector('#modifyreleaseyear')

  //Proper format of JSON when there is a list of objects: [{a1:o1}, {a2:o2}, {a3:o3}]
  //The structure of the object before stringification and parsing should match the structure of an object entry in the destination array.
  let inputObj = {ID: IDInput.value, bandname: bandInput.value, albumname: albumInput.value, releaseyear: releaseYearInput.value}
  console.log(inputObj)

  if(inputObj.ID.toString().trim().length === 0 || inputObj.bandname.trim().length === 0 || inputObj.albumname.trim().length === 0 || inputObj.releaseyear.trim().length === 0) {
    modifyInfoParagraph.innerHTML = `<strong>The music you submitted cannot be processed</strong>: Missing information in at least one input field.`
    modifyInfo.appendChild(modifyInfoParagraph)
    setModifyInfoParagraphID()
  }
  else if(inputObj.ID < 0) {
    modifyInfoParagraph.innerHTML = `<strong>The music you submitted cannot be processed</strong>: ${inputObj.ID} is not a valid ID.`
    modifyInfo.appendChild(modifyInfoParagraph)
    setModifyInfoParagraphID()
  }
  else if(inputObj.releaseyear < startingYear) {
    modifyInfoParagraph.innerHTML = `<strong>The music you submitted cannot be processed</strong>: ${inputObj.releaseyear} is not a valid year.`
    modifyInfo.appendChild(modifyInfoParagraph)
    setModifyInfoParagraphID()
  }
  else if(inputObj.releaseyear > currentYear) {
    modifyInfoParagraph.innerHTML = `<strong>The music you submitted cannot be processed</strong>: ${inputObj.albumname} has not been released yet.`
    modifyInfo.appendChild(modifyInfoParagraph)
    setModifyInfoParagraphID()
  }
  else {
    const body = JSON.stringify(inputObj)

    //await works only inside async functions. 
    //await keyword makes JavaScript wait until the promise resolves.
    //fetch method goes as follows: let promise = fetch(url, [options])
      //URL
      //Optional parameters include method, headers, and more.
  
    //We have two promises here:
      //The response to the form submit
      //The text of the response body

    const response = await fetch('/submitForModification', { //wait until the fetch of the response to the form submit resolves to store the response.
      method: 'PUT', //pass in the HTTP method (so sending new data to server through POST)
      headers: {'Content-Type': 'application/json'},
      body //pass in the response body
    })

    const data = await response.json() //Here, JSON is parsed to produce a JavaScript object
    const latestModifiedDataEntry = data.find((e) => parseInt(e.ID) === parseInt(inputObj.ID))

    console.log(typeof(inputObj.ID))

    //Template literals
    modifyInfoParagraph.innerHTML = `<strong>Here is the modified music saved for your account</strong>. Click the Get Music Listening List button to refresh and view the music data to see the modification for list item with ID ${latestModifiedDataEntry.ID}: Band Name: ${latestModifiedDataEntry.bandName}, Album Name: ${latestModifiedDataEntry.albumName}, Release Year: ${latestModifiedDataEntry.releaseYear}`
    additionalModifyInfoParagraph.innerHTML = `<strong>And here is the age of</strong> ${latestModifiedDataEntry.albumName}: ${latestModifiedDataEntry.albumAge}`

    modifyInfo.appendChild(modifyInfoParagraph)
    modifyInfo.appendChild(additionalModifyInfoParagraph)
    setModifyInfoParagraphID()  
    setAdditionalModifyInfoParagraphID()
  }
}

window.addEventListener('load', function() { //At the time the window loads, query the HTML document for the first button element. Then, on the left-mouse click of the button submit the form.
  const modifyMusicButton = document.getElementById("submitMusicForModification")
  modifyMusicButton.onclick = modifySubmit
})
