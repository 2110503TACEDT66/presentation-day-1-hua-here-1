const express = require('express');
const {getHotels,getHotel,createHotel,deleteHotel,updateHotel} = require('../controllers/hotels');
const bookingRouter=require('./bookings');
const roomRouter=require('./rooms');
// const { model } = require('mongoose');
const router = express.Router();

const {protect, authorize} = require('../middleware/auth');
router.use('/:hotelId/bookings/',bookingRouter);
router.use('/:hotelId/rooms/',roomRouter);

router.route('/').get(getHotels).post(protect, authorize('admin'), createHotel);
router.route('/:id').get(getHotel).put(protect, authorize('admin'), updateHotel).delete(protect, authorize('admin'), deleteHotel);

module.exports = router;