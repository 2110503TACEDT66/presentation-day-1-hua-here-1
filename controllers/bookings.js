const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

exports.getBookings=async (req,res,next)=>{
    let query;
    if(req.user.role!=='admin'){
        query=Booking.find({user:req.user.id}).populate([
            {
            path:'hotel',
            select:'name province tel'
        },
        {
            path:'room',
            select:'roomNo roomType'
        }]
        );
    }else{
        if(req.params.hotelId){
            console.log(req.params.hotelId);
            query=Booking.find({hotel:req.params.hotelId}).populate([{
                path:'hotel',
                select:'name province tel'
            },
            {
                path:'room',
                select:'roomNo roomType'
            }]
            );
        }else
        query=Booking.find().populate([{
            path:'hotel',
            select:'name province tel'
        },
        {
            path:'room',
            select:'roomNo roomType'
        }]
        );
    }
    try{
        const booking = await query;
        res.status(200).json({success:true,count:booking.length,data:booking});

    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Booking"});
    }
}
exports.getBooking=async(req,res,next)=>{
    try{
        const booking = await Booking.findById(req.params.id).populate([
            {
            path:'hotel',
            select:'name province tel'
        },
        {
            path:'room',
            select:'roomNo roomType'
        }]
        );
        if(!booking){
            return res.status(404).json({success:false,message:`No booking with the id of ${req.params.id}`});
        }
        res.status(200).json({success:true,data:booking});
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Booking"});
    }
}
exports.addBooking=async(req,res,next)=>{
    try{
        req.body.hotel=req.params.hotelId
        const hotel = await Hotel.findById(req.params.hotelId);
        if(!hotel){
            return res.status(404).json({success:false,message:`No hotel with the id of ${req.params.hotelId}`});
        }
        const room = await Room.findById(req.body.room);
        if(!room){
            return res.status(404).json({success:false,message:`No room with the id of ${req.body.room}`});
        }
        req.body.user=req.user.id;
        const existedBooking = await Booking.find({user:req.user.id});
        if(existedBooking.length>=3&&req.user.role!=='admin'){
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} has already made 3 bookings`})
        }
        const booking = await Booking.create(req.body);
        res.status(200).json({success:true,data:booking});

        }catch(error){
            console.log(error);
            return res.status(500).json({success:false,message:"Cannot create Booking"});
        }
    }
    exports.updateBooking=async(req,res,next)=>{
        try{
            let booking = await Booking.findById(req.params.id);
            if(!booking){
                return res.status(404).json({success:true,message:`No Booking with the id of${req.params.id}`});
            }
            if(booking.user.toString()!==req.user.id&&req.user.role!=='admin'){
                return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this booking`})
            }
            booking=await Booking.findByIdAndUpdate(req.params.id,req.body,{
                new:true,
                runValidators:true
            });
            res.status(200).json({success:true,data:booking});
        }catch(error){
            console.log(error);
            return res.status(500).json({success:false,message:"Cannot update Booking"});
        }
    }
    exports.deleteBooking=async(req,res,next)=>{
        try{
            const booking = await Booking.findById(req.params.id);
            if(!booking){
                return res.status(404).json({success:true,message:`No Booking with the id of${req.params.id}`});

            }
            if(booking.user.toString()!==req.user.id&&req.user.role!=='admin'){
                return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this booking`})
            }
            await booking.deleteOne();
            res.status(200).json({
                succes:true,
                data:{}
            });
        }catch(error){
            console.log(error);
            return res.status(500).json({success:false,message:"Cannot delete Booking"});
    }
}
