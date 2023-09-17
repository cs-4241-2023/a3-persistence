// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input_name = document.querySelector( '#yourname' ),
        input_score = document.querySelector( '#score' ),
        json = { yourname: input_name.value, score: input_score.value },
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const text = await response.text()

  await refreshScores()
}

window.onload = function() {
  const button = document.querySelector("#sub_button");
  const refreshButton = document.querySelector("#ref_button")
  button.onclick = submit;
  refreshButton.onclick = manualRefresh;
  refreshScores()
}

const manualRefresh = function (event) {
  event.preventDefault()
  refreshScores()
}

async function refreshScores() {

  const body = {'message': 'i want new scores pls'}

  const response = await fetch( '/refresh', {
    method:'POST',
    body 
  })

  const text = await response.text()

  const table = document.querySelector('#score_table')
  table.innerHTML = ''
  const headRow = document.createElement('tr'),
        firstColHead = document.createElement('th'),
        secColHead = document.createElement('th')
        thirdColHead = document.createElement('th')

  headRow.appendChild(firstColHead)
  headRow.appendChild(secColHead)
  headRow.appendChild(thirdColHead)
  table.appendChild(headRow)

  firstColHead.innerHTML = 'Name'
  secColHead.innerHTML = 'Score'
  thirdColHead.innerHTML = 'Date'
  
  respObj = JSON.parse(text)

  for (let i = 0; i < respObj.length; i++) {
    const row = document.createElement('tr')
    const current = respObj[i]
    const name = document.createElement('td')
    const score = document.createElement('td')
    const date = document.createElement('td')

    const currDate = new Date(current.date)
    console.log(current.date)

    name.innerHTML = current.name
    score.innerHTML = current.score
    date.innerHTML = currDate.toLocaleString('en-US', { timeZone: 'America/New_York' })

    row.appendChild(name)
    row.appendChild(score)
    row.appendChild(date)
    table.appendChild(row)
  }
}