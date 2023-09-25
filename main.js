// FRONT-END (CLIENT) JAVASCRIPT HERE

function createTable(tableData){
  //Container
  const displayTable = document.createElement('div')
  displayTable.classList.add("container")

  //Header Row
  const leaderboard = document.createElement('div')
  leaderboard.classList.add("row")

  const leaderboardMsg = document.createElement('div')
  leaderboardMsg.classList.add("hcell")
  leaderboardMsg.innerText = 'Here is the leaderboard for all players'
  leaderboard.appendChild(leaderboardMsg)
  displayTable.appendChild(leaderboard)
  
  const headers = document.createElement('div')
  headers.classList.add("row")

  const header1 = document.createElement('div')
  header1.classList.add("col-md-1")
  header1.innerText = 'Player'
  headers.appendChild(header1)

  const header2 = document.createElement('div')
  header2.classList.add("col-md-1")
  header2.innerText = 'Player Guess'
  headers.appendChild(header2)
  
  const header3 = document.createElement('div')
  header3.classList.add("col-md-1")
  header3.innerText = 'Player Win?'
  headers.appendChild(header3)

  const header4 = document.createElement('div')
  header4.classList.add("col-md-1")
  header4.innerText = 'Computer Guess'
  headers.appendChild(header4)

  displayTable.appendChild(headers)
  //Player Rows
  tableData.forEach(e => {
      const player1 = document.createElement('div')
      player1.classList.add('row')

      const p1Name = document.createElement('div')
      p1Name.classList.add("col-md-4")
      p1Name.innerText = `${e.Player}`
      player1.appendChild(p1Name)

      const p1Number = document.createElement('div')
      p1Number.classList.add("col-md-4")
      p1Number.innerText = `${e.Player1Guess}`
      player1.appendChild(p1Number)

      const p1Winner = document.createElement('div')
      p1Winner.classList.add("col-md-4")
      p1Winner.innerText = `${e.isWinner}`
      player1.appendChild(p1Winner)

      const answer = document.createElement('div')
      answer.classList.add("col-md-4")
      answer.innerText = `${e.CompGuess}`
      player1.appendChild(answer)

      displayTable.appendChild(player1)
    
  });
  document.body.appendChild(displayTable)
}

let userName =''
const userLogin = async function( event ){
 event.preventDefault()
  userName = document.getElementById("user").value
  console.log(`${userName}`)
  const userMessage = document.createElement('p')
  userMessage.innerText = `Hello ${userName} Welcome to the Number Game!!! `
  document.body.appendChild(userMessage)
  document.getElementById("player1").hidden = false
  document.getElementById("submit").hidden = false
  document.getElementById("desc").hidden = false
  document.getElementById("msg").hidden = false
  document.getElementById("delete").hidden = false
  document.getElementById("modify").hidden = false
  document.getElementById("msg2").hidden = false
  document.getElementById("numRange").hidden = false
} 

const userDelete = async function( event ){
  event.preventDefault()
  console.log(`${userName}`)
  const json = { UserName: userName  }


  const response = await fetch( '/delete', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify( json )
  })
  const update = await response.json();
  createTable(update)
}

const userModify = async function (event){
  event.preventDefault()
  console.log(`${userName}`)
  const json = { UserName: userName  }


  const response = await fetch( '/modify', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify( json )
  })
  const update = await response.json();
  createTable(update)
}

const playerSubmit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  
  
  const input1 = document.querySelector( '#player1' ),
        input2 = document.querySelector( '#user' ),
        input3 = document.querySelector( '#numRange' ),
        maxNum = parseInt(input3.value),
        compNumber = Math.floor(Math.random() * maxNum),
        json = { UserName: input2.value, Player1Guess: input1.value, ComputerGuess:compNumber  }
       // body = JSON.stringify( json )

        const response = await fetch( '/submit', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify( json )
        })
        //.then( response => response.json() )
        //.then( console.log ) 
      const update = await response.json();
      createTable(update)
      
      console.log(update)


  
  document.getElementById("player1").value = ""  
  document.getElementById("user").value = ""

}



window.onload = function() {
  const buttonOne = document.querySelector("#login");
  buttonOne.onclick = userLogin;

  const buttonTwo = document.querySelector("#submit");
  buttonTwo.onclick = playerSubmit;

  const buttonThree = document.querySelector("#delete");
  buttonThree.onclick = userDelete;

  const buttonFour = document.querySelector("#modify");
  buttonFour.onclick = userModify;


  document.getElementById("player1").hidden = true
  document.getElementById("submit").hidden = true
  document.getElementById("desc").hidden = true
  document.getElementById("msg").hidden = true
  document.getElementById("delete").hidden = true
  document.getElementById("modify").hidden = true
  document.getElementById("msg2").hidden = true
  document.getElementById("numRange").hidden = true
}