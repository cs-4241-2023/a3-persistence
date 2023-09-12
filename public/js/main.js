// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const Name = document.getElementById( 'className' ).value,
        Code = document.getElementById( 'classCode' ).value,
        StartTime = document.getElementById('startTime').value,
        EndTime = document.getElementById('endTime').value,
        Days = getDays(''),
        json =  { Name,
                  Code,
                  StartTime,
                  EndTime,
                  Days },
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const responseJSON = await response.json()

  // console.log( 'submit - received:', JSON.stringify(responseJSON) )
  if('errors' in responseJSON) { // there has been an error
    // show warning messages
    for (const [key, val] of Object.entries(responseJSON)) {
      const el = document.getElementById(key + 'Warning');
      if(typeof el !== 'undefined' && el !== null) {
        if (val !== true) { // there is an error
          el.innerHTML = val
        } else { // no error
          el.innerHTML = ''
        }
      }
    }
  } else { // remove all warning labels
    const warnings = document.getElementsByClassName('warning')
    for ( element of warnings) {
      element.innerHTML = ''
    }
  }

  getAll()
}

const getAll = async function getAll( ) {
  // event.preventDefault(); // TODO: check if we always need this? not sure what this does

  const response = await fetch( '/getAll', {
    method:'POST'
  })

  const data = await response.json();

  // console.log( 'getAll - received:', data )

  displaySchedule(data)

  addClassesTo(document.getElementById("classSelect")).then(showClass)
  addClassesTo(document.getElementById("classModifySelect")).then(loadClass)
}

const remove = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const body = JSON.stringify( document.getElementById('classSelect').value )

  const response = await fetch( '/remove', {
    method:'POST',
    body
  })

  const text = await response.text()

  if(text === 'success') {
    console.log('sucessfully removed')
  } else {
    console.log('failed to remove')
  }

  getAll()

}

const modify = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const prev = document.getElementById('classModifySelect').value,
        Name = document.getElementById( 'className2' ).value,
        Code = document.getElementById( 'classCode2' ).value,
        StartTime = document.getElementById('startTime2').value,
        EndTime = document.getElementById('endTime2').value,
        Days = getDays('2'),
        json =  { prev, 
                'new': {  Name,
                          Code,
                          StartTime,
                          EndTime,
                          Days },
                }
        body = JSON.stringify( json )

  const response = await fetch( '/modify', {
    method:'POST',
    body 
  })

  const responseJSON = await response.json()

  if('errors' in responseJSON) { // there has been an error
    // show warning messages
    for (const [key, val] of Object.entries(responseJSON)) {
      const el = document.getElementById(key + '2Warning');
      if(typeof el !== 'undefined' && el !== null) {
        if (val !== true) { // there is an error
          el.innerHTML = val
        } else { // no error
          el.innerHTML = ''
        }
      }
    }
  } else { // remove all warning labels
    const warnings = document.getElementsByClassName('warning')
    for ( element of warnings) {
      element.innerHTML = ''
    }
  }

  getAll()

  getAll()
}

const getDays = (id) => {
  var days = ['monday' + id, 
              'tuesday' + id, 
              'wednesday' + id, 
              'thursday' + id, 
              'friday' + id, 
              'saturday' + id, 
              'sunday' + id]
  var selected = {}
  days = days.map(day => document.getElementById(day))
  counter = 0
  days.forEach( el => {
    if(el.checked) {
      selected['pos' + counter++] = el.value
    }
  })
  return selected
};

const addClassesTo = async function ( dropdown ) {
  const response = await fetch( '/getAll', {
    method:'POST'
  })

  const data = await response.json()

  // console.log('getAll - received: ', data)
  
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

window.onload = function() {
  document.getElementById("submitAdd").onclick = submit;
  document.getElementById("submitRemove").onclick = remove;
  document.getElementById("submitModify").onclick = modify;
  const removeDropdown = document.getElementById("classSelect")
  const modifyDropdown = document.getElementById("classModifySelect")
  addClassesTo(removeDropdown)
  removeDropdown.onchange = showClass
  addClassesTo(modifyDropdown)
  modifyDropdown.onchange = loadClass
  getAll();
}