const mongoose = require('mongoose');

const RoomSchema=new mongoose.Schema({
    roomNo:{
        type : String,
        requried : true
    },
    hotel:{
        type: mongoose.Schema.ObjectId,
        ref : 'Hotel',
        required:true
    },
    roomType : {
        type : String,
        required : true
    },
    price:{ 
        type : String,
        required : true

    }
    
})
RoomSchema.pre('deleteOne',{document:true,query:false},async function(next){
    console.log(`Bookings being removed from Room ${this.id}`);
    
    await this.model('Booking').deleteMany({room:this._id});
    next();
})
module.exports=mongoose.model('Room',RoomSchema);