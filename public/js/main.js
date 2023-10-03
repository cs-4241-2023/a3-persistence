// FRONT-END (CLIENT) JAVASCRIPT HERE


let idNum = 1;

const submit = async function( event ) {


  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault() // Prevents default browser behavior
   //add more fields to your json based on your form 
    const showName = document.querySelector( '#showName' )
    const relYear = document.querySelector( '#relYear' )
    const showGenre = document.querySelector( '#showGenre' )

        json = { showName: showName.value, 
                  relYear: relYear.value,
                  showGenre: showGenre.value,
                  id: idNum},
        idNum++;
        body = JSON.stringify( json ) // converts json to string 
        
        
        
  const response = await fetch( '/submit', {
    method:'POST',
    body
  })
    
  let newData = await response.json() //wait until response
  console.log(newData)

  const table = document.querySelector("table") // Will find the FIRST table element in html.
  const tableHeader = document.querySelector("th") // Will find the FIRST th element in html.
  
  table.innerHTML = '';
  
  i = 0;
  newData.forEach(item => {
    
      const editBtn =  document.createElement("BUTTON")
      editBtn.innerHTML = "Edit";

      const deleteBtn =  document.createElement("BUTTON")
      deleteBtn.innerHTML = "Delete";
      deleteBtn.class = "delete";
      deleteBtn.id = i;
      deleteBtn.onclick = ()=> deleteARow(deleteBtn.id)

      // Relevance Section:
      let curYear = new Date().getFullYear()
      let relQuote = relevanceByYear(curYear, item.relYear)
      console.log("The show " + item.showName + " was made " + (curYear - item.relYear) + " years ago." + relQuote)

      const tr = document.createElement('tr')
      console.log(item.idNum)
      const td1 = document.createElement('td')
      const td2 = document.createElement('td')
      const td3 = document.createElement('td')
      const td4 = document.createElement('td')
      const td5 = document.createElement('td')
      td1.innerHTML = item.showName
      td2.innerHTML = item.relYear
      td3.innerHTML = item.showGenre
      td4.innerHTML = relQuote
      td5.appendChild(editBtn)
      td5.appendChild(deleteBtn)
      tr.appendChild(td1)
      tr.appendChild(td2)
      tr.appendChild(td3)
      tr.appendChild(td4)
      tr.appendChild(td5)
      table.appendChild(tr)
    i++
//add a button to delete or modify your data
//each button should have its own action listener
//keep track of each entry by using an id
// you might need that id to edit or delete an entry
  })

}

const deleteARow = async function(row){
  
  document.getElementById("showsTable").deleteRow(row);
  const body = { row }; // Taking the row number and turning it into an objet containing the row number.

  debugger;
  const response = await fetch( '/delete', {
    method:'POST',
    body: JSON.stringify( body )
  }
  )
}

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

  else if(yearDiff > 80){
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


