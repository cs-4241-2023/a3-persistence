const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const avgAges = {"Chameleon": 7, "Gecko": 7,
                 "Frog": 10, "Snake": 15,
                 "Cat": 13, "Dog": 12,
                 "Rat": 2, "Capybara": 6,}
const maxAges = {"Chameleon": 16, "Gecko": 20,
                 "Frog": 20, "Snake": 30,
                 "Cat": 20, "Dog": 15,
                 "Rat": 4, "Capybara": 12,}
const creaturePics = {"Chameleon": 'https://lafeber.com/vet/wp-content/uploads/Veiled-chameleon-by-Mrs-Logic-cropped-square.jpg', 
                      "Gecko": 'https://reptile.guide/wp-content/uploads/2021/03/Leopardengecko-eublepharis-macularius.jpg',
                      "Frog": 'https://www.sonova.com/sites/default/files/styles/header_image_tablet/public/2019-07/shutterstock_253580635_square.jpg?itok=TwBeTHTY', 
                      "Snake": 'https://static.wixstatic.com/media/a96e12_2bfd46ea53944c979c805a5a50327cb9~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
                      "Cat": 'https://media.discordapp.net/attachments/1149381126847201290/1149489057265623211/PXL_20230902_231104485.jpg?width=443&height=468', 
                      "Dog": 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg',
                      "Rat": 'https://images.squarespace-cdn.com/content/v1/55801f1be4b0bd4b73b60d65/1449930415127-EU3SDWQQMOO6LV0Y0QJF/rat+square.jpg', 
                      "Capybara": 'https://gvzoo.com/cms-data/gallery/blog/animals/capybara/banner-capybara-sq.jpg',}

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    const stuff = JSON.parse(dataString)
    // ... do something with the data here!!!
    const json = { name: stuff.name,
                   type: stuff.type,
                   age: stuff.age,
                   status: '',
                   picture: ''}


    json.picture = creaturePics[stuff.type];

    if(stuff.age <= avgAges[stuff.type] / 2){
      json.status = "your creature is young!"
    }else if(stuff.age >= maxAges[stuff.type]){
      json.status = "your creature is ancient!!"
    }else{
      json.status = "your creature is middle aged"
    }

    console.log(json)

    response.writeHead( 200, "OK", {'Content-Type': 'text/json' })
    response.end(JSON.stringify( [json] ))
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
