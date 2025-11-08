require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const hospitalRoutes = require('./routes/hospital');
const bedRoutes = require('./routes/bed');
const emergencyRoutes = require('./routes/emergency');
const hospitalRegistrationRoutes = require('./routes/hospitalRegistration');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/hospital-registration', hospitalRegistrationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(errorHandler);

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  socket.on('join:hospital', (hospitalId) => {
    socket.join(`hospital:${hospitalId}`);
    console.log(`Socket ${socket.id} joined hospital room: ${hospitalId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
