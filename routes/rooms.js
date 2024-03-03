const express = require('express');
const{getRooms,getRoom,addRoom,updateRoom,deleteRoom}=require('../controllers/rooms');
const bookingRouter=require('./bookings');
const router=express.Router({mergeParams:true});
const{protect,authorize}=require('../middleware/auth');
router.use('/:roomId/bookings/',bookingRouter);
router.route('/').get(protect, getRooms).post(protect,authorize('admin'),addRoom);
router.route('/:id').get(protect,getRoom).put(protect,authorize('admin'),updateRoom).delete(protect,authorize('admin'),deleteRoom);
module.exports=router;