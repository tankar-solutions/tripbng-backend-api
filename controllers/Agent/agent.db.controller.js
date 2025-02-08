import { ApiResponse } from "../../utils/ApiResponse.js"
import { generateOTP } from "../../utils/generateOtp.js"
import { sendMail } from "../../utils/sendMail.js"
import { AsnycHandler } from "../../utils/AsnycHandler.js"
import { OtpVfy } from "../../models/Agent_Cp/OtpVfy.models.js"
import { isNull } from "../../utils/FormCheck.js"
import { Agent } from "../../models/Agent_Cp/Agent.models.js"
import { sendSMS } from "../../utils/SMS.js"


const GetAgentProfile = AsnycHandler(async(req ,res)=>{
    const agent = req.user;
    if(!agent)
    {
        return res.status(400)
        .json(new ApiResponse(400 , {success:false ,data:"agent is not found"} , "agent is not found"))
    }

    return res.status(200)
    .json(new ApiResponse(
        200 , {success:true , data:agent } , "Agent fetch successfully"
    ))

})

const GetAgentUrl = AsnycHandler(async(req ,res)=>{
    const user = req.user
    const id = req.params.id;
    if(!id)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false , data:"invalid url"} , "Invalid url")
        )
    }
    let Agent =null;
    if(user.Usertype == "Admin")
    {
     Agent = await Agent.findById(id).select("-password")
    }
    else 
    {
        Agent = await Agent.findById(id).select("-password -aprove")
    }

    return res.status(400)
    .json(new ApiResponse(400 , {success:true , data:Agent},"Data Fetch Successfully"))
})
//other fetures as like as user ............

export {
    GetAgentProfile,
    GetAgentUrl
}