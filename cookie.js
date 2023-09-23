

// add some middleware that always sends unauthenicated users to the login page
// app.use( function( request,response,next) {
//   if( request.session.login === true ) {
//     next()
//   } else {
//     response.sendFile( __dirname + '/public/index.html' )
//   }
// })
