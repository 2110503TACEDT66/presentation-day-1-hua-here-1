const express = require('express');
const {getHotels,getHotel,createHotel,deleteHotel,updateHotel} = require('../controllers/hotels');
const { model } = require('mongoose');
const router = express.Router();

router.route('/').get(getHotels).post(createHotel);
router.route('/:id').get(getHotel).put(updateHotel).delete(deleteHotel);

module.exports = router;