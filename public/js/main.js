

window.onload = function () {
  const showGrade = document.querySelector("#displayInfo")
  showGrade.onclick = displayInfo

  const setGoalGrade = document.querySelector("#setGoal");
  setGoalGrade.onclick = setGoal
}

const validGrades = ['A', 'B', 'C', 'NR']
const tableHeaders = ['Date', 'Hours', 'Time Remaining Until Goal', 'Delete']

const displayInfo = async function (event) {
  event.preventDefault()

  const response = await fetch('/getGradeProgress', {
    method: 'GET'
  })

  const res = await response.json()
  console.log(res)

  //if no grade was found must unlock setgoal
  if (res.length === 0) {
    const setGoalForm = document.querySelector('#enterGoalForm')
    setGoalForm.style.visibility = 'visible'
  } else {


    const sideBySide = document.querySelector('#sideBySide')
    sideBySide.style.visibility = 'visible'

    const grade = document.createElement('p')
    const hoursTilGoal = document.createElement('p')

    const displayGrade = document.querySelector('#displayGrade')
    displayGrade.innerHTML = ''
    const titleGrade = document.createElement('p')
    titleGrade.innerText = "Current Grade Goal: "
    titleGrade.className = "border"
    
    grade.innerText = res.userGrade
    grade.className = res.userGrade
    titleGrade.appendChild(grade)
    displayGrade.appendChild(titleGrade)

    const displayHours = document.querySelector('#displayHoursLeft')
    displayHours.innerHTML = ''
    const titleHours = document.createElement('p')
    titleHours.innerText = "Amount of hours left until you achieve the goal:"
    titleHours.className = "border"
    displayHours.appendChild(titleHours)

    hoursTilGoal.innerText = res.timeLeft
    titleHours.appendChild(hoursTilGoal)
    displayHours.appendChild(titleHours)
  }

}

const setGoal = async function (event) {
  event.preventDefault()

  const goal = document.querySelector('#desiredGoal'),
    json = { goal: goal.value },
    body = JSON.stringify(json)

  if (!validGrades.includes(goal.value)) {
    const displayGoal = document.querySelector('#termGradeGoal')
    displayGoal.innerText = "Invalid grade, please try again"
  }

  else {
    const response = await fetch('/setGoal', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body
    })

    const res = await response.json()

    const displayGoal = document.querySelector('#termGradeGoal')

    displayGoal.innerText = res[0].goal
    displayGoal.className = res[0].goal

    document.querySelector('#enterGoalForm').style.visibility = "hidden"

    displayInfo(event)
  }

}
