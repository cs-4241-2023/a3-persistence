
// cookie middleware! The keys are used for encryption and should be
// changed
// app.use( cookie({
//   name: 'session',
//   keys: ['key1', 'key2']
// }))

// add some middleware that always sends unauthenicated users to the login page
// app.use( function( request,response,next) {
//   if( request.session.login === true ) {
//     next()
//   } else {
//     response.sendFile( __dirname + '/public/index.html' )
//   }
// })
