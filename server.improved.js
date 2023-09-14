const crypto = require('crypto'),
  express = require('express'),
  app = express()

require('dotenv').config()

let last_updated = Date.now()

const inventory = [
  { 'item': 'Baseball', 'amount': 25, 'unit_value': 2.10, 'uuid': '47ffd1bf-4bc4-4028-b1d0-4bb1f7212b0b', 'total_value': 52.50 },
  { 'item': 'Shoes', 'amount': 2000, 'unit_value': 150.00, 'uuid': '76fba967-baec-46f1-9fa2-2383b6c4f7d7', 'total_value': 300000.00 },
  { 'item': 'Table', 'amount': 7, 'unit_value': 25.03, 'uuid': '46d67fca-9211-4fda-84a8-ac41a12cafc3', 'total_value': 175.21 },
]

app.use( express.static( 'public' ) )
app.use( express.json() )

app.get( '/last_updated', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ last_updated }))
})

app.get( '/data', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(inventory))
})

app.post( '/add', (req, res) => {
  const data = req.body
  data['uuid'] = crypto.randomUUID()
  data['total_value'] = parseFloat((data['amount'] * data['unit_value']).toFixed(2))
  inventory.push(data)
  console.log('ADD:', data)
  last_updated = Date.now()

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
})

app.post( '/delete', (req, res) => {
  const data = req.body
  let foundElement
  inventory.forEach(element => {
    if(element['uuid'] === data['uuid']) {
      foundElement = element
    }
  })

  if(foundElement !== undefined) {
    // remove object from inventory
    const index = inventory.indexOf(foundElement)
    inventory.splice(index, 1)
    console.log('DELETE:', foundElement)
    last_updated = Date.now()

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(foundElement))
  } else {
    console.log(`Delete Failed: UUID not found. (${data['uuid']})`)

    res.writeHead(412, { 'Content-Type': 'text/plain' })
    res.end('Could not delete object: UUID Not Found')
  }
})

app.post( '/modify', (req, res) => {
  const data = req.body
  let elementFound = false
  for(let i = 0; i < inventory.length; i++) {
    if(inventory[i]['uuid'] !== data['uuid']) {
      continue
    }

    data['total_value'] = parseFloat((data['amount'] * data['unit_value']).toFixed(2))
    inventory[i] = data
    console.log('MODIFY:', data)
    last_updated = Date.now()

    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(JSON.stringify(data))
    elementFound = true
    break
  }

  if(!elementFound) {
    res.writeHead(412, { 'Content-Type': 'text/plain' })
    res.end('Could not delete object: UUID Not Found')
  }
})

app.listen( process.env.PORT || 3000 )
