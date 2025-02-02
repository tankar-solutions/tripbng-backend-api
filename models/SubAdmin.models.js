import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const SubAdminSchema = new mongoose.Schema(
    {
        username:
        {
            type:String,
            required:true,
            uniqe:true
        },
        email:
        {
            type:String,
            required:true
        },
        password:
        {
            type:String,
            required:true
        },
        domain:
        {
            type:String,
            required:true,
        }

    },{timestamps:true}
)


SubAdminSchema.pre("save" ,function()
{
    if(!this.isModified(this.password)){true}
    this.password = bcrypt.hash(this.password);
})

SubAdminSchema.methods.PassCompare = function(userPassword)
{
  return bcrypt.compare(userPassword , this.password)
}

SubAdminSchema.methods.GenrateAccessTocken = function()
{
  return jwt.sign(
    {
      _id:this._id,
      username:this.username,
      email:this.email

    },
    process.env.JWT_SECRET,
    {
      expiresIn:process.env.JWT_EXPIRE
    }
  )
}


export const SubAdmin = mongoose.model("SubAdmin" , SubAdminSchema)