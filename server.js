const express = require('express');
const dotenv = require('dotenv');

dotenv.config({path:'./config/config.env'});

const app = express();

const hotels = require('./routes/hotels');
app.use('/api/v1/hotels', hotels);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port', PORT));