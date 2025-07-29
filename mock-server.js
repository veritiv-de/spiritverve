const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Mock the /hello endpoint
app.get('/api/hello/hello', (req, res) => {
  console.log('Mock API called: /api/hello/hello');
  res.json({
    message: 'Hello from the backend!',
    timestamp: new Date().toISOString(),
    requestId: 'mock-' + Math.random().toString(36).substr(2, 9)
  });
});

// Alternative endpoint without double /hello
app.get('/api/hello', (req, res) => {
  console.log('Mock API called: /api/hello');
  res.json({
    message: 'Hello from the backend!',
    timestamp: new Date().toISOString(),
    requestId: 'mock-' + Math.random().toString(36).substr(2, 9)
  });
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET /api/hello');
  console.log('  GET /api/hello/hello');
});