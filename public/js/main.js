
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
    document.getElementById('className2').value = data.name
    document.getElementById('classCode2').value = data.code
    document.getElementById('startTime2').value = data.start
    document.getElementById('endTime2').value = data.end
    const days = ['monday2', 'tuesday2', 'wednesday2', 'thursday2', 'friday2', 'saturday2', 'sunday2']
    for(day of days) {
      document.getElementById(day).checked = ""
    }
    Object.keys(data).forEach( day => {
      switch(day) {
        case 'monday': document.getElementById('monday2').checked = "checked"; break;
        case 'tuesday': document.getElementById('tuesday2').checked = "checked"; break;
        case 'wednesday': document.getElementById('wednesday2').checked = "checked"; break;
        case 'thursday': document.getElementById('thursday2').checked = "checked"; break;
        case 'Friday': document.getElementById('friday2').checked = "checked"; break;
        case 'saturday': document.getElementById('saturday2').checked = "checked"; break;
        case 'sunday': document.getElementById('sunday2').checked = "checked"; break;
        default: break;
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
    opt.innerHTML = c.name
    if(!selected) {
      opt.selected = "selected"
      selected = true
    }
    dropdown.appendChild(opt)
  }
}

const displayErrors = async function ( data ) {
  if(!data.hasOwnProperty('errors')) {
    return;
  }

  // remove all error messages
  const warnings = document.getElementsByClassName('warning')
  for (warning of warnings) {
    warning.innerHTML = "";
  }

  // if there are warnings, show them
  if(data.errors !== false) {
    Object.keys(data).forEach(key => {
      const warning = document.getElementById(key + "Warning")
      if(!!warning) {
        warning.innerHTML = data[key]
      }
    })
  }
}

window.onload = async function () {

  const response = await fetch( '/data', {
    method:'GET'
  })

  const data = await response.json();

  const classes = data.schedules

  // display the schedule
  displaySchedule(classes)

  // set up dropdowns
  addClassesTo(document.getElementById("classSelect"), classes).then(showClass)
  addClassesTo(document.getElementById("classModifySelect"), classes).then(loadClass)

  document.getElementById("classSelect").onchange = showClass
  document.getElementById("classModifySelect").onchange = loadClass

  // display any errors
  displayErrors(data.error);

  // display the username
  document.getElementById('usernameDisplay').innerHTML = data.username;
}

