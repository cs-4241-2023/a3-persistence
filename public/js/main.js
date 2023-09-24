// FRONT-END (CLIENT) JAVASCRIPT HERE
document.addEventListener('DOMContentLoaded', function () {

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  //id associated w/ input is how you get the value of the input
  //querySelector links to html using ID, tag name or class name; assign html tag an ID, 
  //also getElementByID
  //# is in front of ID name 
        
let data = ""
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const startInput = document.querySelector('#startDate');
const finishInput = document.querySelector('#dateFinished');
const submitButton = document.querySelector('button');

if (!titleInput.value.trim() || !authorInput.value.trim() || !startInput.value.trim() || !finishInput.value.trim()) {
  submitButton.disabled = true;

  console.log('Please fill in all fields')
}
submitButton.disabled = false


const startDate = new Date(startInput.value)
const finishDate = new Date(finishInput.value)

const timeDif = finishDate - startDate
const msDay = 24 * 60 * 60 * 1000
const msMonth = 30.44 * msDay
const msYear = 365.25 * msDay

const years = Math.floor(timeDif / msYear)
const remainingTimeAfterYears = timeDif % msYear

const months = Math.floor(remainingTimeAfterYears / msMonth)
const remainingTimeAfterMonths = remainingTimeAfterYears % msMonth
const days = Math.floor(remainingTimeAfterMonths / msDay)

const formattedTime = `${years} Year(s), ${months} Month(s), ${days} Day(s)`
const json = { 
  title: titleInput.value,
         author: authorInput.value, 
         startDate: startInput.value,
         dateFinished: finishInput.value,
         timeToFinish: formattedTime 
}; //json is how you want to package data before sending it to front end
  //{attribute : value}
const body = JSON.stringify( json )



const response = await fetch( '/add', {
    method:'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: body 
    
  })  

  if (response.status === 200){
     data = await response.json()
     console.log('Data added to MongoDB')
     getLibrary()


  }
  else if (response.status ===409){
    console.error('Duplicate entry.')
    return;
  }

  else{
    console.error('Failed to add data to MongoDB:', response.statusText)
  }
}


async function deleteBook(id, listItemElem, delButton, edButton) {
  console.log("Delete book...")
  console.log(id)

  
    const response = await fetch(`/remove/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }

    })

    console.log(`/remove/{_id:${id}}`)
    console.log("Response status:", response.status)
   //test

  //sucessful
  if (response.status  === 200){
    listItemElem.remove()
    delButton.remove()
    edButton.remove()

    console.log("Success")

  }
  else {
    console.error("Error deleting item on server")
  }

}

async function editBook(id, listElem, delButton){
  const editForm = document.createElement('form')
   const titleElement = listElem.querySelector('data-title')
  const authorElement = listElem.querySelector('data-author')
  console.log(titleElement)
  console.log(authorElement)
  editForm.innerHTML = 
  `<label for="edit-title">Title:</label>
    <input type="text" id="edit-title" value="${titleElement.innerText}">
    <label for="edit-author">Author:</label>
    <input type="text" id="edit-author" value="${authorElement.innerText}">
    <button class="submit-edit">Save</button>`
 
} 

// Add an event listener to the "userLibrary" container to handle clicks on entries
document.querySelector('#userLibrary').addEventListener('click', (event) => {
  const listItem = event.target.closest('.userLibrary') // Find the closest <li> element
  if (!listItem) return // Return if a <li> element is not clicked

  const id = listItem.dataset.id // Assuming you have a data-id attribute on each <li> for the entry's ID
  editBook(id, listItem)
})

document.querySelector('#title').addEventListener('input', checkForm)
document.querySelector('#author').addEventListener('input', checkForm)
document.querySelector('#startDate').addEventListener('input', checkForm)
document.querySelector('#dateFinished').addEventListener('input', checkForm)


async function checkForm() {
  const titleInput = document.querySelector('#title')
  const authorInput = document.querySelector('#author')
  const startInput = document.querySelector('#startDate')
  const finishInput = document.querySelector('#dateFinished')
  const submitButton = document.querySelector('button')

  if (titleInput.value.trim() && authorInput.value.trim() && startInput.value.trim() && finishInput.value.trim()) {
    submitButton.disabled = false
  } 
  else {
    submitButton.disabled = true
  }
}

const getLibrary = async function(){

  
  const libRes = await fetch('/docs', {
    method: 'GET'

  });

let libData = ""
if (libRes.status === 200) {
  libData = await libRes.json()
  displayLibrary(libData)
} 
else if (libRes.status === 409) {
  console.error('Conflict');
  
} 
else {
  console.error('Failed to show data: ', libRes.statusText);
}
}


function displayLibrary(data){
  const prevList = document.querySelector('#userLibrary')
  if (prevList){
    prevList.remove(); 
  }
  const list = document.createElement('ul')
  list.id = 'userLibrary'


  data.forEach(d => {

  
      const li = document.createElement('li')
      li.className = "userLibrary"
      li.dataset.id = d._id

      const deleteButton = document.createElement("button")
      deleteButton.innerText = "Delete"
      deleteButton.className = "delete"
      const editButton = document.createElement("button")
      editButton.innerText = "Edit"
      editButton.className = "edit" 
      /*    
      li.innerHTML = `<span id="title">Title: ${d.title}</span><br>
      <span id="author">Author: ${d.author}</span><br>
      <span id="startDate">Start Date: ${d.startDate}</span><br>
      <span id="dateFinished">Finish Date: ${d.dateFinished}</span><br>
      Time to Finish: ${d.timeToFinish}`
      //li.innerText = "Title: " + d.title + "\nAuthor: " + d.author + "\nStart Date: " + d.startDate + "\nFinish Date: " + d.dateFinished +"\nTime to Finish: " + d.timeToFinish
      const li = document.createElement('li');
      li.className = 'userLibrary';
  */
    const index = d._id
  
      const titleSpan = document.createElement('span')
      titleSpan.innerText = `Title: ${d.title}`
      titleSpan.id = `title-${index}`
  
      const authorSpan = document.createElement('span')
      authorSpan.innerText = `Author: ${d.author}`
      authorSpan.id = `author-${index}`
  
      const startDateSpan = document.createElement('span')
      startDateSpan.innerText = `Start Date: ${d.startDate}`
      startDateSpan.id = `startDate-${index}`
  
      const dateFinishedSpan = document.createElement('span')
      dateFinishedSpan.innerText = `Finish Date: ${d.dateFinished}`
      dateFinishedSpan.id = `dateFinished-${index}`
    
      const timeToFinishSpan = document.createElement('span')
      timeToFinishSpan.innerText = `Time to Finish: ${d.timeToFinish}`

      li.appendChild(titleSpan)
      li.appendChild(authorSpan)
      li.appendChild(startDateSpan)
      li.appendChild(dateFinishedSpan)
      li.appendChild(timeToFinishSpan)
      
      list.appendChild(li)
      list.appendChild(deleteButton)
      list.appendChild(editButton)
      
    
  
  
      //deleteButton.addEventListener('click', () => deleteBook(d._id, li, deleteButton))
      editButton.onclick = () => editBook(d._id, li, deleteButton)
      deleteButton.onclick = () => deleteBook(d._id, li, deleteButton, editButton)
      

   
    
  })

  document.body.appendChild( list )  

}

window.onload = function() {
  const submitButton = document.querySelector("#submit")
  submitButton.disabled = true;
  
  submitButton.addEventListener('click', submit);
  getLibrary();

}
})
