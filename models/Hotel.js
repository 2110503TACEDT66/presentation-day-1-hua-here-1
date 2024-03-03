const mongoose = require('mongoose');
const HotelSchema = new mongoose.Schema({
    name:{
        type : String,
        required :[true,'Please add a name'],
        unique : true,
        trim : true,
        maxlength:[50,'Name can not be more than 50 characters']
    },

    address :{
        type : String,
        required : [true,'Please add an address']
    },
    district:{
        type:String,
        required : [true,'Please add a district']
    },
    province:{
        type : String,
        required: [true,'Please add a province']
    },
    postalcode:{
        type:String,
        required:[true,'Please add a postalcode'],
        maxlength:[5,'Postal Code can not be more than 5 digits']
    },
    tel:{
        type:String
    },
    region:{
        type:String,
        required:[true,'Please add a region']
    }


},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}

}
) ;
HotelSchema.pre('deleteOne',{document:true,query:false},async function(next){
    console.log(`Rooms and bookings being removed from hotel ${this.id}`);
    await this.model('Room').deleteMany({hotel:this._id});
    await this.model('Booking').deleteMany({hotel:this._id});
    next();
})
HotelSchema.virtual('rooms',{
    ref:'Room',
    localField:'_id',
    foreignField:'hotel',
    justOne:false
});
HotelSchema.virtual('bookings',{
    ref:'Booking',
    localField:'_id',
    foreignField:'hotel',
    justOne:false
});

module.exports=mongoose.model('Hotel',HotelSchema);