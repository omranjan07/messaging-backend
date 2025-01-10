const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store messages in memory (for demo purposes)
const messages = [];

// Endpoint to fetch all messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Socket.IO for real-time messaging
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for new messages
  socket.on('sendMessage', (message) => {
    messages.push(message); // Save message
    io.emit('receiveMessage', message); // Broadcast to all users
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
