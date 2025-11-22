const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Added CORS for frontend-backend communication
const connectDB = require('./utils/db');
const authRoute = require('./Routes/auth');
const analysisRoute = require('./Routes/analysis');

dotenv.config();

const app = express();

// Middleware
// CORS Configuration: Essential for cookies to work between localhost:3000 and localhost:5000
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true // Allow cookies to be sent/received
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/analysis', analysisRoute);
app.get('/', (req, res) => {
  res.send('AgroVision Backend running');
});

const PORT = process.env.PORT || 5000;

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
    process.exit(1);
}

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });