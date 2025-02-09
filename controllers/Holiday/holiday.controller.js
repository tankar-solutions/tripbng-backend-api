import Package from "../../models/Package";
import { AsnycHandler } from "../utils/AsnycHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"



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
    const {Discription} = req.body;
    const user = req.user;
    
})