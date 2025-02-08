import { SubAdmin } from "../../models/SubAdmin.models";
import { AsnycHandler } from "../utils/AsnycHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"



const SubAdminLogin = AsnycHandler(async(req ,res)=>{
    const {username , password} = req.body;
    
})

const GetSubAdminProfile = AsnycHandler(async(req ,res)=>{
    const user = req.user
    if(user.Usertype != "SubAdmin")
    {
       
    }
    if(user.domain == "")
    {}
    else if(user.domain == "")
    {}

})