// server.js
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./utils/db');
const authRoute = require('./Routes/auth');
const analysisRoute = require('./Routes/analysis');

dotenv.config();

const app = express();

// Correct frontend origin for Vite
// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173","http://localhost:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/analysis', analysisRoute);

app.get('/', (req, res) => {
  res.send('AgroVision Backend running');
});

// Use a safe port (5000 is used by macOS)
const PORT = process.env.PORT || 5001;

// Validate JWT secret
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
  process.exit(1);
}

// Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
