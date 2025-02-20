import {Admin} from "../models/Admin.js";
import { Cp } from "../models/Agent_Cp/Cp.models.js";
import { Agent } from "../models/Agent_Cp/Agent.models.js";
import Users from "../models/Users.js"
import { SubAdmin } from "../models/SubAdmin.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


export const UserVerify = async (req,res,next)=>
{
    let user =null;
    const token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "") 
    // console.log(token)
    if(!token)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 ,{success:false},"Please Login First")
        )
    }

    const Decodeduser = jwt.verify(token ,process.env.JWT_SECRET);
    if(!Decodeduser)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 ,{success:false} ,"Your Access Token is expire Please Login Again")
        )
    }

    console.log("type is " , Decodeduser.type)
    if(!Decodeduser.type)
    {
        return "Usertype is not define"
        
    }
    if(Decodeduser.type == "Admin")
    {

     user = await Admin.findById(Decodeduser._id).select("-password")
    }
    else  if(Decodeduser.type == "User"){
     user = await Users.findById(Decodeduser.id)
          
    }
    else if(Decodeduser.type == "Agent")
    {
         user = await Agent.findById(Decodeduser._id).select("-password")

    }
    else if(Decodeduser.type == "Cp")
    {
         user = await Cp.findById(Decodeduser._id).select("-password")

    }
    else if(Decodeduser.type == "SubAdmin")
    {
        user = await  SubAdmin.findById(Decodeduser._id).select("-password")
    }

    req.user = user;
    next();
}

