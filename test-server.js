const http = require('http');
const db = require('./db');

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'OK', message: 'NodeVault Backend is running' }));
  } 
  else if (req.url === '/records') {
    try {
      const records = db.listRecords();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, count: records.length, records }));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  }
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ NodeVault HTTP Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
