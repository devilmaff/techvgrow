const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const path = require('path');

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(express.json()); // To accept JSON data in the body
app.use(express.urlencoded({ extended: false })); // To handle form submissions
app.use(cookieParser()); // To parse cookies from the request

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enrollment', require('./routes/enrollment'));

// Define the Port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));