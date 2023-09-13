require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const http = require('http');
const path = require('path');
const fs = require('fs');
const dir = 'public';
const port = 3000;

function connectToDatabase() {
  try {
    const client = new MongoClient(process.env.MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    const tempDB = client.db('Project-A3');
    tempDB.command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return tempDB;
  } catch (error) {
    console.error(error);
  }
}

let db = connectToDatabase();

// Get or create collection
let dbCollection = db.collection('Expenses');
if (dbCollection === null || dbCollection === undefined) {
  console.error("MongoDB does not have collection, 'Expenses'!");
  return;
}

function handleApiCalls(req, res) {
  const method = req.method;
  res.writeHead(200, { 'Content-Type': 'application/json' });

  switch (method) {
    case 'GET':
      fetchExpenses(req, res);
      break;
    case 'POST':
      addExpense(req, res);
      break;
    case 'PUT':
      updateExpense(req, res);
      break;
    case 'DELETE':
      deleteExpense(req, res);
      break;
    default:
      res.end(JSON.stringify({ message: 'Method not supported' }));
      break;
  }
}

async function fetchExpenses(req, res) {
  try {
    const expenses = await dbCollection.find().toArray();
    res.end(JSON.stringify({ expenses }));
  } catch (error) {
    res.end(JSON.stringify({ message: 'Failed to fetch expenses', error }));
  }
}

async function addExpense(req, res) {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { Cost, Date, Item } = JSON.parse(body);
      const result = dbCollection.insertOne({ Cost, Date, Item });
      res.end(JSON.stringify({ message: 'Expense added', result }));
    } catch (error) {
      res.end(JSON.stringify({ message: 'Failed to add expense', error }));
    }
  });
}

async function updateExpense(req, res) {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { _id, Cost, Date, Item } = JSON.parse(body);
      const result = await dbCollection.updateOne({ _id: new ObjectId(_id) }, { $set: { Cost, Date, Item } });
      res.end(JSON.stringify({ message: 'Expense updated', result }));
    } catch (error) {
      res.end(JSON.stringify({ message: 'Failed to update expense', error }));
    }
  });
}

async function deleteExpense(req, res) {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { _id } = JSON.parse(body);
      const result = await dbCollection.deleteOne({ _id: new ObjectId(_id) });
      res.end(JSON.stringify({ message: 'Expense deleted', result }));
    } catch (error) {
      res.end(JSON.stringify({ message: 'Failed to delete expense', error }));
    }
  });
}

function serveStaticFiles(req, res) {
  const filePath = path.join(__dirname, dir, req.url === '/' ? 'index.html' : req.url);
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
  };
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end('File Does Not Exist.');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

const server = http.createServer((req, res) => {
  //console.log(req.url);

  if (req.url.includes("/api")) {
    handleApiCalls(req, res);
  } else {
    serveStaticFiles(req, res);
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});