const http = require('http'),
  fs = require('fs'),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require('mime'),
  crypto = require('crypto'),
  dir = 'public/',
  port = 3000
  start_time = Date.now()

const inventory = [
  { 'item': 'Baseball', 'amount': 25, 'unit_value': 2.10, 'uuid': '47ffd1bf-4bc4-4028-b1d0-4bb1f7212b0b', 'total_value': 52.50 },
  { 'item': 'Shoes', 'amount': 2000, 'unit_value': 150.00, 'uuid': '76fba967-baec-46f1-9fa2-2383b6c4f7d7', 'total_value': 300000.00 },
  { 'item': 'Table', 'amount': 7, 'unit_value': 25.03, 'uuid': '46d67fca-9211-4fda-84a8-ac41a12cafc3', 'total_value': 175.21 },
]

const server = http.createServer(function (request, response) {
  if (request.method === 'GET') {
    handleGet(request, response)
  } else if (request.method === 'POST') {
    handlePost(request, response)
  }
})

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1)

  if (request.url === '/') {
    sendFile(response, 'public/index.html')
  } 
  else if (request.url === '/start_time') {
    response.writeHeader(200, { 'Content-Type': 'text/plain' })
    response.end(JSON.stringify({ start_time }))
  }
  else if (request.url === '/data') {
    response.writeHeader(200, { 'Content-Type': 'text/plain' })
    response.end(JSON.stringify(inventory))
  }
  else {
    sendFile(response, filename)
  }
}

const handlePost = function (request, response) {
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', function () {
    const data = JSON.parse(dataString)

    // ... do something with the data here!!!
    switch (request.url) {
      case '/add':
        data['uuid'] = crypto.randomUUID()
        data['total_value'] = parseFloat((data['amount'] * data['unit_value']).toFixed(2))
        inventory.push(data)
        console.log('ADD:', data)

        response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
        response.end(JSON.stringify(data))
        break

      case '/delete':
        let foundElement
        inventory.forEach(element => {
          if(element['uuid'] === data['uuid']) {
            foundElement = element
          }
        });

        if(foundElement !== undefined) {
          // remove object from inventory
          const index = inventory.indexOf(foundElement)
          inventory.splice(index, 1)
          console.log('DELETE:', foundElement)

          response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
          response.end(JSON.stringify(foundElement))
        } else {
          console.log(`Delete Failed: UUID not found. (${data['uuid']})`)

          response.writeHead(412)
          response.end('Could not delete object: UUID Not Found')
        }
        break

      case '/modify':
        for(let i = 0; i < inventory.length; i++) {
          if(inventory[i]['uuid'] !== data['uuid']) {
            continue
          }

          data['total_value'] = parseFloat((data['amount'] * data['unit_value']).toFixed(2))
          inventory[i] = data
          console.log('MODIFY:', data)

          response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
          response.end(JSON.stringify(data))
          break
        }
        break

      default:
        console.log(`Unknown Post (${request.url}):`, data)
    }
  })
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename)

  fs.readFile(filename, function (err, content) {

    // if the error = null, then we've loaded the file successfully
    if (err === null) {

      // status code: https://httpstatuses.com
      response.writeHeader(200, { 'Content-Type': type })
      response.end(content)

    } else {

      // file not found, error code 404
      response.writeHeader(404)
      response.end('404 Error: File Not Found')

    }
  })
}

server.listen(process.env.PORT || port)
