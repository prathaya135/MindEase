const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();

// ✅ Allow CORS for API routes (HTTP)
app.use(cors({
  origin: 'http://localhost:3000',   // ✅ Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ✅ Your API Routes
app.use('/api', require('./routes/authRoutes'));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.error('MongoDB Error:', err));

const server = http.createServer(app);

// ✅ Socket.IO CORS Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",       // ✅ Frontend
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ✅ Import and use your chatSocket logic
require('./sockets/chatSocket')(io);

// ✅ Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
