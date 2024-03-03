const { rawListeners } = require('../models/Booking.js');
const Room= require('../models/Room.js');
const Hotel = require('../models/Hotel');

exports.getRooms = async(req,res,next)=>{
    let query ;
    if(req.params.hotelId){
        console.log(req.params.hotelId);
        query = Room.find({hotel:req.params.hotelId}).populate({
            path:'hotel',
            select:'name province tel'
        });

    }else query = Room.find().populate({
        path:'hotel',
        select:'name province tel'
    });
    
    try{
        const room = await query;
        res.status(200).json({success:true,count:room.length,data:room});
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Room"});
    }
}
exports.getRoom=async(req,res,next)=>{
    try{
        const room = await Room.findById(req.params.id).populate({
            path:'hotel',
            select:'name province tel'
        });
        if(!room){
            return res.status(404).json({success:false,message:`No room with the id of ${req.params.id}`});
        }
        res.status(200).json({success:true,data:room});
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Room"});
    }
}
exports.addRoom=async(req,res,next)=>{
    try{
        req.body.hotel=req.params.hotelId
        const hotel = await Hotel.findById(req.params.hotelId);
        if(!hotel){
            return res.status(404).json({success:false,message:`No hotel with the id of ${req.params.hotelId}`});
        }
        
        const room = await Room.create(req.body);
        res.status(200).json({success:true,data:room});

        }catch(error){
            console.log(error);
            return res.status(500).json({success:false,message:"Cannot create Room"});
        }
    }
    exports.updateRoom=async(req,res,next)=>{
        try{
            let room = await Room.findById(req.params.id);
            if(!room){
                return res.status(404).json({success:false,message:`No Room with the id of${req.params.id}`});
            }
            room=await Room.findByIdAndUpdate(req.params.id,req.body,{
                new:true,
                runValidators:true
            });
            res.status(200).json({success:true,data:room});
        }catch(error){
            console.log(error);
            return res.status(500).json({success:false,message:"Cannot update Room"});
        }
    }
    exports.deleteRoom=async(req,res,next)=>{
        try{
            const room = await Room.findById(req.params.id);
            if(!room){
                return res.status(404).json({success:false,message:`No Room with the id of${req.params.id}`});

            }
            await room.deleteOne();
            res.status(200).json({
                succes:true,
                data:{}
            });
        }catch(error){
            console.log(error);
            return res.status(500).json({success:false,message:"Cannot delete Room"});
    }
}