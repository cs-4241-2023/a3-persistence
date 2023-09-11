//FRONT-END (CLIENT) JAVASCRIPT FOR SHOWING ALL MUSIC IN SERVER MEMORY
const listDivision = document.getElementById("musicList")
const musicList = document.createElement('ul')
const listEmptyMessage = document.createElement('p')

function setUnorderedListID() {
    musicList.setAttribute('id', 'unorderedListPresent')
}

function setListEmptyMessagePresentID() {
    listEmptyMessage.setAttribute('id', 'listEmptyMessagePresent')
}

const showMusicListeningList = async function(event) {

    if(document.getElementById("unorderedListPresent") !== null) {
        console.log("Child will be removed")
        listDivision.removeChild(musicList)
        
        while(musicList.hasChildNodes())
        {
            musicList.removeChild(musicList.firstChild)
        }
    }
    else if(document.getElementById("listEmptyMessagePresent") !== null)
    {
        console.log("empty list message will be removed")
        listDivision.removeChild(listEmptyMessage)
    }

    const requestURL = '/getMusicData'
    event.preventDefault()

    const response = await fetch(requestURL, {
        method:'GET'
    })

    const data = await response.json()
    console.log(data)

    if(data.length === 0) {
        listEmptyMessage.innerHTML = '<strong>All music has been deleted from the server memory.</strong>'
        listDivision.appendChild(listEmptyMessage)
        setListEmptyMessagePresentID()
    }
    else {
        data.forEach(d => {
            const musicItem = document.createElement('li')
            console.log(musicItem)
            musicItem.innerHTML = `<strong>Band Name</strong>: ${d.bandName}, <strong>Album Name</strong>: ${d.albumName}, <strong>Release Year</strong>: ${d.releaseYear}, <strong>Album Age</strong>: ${d.albumAge}` //Template literal example
            musicList.appendChild(musicItem)
        })
    
        listDivision.appendChild(musicList)
        setUnorderedListID()
    }
}

window.addEventListener('load', function() { //At the time the window loads, query the HTML document for the first button element. Then, on the left-mouse click of the button submit the form. 
    const getMusicButton = document.getElementById("getMusic")
    getMusicButton.onclick = showMusicListeningList
})

