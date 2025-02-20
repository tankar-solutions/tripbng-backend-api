import mongoose from "mongoose";


const OtpvrfSchema = mongoose.Schema({

   veryficationType:{
    type:String,
    enum:['phone' , 'email' , 'pan' , 'adhar' , 'login' , 'delete'],
    required:true
   },

   veryficationFeild:{
    type:String,
    required:true
   },
   otp:{
    type:String,
    required:true
   }


},{ timestamps:true })

export const OtpVfy = mongoose.model("OtpVfy" , OtpvrfSchema)