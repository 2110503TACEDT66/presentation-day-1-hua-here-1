const Hotel = require('../models/Hotel.js');
const Room = require('../models/Room.js');

exports.getHotels =async (req,res,next) => {
    let query;
    const reqQuery = {...req.query};
    const removeFields = ['select','sort','page','limit'];
    removeFields.forEach(param => delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

    query = Hotel.find(JSON.parse(queryStr)).populate('rooms').populate('bookings');

    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query=query.sort('name');
    }

    // Pagination
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Hotel.countDocuments();

    query = query.skip(startIndex).limit(limit);

    try{
        const hotels = await query;
        const pagination = {};

        if (endIndex < total) {
            pagination.next = { page:page+1, limit };
        }
        if(startIndex > 0){
            pagination.prev={ page:page-1, limit };
        }
        res.status(200).json({
            success: true,
            count:hotels.length,
            pagination,
            data:hotels
        });
    } catch(err) {
        res.status(400).json({success:false});
    }
}

exports.getHotel = async(req,res,next) => {
    try{
        const hotel = await Hotel.findById(req.params.id).populate('rooms').populate('bookings');

        if (!hotel) {
            return res.status(404).json({success:false, msg: 'No hotel found'});
        }

        res.status(200).json({success: true, data:hotel});
    } catch(err) {
        res.status(400).json({success:false});
    }
}

exports.createHotel = async (req,res,next) => {
    try {
        // Create the hotel
        const hotel = await Hotel.create(req.body);

        const generatedRandomPrice = (min,max) => {
            const randomPrice = Math.floor(Math.random() * (max - min) + min);
            return Math.floor(randomPrice / 100) * 100;
        };

        // Create 3 based rooms
        const roomsData = [
            { roomNo: '101', roomType: 'Standard', price: generatedRandomPrice(1000,2000) },
            { roomNo: '102', roomType: 'Standard', price: generatedRandomPrice(1000,2000) },
            { roomNo: '103', roomType: 'Luxury', price: generatedRandomPrice(4000,5000) }
        ];

        const roomPromises = roomsData.map((roomData) => {
            roomData.hotel = hotel._id;
            return Room.create(roomData);
        });

        const rooms = await Promise.all(roomPromises);
        res.status(201).json({success: true, data: {hotel, rooms}});
    } catch (err) {
        console.log(err);
        res.status(400).json({success:false});
    }

}

exports.updateHotel = async (req,res,next) => {
    try{
        const hotel = await Hotel.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators:true
        });
        if(!hotel){
            return res.status(404).json({success:false, msg: 'Hotel not found'});
        }
        res.status(200).json({success: true, data : hotel});
    }catch(err){
        res.status(400).json({success:false});
    }
}

exports.deleteHotel = async (req,res,next) => {
    try{
        const hotel = await Hotel.findById(req.params.id);
        if(!hotel){
            return res.status(400).json({success:false});
         }
         await hotel.deleteOne();
         res.status(200).json({success:true,data: {}});
    
    }catch(err){
        res.status(400).json({success:false});
    }
}