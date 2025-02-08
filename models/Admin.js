/** @format */
import mongoose from 'mongoose';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const adminSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
    },
    username:{
      type:String,
      require:true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      match: [/^\d{10}$/, 'Mobile number must be a 10 digit number'],
    },
    pincode: {
      type: String,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    logo: {
      type: String,
    },
    Usertype:{
      type:String,
      default:"Admin"
    }
  },
  { timestamps: true }
);


adminSchema.pre("save" , async function(next){
  if(!this.isModified("password")){next()}
  this.password = await bcrypt.hash(this.password , 10);
  next();
})

adminSchema.methods.PassCompare = async function(userPassword)
{
  return await bcrypt.compare(userPassword , this.password)
}

adminSchema.methods.GenrateAccessTocken = function()
{
  return jwt.sign(
    {
      _id:this._id,
      username:this.username,
      email:this.email,
      type:this.Usertype

    },
    process.env.JWT_SECRET,
    {
      expiresIn:process.env.JWT_EXPIRE
    }
  )
}

adminSchema.index({ email: 1 }, { unique: true });

export const Admin = mongoose.model('Admin', adminSchema);
