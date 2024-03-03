const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({path:'./config/config.env'});
//connect to database
connectDB();
const app = express();
app.use(express.json());

const hotels = require('./routes/hotels');
app.use('/api/v1/hotels', hotels);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port', PORT));
process.on('unhandleRejection',(err,promise)=>{
    console.log(` Error: ${err.message}` );
    server.close(()=>process.exit(1));
});