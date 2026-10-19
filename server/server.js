const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// Root / Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Student & Internship Recruitment Portal API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);



// 404 Not Found & Global Error Handler Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
