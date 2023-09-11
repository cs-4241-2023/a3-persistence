//FRONT-END (CLIENT) JAVASCRIPT FOR EXISTING MUSIC DELETIONS HERE
const deletionInfo = document.getElementById("submissionForDeletionInfo")
const deletionInfoParagraph = document.createElement('p')

function setDeletionInfoID() {
    deletionInfoParagraph.setAttribute('id', 'deletionInfoPresent')
}

const deletionSubmit = async function(event)
{
    if(document.getElementById("deletionInfoPresent") !== null) {
        console.log("Child will be removed")
        deletionInfo.removeChild(deletionInfoParagraph)
    }
      
    if(document.getElementById("deletionInfoPresent") !== null) {
        console.log("child will be removed")
        deletionInfo.removeChild(deletionInfoParagraph)
    }

    event.preventDefault()

    const currentYear = 2023
    const startingYear = 0

    const bandInput = document.querySelector('#deletebandname') 
    const albumInput = document.querySelector('#deletealbumname')
    const releaseYearInput = document.querySelector('#deletereleaseyear')

    let inputObj = {bandname: bandInput.value, albumname: albumInput.value, releaseyear: releaseYearInput.value}
    
    if(inputObj.bandname.trim().length === 0 || inputObj.albumname.trim().length === 0 || inputObj.releaseyear.trim().length === 0) {
        deletionInfoParagraph.innerHTML = `<strong>The music you submitted cannot be sent to the server</strong>: Missing information in at least one input field.`
        deletionInfo.appendChild(deletionInfoParagraph)
        setDeletionInfoID()
    }
    else if(inputObj.bandname === 'band name here' || inputObj.albumname === 'album name here' || inputObj.releaseyear === 'release year here') {
        deletionInfoParagraph.innerHTML = `<strong>The music you submitted cannot be sent to the server</strong>: Missing information in at least one input field.`
        deletionInfo.appendChild(deletionInfoParagraph)
        setDeletionInfoID()
    }
    else if(inputObj.releaseyear < startingYear) {
        deletionInfoParagraph.innerHTML = `<strong>The music you submitted cannot be sent to the server</strong>: ${inputObj.releaseyear} is not a valid year.`
        deletionInfo.appendChild(deletionInfoParagraph)
        setDeletionInfoID()
    }
    else if(inputObj.releaseyear > currentYear) {
        deletionInfoParagraph.innerHTML = `<strong>The music you submitted cannot be sent to the server</strong>: ${inputObj.albumname} has not been released yet.`
        deletionInfo.appendChild(deletionInfoParagraph)
        setDeletionInfoID()
    }
    else {
        const body = JSON.stringify(inputObj)

        const response = await fetch('/submitForDelete', { 
            method:'DELETE', 
            body 
        })

        const data = await response.json()
        console.log(data)

        deletionInfoParagraph.innerHTML = `<strong>Here is the music that has been sent to the server to compare against existing data. Check View Music Listening List page to see if there was a deletion</strong>: Band Name: ${inputObj.bandname}, Album Name: ${inputObj.albumname}, Release Year: ${inputObj.releaseyear}`
        deletionInfo.appendChild(deletionInfoParagraph)
        setDeletionInfoID()
    }
}

window.addEventListener('load', function() { 
    const deleteMusicButton = document.getElementById("submitMusicForDeletion")
    deleteMusicButton.onclick = deletionSubmit
 })

