require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Initialize Firebase config early to catch any errors
try {
  require('./config/config');
  console.log('Firebase configuration loaded successfully');
} catch (error) {
  console.warn('Firebase configuration warning:', error.message);
}

// Import routes with individual error handling
let authRoutes, dashboardRoutes, aiRoutes, marketplaceRoutes, communityRoutes, weatherRoutes, farmHealthRoutes;

// Create fallback router
const createFallbackRouter = (routeName) => {
  const fallbackRouter = express.Router();
  fallbackRouter.all('*', (req, res) => {
    res.status(503).json({ 
      error: `${routeName} service temporarily unavailable`,
      message: 'Some features may be limited during deployment'
    });
  });
  return fallbackRouter;
};

// Load routes individually with error handling
try {
  authRoutes = require('./routes/auth');
  console.log('Auth routes loaded');
} catch (error) {
  console.warn('Auth routes failed to load:', error.message);
  authRoutes = createFallbackRouter('Auth');
}

try {
  dashboardRoutes = require('./routes/dashboard');
  console.log('Dashboard routes loaded');
} catch (error) {
  console.warn('Dashboard routes failed to load:', error.message);
  dashboardRoutes = createFallbackRouter('Dashboard');
}

try {
  aiRoutes = require('./routes/ai');
  console.log('AI routes loaded');
} catch (error) {
  console.warn('AI routes failed to load:', error.message);
  aiRoutes = createFallbackRouter('AI');
}

try {
  marketplaceRoutes = require('./routes/marketplace');
  console.log('Marketplace routes loaded');
} catch (error) {
  console.warn('Marketplace routes failed to load:', error.message);
  marketplaceRoutes = createFallbackRouter('Marketplace');
}

try {
  communityRoutes = require('./routes/community');
  console.log('Community routes loaded');
} catch (error) {
  console.warn('Community routes failed to load:', error.message);
  communityRoutes = createFallbackRouter('Community');
}

try {
  weatherRoutes = require('./routes/weather');
  console.log('Weather routes loaded');
} catch (error) {
  console.warn('Weather routes failed to load:', error.message);
  weatherRoutes = createFallbackRouter('Weather');
}

try {
  farmHealthRoutes = require('./routes/farmHealth');
  console.log('Farm Health routes loaded');
} catch (error) {
  console.warn('Farm Health routes failed to load:', error.message);
  farmHealthRoutes = createFallbackRouter('FarmHealth');
}

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
const buildPath = path.join(__dirname, '../client/build');
const publicPath = path.join(__dirname, '../public');
const fs = require('fs');

// Check if build directory exists, otherwise serve public folder
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  console.log('Serving React build files from:', buildPath);
} else if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  console.log('Serving static files from public directory:', publicPath);
} else {
  console.warn('Neither React build nor public directory found');
  // Serve a simple fallback page
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head><title>FarmConnect</title></head>
        <body>
          <h1>FarmConnect</h1>
          <p>Application is starting up...</p>
          <p>Build directory: ${buildPath}</p>
        </body>
      </html>
    `);
  });
}

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
  const indexPath = path.join(__dirname, '../client/build/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <html>
        <head><title>FarmConnect</title></head>
        <body>
          <h1>FarmConnect API Server</h1>
          <p>Server is running but React build not found.</p>
          <p>API endpoints are available at /api/*</p>
        </body>
      </html>
    `);
  }
});

const PORT = process.env.PORT || 5002;


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, io }; 