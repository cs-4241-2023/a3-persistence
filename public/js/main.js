
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

const getData = async _ => {
  const response = await fetch( '/data', {
    method:'GET'
  })

  return await response.json();
}

window.onload = async function () {

  const url = window.location.href

  const response = await fetch( '/data', {
    method:'POST',
    body: url
  })

  data = await response.json();

  if(!!data.username) {
    const response2 = await fetch( '/logout', {
      method:'POST'
    })
    return;
  }

  const classSelect = document.getElementById("classSelect")
  const classModifySelect = document.getElementById("classModifySelect")
  const usernameDisplay = document.getElementById('usernameDisplay')
  if(!!classSelect === true && !!classModifySelect === true && !!usernameDisplay === true) {

    // display the schedule
    const classes = data.schedules
    displaySchedule(classes)

    // set up dropdowns
    addClassesTo(classSelect, classes).then(showClass)
    addClassesTo(classModifySelect, classes).then(loadClass)
  
    classSelect.onchange = showClass
    classModifySelect.onchange = loadClass
    
    // display any errors
    displayErrors(data.error);

    // display the username
    usernameDisplay.innerHTML = "User: " + data.username;
  }

}

