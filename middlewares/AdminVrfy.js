import {Admin} from "../models/Admin.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


export const AdminVerify = async (req,res,next)=>
{
   
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

    const user = await Admin.findById(Decodeduser._id).select("-password")

    req.user = user;
    next();
}

