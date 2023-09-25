// FRONT-END (CLIENT) JAVASCRIPT HERE
document.addEventListener('DOMContentLoaded', function () {

  const submit = async function (event) {
    event.preventDefault()

    let data = ""
    const titleInput = document.querySelector('#title')
    const authorInput = document.querySelector('#author')
    const startInput = document.querySelector('#startDate')
    const finishInput = document.querySelector('#dateFinished')
    const submitButton = document.querySelector('button')

    if (!titleInput.value.trim() || !authorInput.value.trim() || !startInput.value.trim() || !finishInput.value.trim()) {
      submitButton.disabled = true

      console.log('Please fill in all fields')
    }
    submitButton.disabled = false

    const startDate = new Date(startInput.value)
    const finishDate = new Date(finishInput.value)
    const timeDif = await calcTime(startDate, finishDate)

    const json = {
      title: titleInput.value,
      author: authorInput.value,
      startDate: startInput.value,
      dateFinished: finishInput.value,
      timeToFinish: timeDif
    }

    const body = JSON.stringify(json)

    const response = await fetch('/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body 
    })  

    if (response.status === 200){
      data = await response.json()
      console.log('Data added to MongoDB')
      getLibrary()
    }
    else if (response.status === 409){
      console.error('Duplicate entry.')
      return
    }
    else{
      console.error('Failed to add data to MongoDB:', response.statusText)
    }
  }

  async function calcTime(start, end){
    const timeDif = end - start
    const msDay = 24 * 60 * 60 * 1000
    const msMonth = 30.44 * msDay
    const msYear = 365.25 * msDay

    const years = Math.floor(timeDif / msYear)
    const remainingTimeAfterYears = timeDif % msYear

    const months = Math.floor(remainingTimeAfterYears / msMonth)
    const remainingTimeAfterMonths = remainingTimeAfterYears % msMonth
    const days = Math.floor(remainingTimeAfterMonths / msDay)

    const formattedTime = `${years} Year(s), ${months} Month(s), ${days} Day(s)`
    return formattedTime
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

    if (response.status === 200){
      listItemElem.remove()
      delButton.remove()
      edButton.remove()
      console.log("Success")
    }
    else {
      console.error("Error deleting item on server")
    }
  }

  async function editBook(id, listElem){
    const editForm = document.createElement('form')
    editForm.className = 'userLibrary'

    const titleElement = listElem.querySelector('#title')
    const authorElement = listElem.querySelector('#author')
    const startDateElement = listElem.querySelector('#startDate')
    const dateFinishedElement = listElem.querySelector('#dateFinished')

    editForm.innerHTML = 
    `<div class="userInput">
    <span>Title: </span>
    <input type="text" id="edit-title" value="${titleElement.innerText.replace("Title: ", '')}">
    <br><br>
    <span>Author: </span>
    <input type="text" id="edit-author" value="${authorElement.innerText.replace("Author: ", '')}">
    <br><br>
    <span>Date started: </span>
    <input type="date" id="edit-startDate" value="${startDateElement.innerText.replace('Start Date: ', '')}">
    <br><br>
    <span>Date completed: </span>
    <input type="date" id="edit-dateFinished" value="${dateFinishedElement.innerText.replace('Finish Date: ', '')}">
    <button class="submit-edit">Save</button>
  </div>`
    listElem.innerHTML = ''
    listElem.appendChild(editForm)
    const saveButton = editForm.querySelector('.submit-edit')
    saveButton.addEventListener('click', async () => {
      const updatedTitle = editForm.querySelector('#edit-title').value
      const updatedAuthor = editForm.querySelector('#edit-author').value
      const updatedStart = editForm.querySelector('#edit-startDate').value
      const updatedFinish = editForm.querySelector('#edit-dateFinished').value

      const uStart = new Date(updatedStart)
      const uFinish = new Date(updatedFinish)
      const updatedTime2Finish = await calcTime(uStart, uFinish)

      const response = await fetch(`/update/${id}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: updatedTitle, author: updatedAuthor, startDate:updatedStart, dateFinished: updatedFinish, timeToFinish: updatedTime2Finish}),
      })

      if (response.status === 200) {
        listElem.querySelector('#title').innerText = updatedTitle
        listElem.querySelector('#author').innerText = updatedAuthor
        listElem.querySelector('#startDate').innerText = updatedStart
        listElem.querySelector('#dateFinished').innerText = updatedFinish
        listElem.querySelector('#timeToFinish').innerText = updatedTime2Finish

        listElem.innerHTML = `
          <span class="title">Title: ${updatedTitle}</span><br>
          <span class="author">Author: ${updatedAuthor}</span><br>
          <span class="startDate">Start Date: ${updatedStart}</span><br>
          <span class="dateFinished">Finish Date: ${updatedFinish}</span><br>
          <span class="timeToFinish">Time to Finish: ${updatedTime2Finish}</span>
        `

        listElem.addEventListener('click', () => editBook(id, listElem))
      } 
      else {
        console.error('Failed to edit data:', response.statusText)
      }
    })
  } 

  document.querySelector('#userLibrary').addEventListener('click', (event) => {
    const listItem = event.target.closest('.userLibrary') 
    if (!listItem) return 

    const id = listItem.dataset.id 
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

  const getLibrary = async function () {
    const libRes = await fetch('/docs', {
      method: 'GET'
    });

    let libData = ""
    if (libRes.status === 200) {
      libData = await libRes.json()
      displayLibrary(libData)
    } 
    else if (libRes.status === 409) {
      console.error('Conflict')
    } 
    else {
      console.error('Failed to show data: ', libRes.statusText)
    }
  }

  function displayLibrary(data){
    const prevList = document.querySelector('#userLibrary')
    if (prevList){
      prevList.remove()
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
    
      li.innerText = `Title: ${d.title}\nAuthor: ${d.author}\nStart Date: ${d.startDate}\nFinish Date: ${d.dateFinished}\nTime to Finish: ${d.timeToFinish}`

      li.innerHTML = 
      `<span id="title">Title: ${d.title}</span><br>
        <span id="author">Author: ${d.author}</span><br>
        <span id="startDate">Start Date: ${d.startDate}</span><br>
        <span id="dateFinished">Finish Date: ${d.dateFinished}</span><br>
        <span id="timeToFinish">Time to Finish: ${d.timeToFinish}</span>`
      list.appendChild(li)
      list.appendChild(deleteButton)
      list.appendChild(editButton)
      editButton.onclick = () => editBook(d._id, li)
      deleteButton.onclick = () => deleteBook(d._id, li, deleteButton, editButton)
    })

    document.body.appendChild(list)
  }

  window.onload = function() {
    const submitButton = document.querySelector("#submit")
    submitButton.disabled = true;
    submitButton.addEventListener('click', submit)
    getLibrary()
  }
})
