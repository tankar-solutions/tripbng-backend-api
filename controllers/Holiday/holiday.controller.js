import  Package  from "../../models/Package.js";
import { AsnycHandler } from "../../utils/AsnycHandler.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { isNull } from "../../utils/FormCheck.js"
import {userPackage} from "../../models/UserPackage.js"


const packages = AsnycHandler(async (req, res) => {
    const { Destination } = req.body;

    if (!Destination) {
        const packages = await Package.find();

        if(!packages)
        {
            return res.status(200)
            .json(
                new ApiResponse(200 , {success:true , data:"packages are not found"} , "Packages are not found")
            )
        }
        return res.status(200)
        .json(
            new ApiResponse(200 ,{success:true , data:packages} , "All The packages")
        )
    }

    const packages = await Package.find({destination:Destination});

    if(!packages)
    {
        return res.status(200)
        .json(
            new ApiResponse(200 , {success:true , data:"Package not found"} , "Package not found")
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200 ,{success:true , data:packages} , "All packages are")
    )

})


const createPackages = AsnycHandler(async(req,res)=>{
    const {destination,nights,days,hotel_type,discription} = req.body;
    const user = req.user;
    if(isNull([destination,nights ,days,hotel_type,discription]))
    {
        return res.status(400)
        .json(
            new ApiResponse(400,{success:false , data:"Please Enter  the all data"} ,"Please Enter the all data")
        )
    }

    const CreateNewPackages = await userPackage.create(
        {
            username:user.username || user.agencyName || user.cpName,
            Usertype:user.Usertype,
            destination,
            nights,
            days,
            hotel_type,
            discription,
            email:user.email,
            mobile:user.mobile || "Will check letter"
        }
    )

    if(!CreateNewPackages)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false ,data:"Sorry packages is not created"},"sorry packages is not created")
        )
    }

    // const SendEmailToDMC = await CreateNewPackages.info("request for travel page" , CreateNewPackages);

    // if(!SendEmailToDMC)
    // {
    //     return res.status(400)
    //     .json(
    //         new ApiResponse(400 , {success:false , data:"We Can't Create a contect with DMCs"},"We Can't Create a contect with DMC's Please Try Again")
    //     )
    // }


    return res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:"Your packages is created we response you in message" },"data padh lo bhai")
    )
     
})


export 
{
    createPackages
}