require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const aiRoutes = require('./routes/ai');
const marketplaceRoutes = require('./routes/marketplace');
const communityRoutes = require('./routes/community');
const weatherRoutes = require('./routes/weather');
const farmHealthRoutes = require('./routes/farmHealth');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/farm-health', farmHealthRoutes);

// Serve static files from React build (after API routes)
app.use(express.static(path.join(__dirname, '../client/build')));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join-farm', (farmId) => {
    socket.join(farmId);
    console.log(`Client joined farm: ${farmId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Global middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 5002;


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, io }; 