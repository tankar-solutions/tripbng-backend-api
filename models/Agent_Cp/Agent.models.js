import mongoose from "mongoose";
import { generateOTP } from "../../utils/generateOtp.js"
import { sendMail } from "../../utils/sendMail.js"
import { sendSMS } from "../../utils/SMS.js";
import { Admin } from "../Admin.js"; 
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const AgentSchema = mongoose.Schema({

    
    agencyName:{
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
        default:"Agent"
    }


},{ timestamps: true })



AgentSchema.methods.GenrateAccessTocken = function()
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
AgentSchema.pre("save" , async function(next){
  if(!this.isModified("password")){next()}
  this.password = await bcrypt.hash(this.password , 10);
  next();
})

AgentSchema.methods.PassCompare = async function(userPassword)
{
  return await bcrypt.compare(userPassword , this.password)
}

AgentSchema.post("save" ,async function()
{
    const AdminFind = await Admin.find({username:process.env.USERNAME_ADMIN})
     const AgencyUrl = `https://tripbng-backend-api-c6kw.onrender.com/AgentAuth/getagentprofile/${this._id}`;
    const message = `Agency name ${this.agencyName} is Request to Aprove Thire request click on this link ${AgencyUrl}`;

    await sendMail(AdminFind[0].email , "Aprove request" , message);
    await sendSMS(message , AdminFind[0].mobile);
})

export const Agent = mongoose.model('Agent' , AgentSchema)
