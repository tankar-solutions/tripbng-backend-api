import mongoose from "mongoose";
import { generateOTP } from "../../utils/generateOtp.js"
import { sendMail } from "../../utils/sendMail.js"
import { sendSMS } from "../../utils/SMS.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const CpSchema = mongoose.Schema({

    cpName:{
        type:String,
        required:true,
        uniqe:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    PanCardDetails :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PanCard",
        // required:true
    },
    country:{
        type:String,
        required:true

    },
    state:{
        type:String,
        required:true

    },
    city:{
        type:String,
        required:true
        
    },
    pincode:{
        type:String,
        required:true

    },
    address1:{
        type:String,
        required:true
    },
    address2:{
        type:String
    },
    address3:{
        type:String
    },
    adharNumber:{
        type:String,
        required:true
    },
    gstNumber:{
        type:String
    },
    aprove:{
        type:Boolean,
        default:false,
        
    },
    condition:{
        type:Boolean,
        default:false
    },
    Usertype:{
        type:String,
        default:"Cp"
    }


},{ timestamps: true })



CpSchema.methods.GenrateAccessTocken = function()
{
  return jwt.sign(
    {
      _id:this._id,
      type:this.Usertype

    },
    process.env.JWT_SECRET,
    {
      expiresIn:process.env.JWT_EXPIRE
    }
  )
}
CpSchema.pre("save" , async function(next){
  if(!this.isModified("password")){next()}
  this.password = await bcrypt.hash(this.password , 10);
  next();
})

CpSchema.methods.PassCompare = async function(userPassword)
{
  return await bcrypt.compare(userPassword , this.password)
}

CpSchema.post("save" ,async function()
{
    const cpUrl = 'something.com';
    const message = `Agency name ${this.cpName} is Request to Aprove Thire request click on this link ${cpUrl}`;

    await sendMail(this.email , "Aprove request" , message);
    await sendSMS(message , this.mobile);
})

export const Cp = mongoose.model('Cp' , CpSchema)