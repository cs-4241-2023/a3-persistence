require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const http = require('http');
const fs = require('fs');
const path = require('path');
const dir = 'public';
const port = 3000;

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    return client.db('ProjectCluster');
  } catch (error) {
    console.error(error);
  }
}

let db = connectToDatabase();

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

function handleApiCalls(req, res) {
  // Implement API logic here
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'API endpoint' }));
}

const server = http.createServer((req, res) => {
  switch (req.url) {
    case '/api/data':
      handleApiCalls(req, res);
      break;
    default:
      serveStaticFiles(req, res);
      break;
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});