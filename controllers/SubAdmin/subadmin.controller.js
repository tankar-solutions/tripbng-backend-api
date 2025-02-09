import { SubAdmin } from "../../models/SubAdmin.models";
import { AsnycHandler } from "../utils/AsnycHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const options = {
    httpOnly: true,
    secure: true
};

const SubAdminLogin = AsnycHandler(async(req ,res)=>{
    const {username , password} = req.body;
    const userExist = await SubAdmin.findOne({username})
    if(!userExist)
    {
        return res.status(400)
        .json(new ApiResponse(400 , {success:false}, "user is not exist"))
    }

    const isPassCorrect = await userExist.PassCompare(password);

    if(!isPassCorrect){
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false} , "Please Enter correct password")
        )
    }

    const AccessToken = userExist.GenrateAccessTocken();
    if(!AccessToken)
    {
        return res.status(500)
        .json(
            new ApiResponse(500 , {success:false} , "Something Went wrong while generating token")
        )
    }

    return res.status(200)
    .cookie("AccessToken" , AccessToken , options)
    .json(
        new ApiResponse(200,{success:true , AccessToken}, "User Login")
    )
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