const submit = async function (event) {
    event.preventDefault()
    const course = document.querySelector("#course");
    const assignment = document.querySelector("#assignment");
    const dueDate = document.querySelector("#due-date");
    const dueTime = document.querySelector("#due-time");
  
    if(course.value === ''){
        window.alert("Please enter course")
        return
      }
      if(dueDate.value === ''){
        window.alert("Please enter due date")
        return
      }
    //const daysLeft = calculateDaysLeft(dueDate.value);

    json = {course: course.value,assignment: assignment.value,dueDate: dueDate.value,dueTime: dueTime.value},
      body = JSON.stringify(json)
  
    const response = await fetch('/submit', {
      method: 'POST',
      body
    })
    const data = await response.json()
    createTable(data);
  }

  const removeRow = async function (assignment) {
  
    let json = { removeId: assignment };
    let body = JSON.stringify(json);
    const response = await fetch("/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _id: json.removeId }),
  });
  const data = await response.json();
  //Display table of data
  createTable(data);
  }
  
  
  const createTable = function (jsonData) {
    const table = document.querySelector("#homework-table")
    console.log(table)
    table.innerHTML = "<tr> <th>Course</th><th>Assignment</th><th>Due Date</th><th>Due Time</th><th>Days Left</th><th>Done?</th> </tr>"
    jsonData.forEach(entry => {
      table.innerHTML += `<tr> <td>${entry.course}</td> <td>${entry.assignment}</td> <td>${entry.dueDate}</td><td>${entry.dueTime}</td><td>${entry.daysLeft}</td><td><button onclick="removeRow(\'${entry.assignment}\')">done</button></td></tr>`
    })
  }

  
  
  
  window.onload = function () {
    const button = document.querySelector("button");
    button.onclick = submit
    fetch('/data', {
      method: 'GET',
    }).then(response => response.json())
      .then(json => {
        createTable(json)
      })
  }