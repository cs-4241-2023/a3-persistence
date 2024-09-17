document.addEventListener('DOMContentLoaded', function () {
    const login = async function (event) {

        event.preventDefault()
        const json = {
            username: username, 
            title: titleInput.value,
            author: authorInput.value,
            startDate: startInput.value,
            dateFinished: finishInput.value,
            timeToFinish: timeDif
          }
      
          const body = JSON.stringify(json)

    const login = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body 
      })  

    

    //login request to server
    //get username using req.body.username
    //connect to client with username or create a new account 


}


