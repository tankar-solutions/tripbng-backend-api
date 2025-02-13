import mongoose from "mongoose";



const BusBookingSchema = new mongoose.Schema({
    SeatBookUserEmail :{
        type:String,
        required:true
    },
    UserType:{
        type:String,
        required:true
    },
    SeatBookUserNumber :{
        type:String,
        required:true
    },
    BookingRefNo:{
        type:String,
        requried:true
    },
    DroppingId:{
        type:String,
        required:true
    },
    BoardingId:{
        type:String,
        required:true
    },
    TickitNumber :{
        type:String,
        required:true
    },
    LadiesSeat:{
        type:String,
        required:true
    },
    SeatNumber:{
        type:String,
        required:true
    }


},{timestamps:true})


export const BusBooking = mongoose.model("BusBooking" , BusBookingSchema);