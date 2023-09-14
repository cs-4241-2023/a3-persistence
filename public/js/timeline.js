
const addTimelineItem = async function (event) {


  event.preventDefault()

  const eraInput = document.querySelector('#era');
  const dateInput = document.querySelector('#date');
  const descriptionInput = document.querySelector('#description');
  console.log(dateInput.value);
  const errorMsg = document.getElementById("timelineErrorMessage")
  if (isNaN(dateInput.value)) {
    errorMsg.style.display = "block";
    return false;
  } else {

    document.getElementById("timelineErrorMessage").style.display = "none";

    const json = { era: eraInput.value, date: parseInt(dateInput.value), description: descriptionInput.value }, body = JSON.stringify(json)

    const response = await fetch('/submit', {
      method: 'POST',
      body
    })

    const data = await response.json()

    console.log('text:', data)
    CreateTimeline(data);
    return true;
  }
}


function CreateTimeline(data) {
  const timeline = document.getElementById("myTimeline")

  timeline.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const timelineItem = document.createElement("div");
    timelineItem.id= "timelineItem" + i; 
    const deleteButton = document.createElement("button");
    deleteButton.id = "timelineDeleteButton";
    deleteButton.innerHTML = "X";

    const modifyButton = document.createElement("button");
    modifyButton.id = "timelineModifyButton";
    modifyButton.innerHTML = "Modify"
    
    //edit button appearance
    deleteButton.onclick= () => {
      let text = "timelineItem" + i;
      const tempButton = document.getElementById(text).outerHTML="";
      let json = JSON.stringify(data[i]);
      fetch( "/timelineData", {
        method:"DELETE",
        body: json
      })
      //account for in backend
      console.log(tempButton.id);
      window.dispatchEvent(updateCharactersEvent)

    }

    modifyButton.onclick = () => {
      
      //TODO: create error checking features
      let text = "timelineItem" + i;

      const eraInput = document.querySelector('#era');
      const dateInput = document.querySelector('#date');
      const descriptionInput = document.querySelector('#description');
  
      const errorMsg = document.getElementById("timelineErrorMessage")
      if (isNaN(dateInput.value)) {
        errorMsg.style.display = "block";
    } else{
      const tempButton = document.getElementById(text).outerHTML="";
      let json = JSON.stringify(data[i]);
      fetch( "/timelineData", {
        method:"DELETE",
        body: json
      })
      //account for in backend
      console.log(tempButton.id);
      window.dispatchEvent(updateCharactersEvent)
      addTimelineItem(event);
    }
      
      

      

    }
    timelineItem.appendChild(deleteButton);
    timelineItem.appendChild(modifyButton);

    timelineItem.className = "container";
    const innerItemText = document.createElement("div");
    innerItemText.className = "content";
    innerItemText.innerHTML = "<h1>" + data[i].era + "</h1><h2>" + data[i].date + "</h2><p>" + data[i].description + "</p>"
    timelineItem.appendChild(innerItemText);
    

    timeline.appendChild(timelineItem);
  }
}



window.onload = async function () {
  const button = document.getElementById("addTimelineItemButton");
  button.onclick = addTimelineItem;

  const response = await fetch('/timelineData', {
    method: 'GET'
  })

  const data = await response.json();
  CreateTimeline(data);
}

const updateCharactersEvent = new CustomEvent('updateCharacters', { });