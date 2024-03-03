exports.getHotels = (req,res,next) => {
    res.status(200).json({success: true, msg: 'Get all hotels'});
}

exports.getHotel = (req,res,next) => {
    res.status(200).json({success: true, msg: `Get hotel${req.params.id}`});
}

exports.createHotel = (req,res,next) => {
    res.status(200).json({success: true, msg: 'Create a hotel'});
}

exports.updateHotel = (req,res,next) => {
    res.status(200).json({success: true, msg: `Update hotel${req.params.id}`});
}

exports.deleteHotel = (req,res,next) => {
    res.status(200).json({success: true, msg: `Delete hotel${req.params.id}`});
}