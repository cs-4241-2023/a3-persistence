
const loadClass = function ( ) {

  const dropdown = document.getElementById('classModifySelect')
  if(dropdown.value == "") {
    document.getElementById('className2').value = ""
    document.getElementById('classCode2').value = ""
    document.getElementById('startTime2').value = ""
    document.getElementById('endTime2').value = ""
    const days = ['monday2', 'tuesday2', 'wednesday2', 'thursday2', 'friday2', 'saturday2', 'sunday2']
    for(day of days) {
      document.getElementById(day).checked = ""
    }
  } else {
    const data = JSON.parse(dropdown.value)
    document.getElementById('className2').value = data.Name
    document.getElementById('classCode2').value = data.Code
    document.getElementById('startTime2').value = data.StartTime
    document.getElementById('endTime2').value = data.EndTime
    const days = ['monday2', 'tuesday2', 'wednesday2', 'thursday2', 'friday2', 'saturday2', 'sunday2']
    for(day of days) {
      document.getElementById(day).checked = ""
    }
    Object.values(data.Days).forEach( day => {
      switch(day) {
        case 'M': document.getElementById('monday2').checked = "checked"; break;
        case 'T': document.getElementById('tuesday2').checked = "checked"; break;
        case 'W': document.getElementById('wednesday2').checked = "checked"; break;
        case 'Th': document.getElementById('thursday2').checked = "checked"; break;
        case 'F': document.getElementById('friday2').checked = "checked"; break;
        case 'Sa': document.getElementById('saturday2').checked = "checked"; break;
        case 'Su': document.getElementById('sunday2').checked = "checked"; break;
      }
    })
  }
}

const addClassesTo = async function ( dropdown , data) {
  
  dropdown.textContent = '' // clears the dropdown

  selected = false
  for(c of data) {
    let opt = document.createElement('option')
    opt.value = JSON.stringify(c)
    opt.innerHTML = c.Name
    if(!selected) {
      opt.selected = "selected"
      selected = true
    }
    dropdown.appendChild(opt)
  }
}

window.onload = async function () {
  let username = 'in progress'

  const response = await fetch( '/data', {
    method:'GET'
  })

  const data = await response.json();

  console.log('data: ' + JSON.stringify(data));

  // display the schedule
  // displaySchedule(data)

  // set up dropdowns
  // addClassesTo(document.getElementById("classSelect"), data).then(showClass)
  // addClassesTo(document.getElementById("classModifySelect", data)).then(loadClass)

  // removeDropdown.onchange = showClass
  // modifyDropdown.onchange = loadClass

  // display the username
  document.getElementById('usernameDisplay').innerHTML = username;
}

