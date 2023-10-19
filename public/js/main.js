let idNum = 0;

const submit = async function( event ) {

  event.preventDefault() // Prevents default browser behavior
   //add more fields to your json based on your form 
    const showName = document.querySelector( '#showName' )
    const relYear = document.querySelector( '#relYear' )
    const showGenre = document.querySelector( '#showGenre' )

        json = { showName: showName.value, 
                  relYear: relYear.value,
                  showGenre: showGenre.value,
                  id: idNum},
        body = JSON.stringify( json ) // converts json to string 
        
        
        
  const response = await fetch( '/submit', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  })
  getData()
}

const deleteARow = async function(row){
  debugger;

  console.log("WE DELETIN SOMETHING!")
  const body = { id: row };

  const response = await fetch( '/delete', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( body )
  }
  )
  getData()
}

const displayData = function(data){
  tbody = document.getElementById('tableBody')
  
  tbody.innerHTML = '';

  data.forEach(item => {


      const editBtn =  document.createElement("button")
      editBtn.innerHTML = "Edit";

      const deleteBtn =  document.createElement("button")
      deleteBtn.innerHTML = "Delete";

      deleteBtn.class = "delete";
      deleteBtn.id = item.id;
      deleteBtn.onclick = () => deleteARow(deleteBtn.id)

      // Relevance Section:
      let curYear = new Date().getFullYear()
      let relQuote = relevanceByYear(curYear, item.relYear)

      const tr = document.createElement('tr')
      const td1 = document.createElement('td')
      const td2 = document.createElement('td')
      const td3 = document.createElement('td')
      const td4 = document.createElement('td')
      const td5 = document.createElement('td')
      td1.innerHTML = item.showName
      td2.innerHTML = item.relYear
      td3.innerHTML = item.showGenre
      td4.innerHTML = relQuote

    idNum++

      td5.appendChild(editBtn)
      td5.appendChild(deleteBtn)
      tr.appendChild(td1)
      tr.appendChild(td2)
      tr.appendChild(td3)
      tr.appendChild(td4)
      tr.appendChild(td5)
      tbody.appendChild(tr)
})
}

const getData = async function(){
  const response = await fetch( '/docs', {
    method:'GET',
  })
  let serverData = await response.json()
  displayData(serverData)
}

getData()


function relevanceByYear(currentYear, yearOfRelease){
  let yearDiff = currentYear - yearOfRelease;
  let relevanceByYear = "Huh?";
  if(yearDiff >= 0 && yearDiff <= 1){
    relevanceByYear = "Everyone's watching that!"
  }

  else if(yearDiff > 1 && yearDiff <= 10){
    relevanceByYear = "Still commonly watched!"
  }

  else if(yearDiff > 10 && yearDiff <= 80){
    relevanceByYear = "That's a pretty old one!"
  }

  else if(yearDiff > 80 || yearDiff < 0){
    relevanceByYear = "No show should even be that old!"
  }

  else{
    relevanceByYear = "No year given..."
  }
  return relevanceByYear;
}


window.onload = function() {
   const button = document.getElementById("submit");
  button.onclick = submit;
}

// document.getElementsByClassName("delete").onclick = deleteARow; => Note: writing "delete()" 
// will call it immediately, aa opposed to no pararentheses which is a pointer and will call it when the click event happens.
// Also, using this line of code would cause this to only run with the first instance of the delete class (the first button).


