const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Load env vars
dotenv.config({path:'./config/config.env'});

// Connect to database
connectDB();

// Route files
const hotels = require('./routes/hotels');
const auth = require('./routes/auth');
const bookings = require('./routes/bookings');
const rooms=require('./routes/rooms');

const app = express();
// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

//Set Security headers
app.use(helmet());

// XSS Protection
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
});

app.use(limiter);

// Prevent hpp param pollutions
app.use(hpp());

// Enable CORS
app.use(cors());

app.use('/api/v1/hotels' , hotels);
app.use('/api/v1/auth', auth);
app.use('/api/v1/bookings',bookings);
app.use('/api/v1/rooms',rooms);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server running in', process.env.NODE_ENV,'on ' + process.env.HOST + ':' + PORT));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});