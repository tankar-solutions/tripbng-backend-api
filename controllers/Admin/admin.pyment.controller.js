import { AsnycHandler } from "../../utils/AsnycHandler.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import {authHeaders} from "../../middlewares/util.js"
import {sendPostRequest}  from "../../utils/sendRequest.js"
import { isNull } from "../../utils/FormCheck.js";




//see bus balance
const GetBalance = AsnycHandler(async(req ,res)=>{
    
    const CheckPyment = await sendPostRequest('http://uat.etrav.in/tradehost/TradeAPIService.svc/JSONService/GetBalance',{},{
        Auth_Header: authHeaders(),
    })
    if(!CheckPyment)
    {
        return res.status(400)
        .json(
            new ApiResponse(400, {success:false , data:"Authfail"} , "Auth Fail")
        )
    }
    // console.log(CheckPyment)


    return res.status(200)
    .json(
        new ApiResponse(200 , {success:true , data:CheckPyment.data} , "Data Fetch SuccesFully")
    )
})

//Add bus balance
const AddBusPayment = AsnycHandler(async(req,res)=>{
    // "ClientRefNo":"Testing Team",
    // "RefNo": "FBB64ZDT",
    // "TransactionType":0,
    // "ProductId": "2"
    const {ClientRefNo,RefNo,TransactionType,ProductId} = req.body;
    if(isNull([ClientRefNo , RefNo , TransactionType , ProductId]))
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false , data:"Please Enter All field"})

        )
    }

    const AddPayment = await sendPostRequest('http://uat.etrav.in/tradehost/TradeAPIService.svc/JSONService/AddPayment' ,{} ,{
        Auth_Header: authHeaders(),
        ClientRefNo,
        RefNo,
        TransactionType,
        ProductId
    })

    if(!AddPayment)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false , data:"Something went wrong"} ,"Something Went wrong")
        )
    }
    return res.status(200)
    .json(
        new ApiResponse(200 , {success:true , data:AddPayment} , "Payment Add successfully")
    )
    
})


//Add flight balance
const AddFlghtPayment = AsnycHandler(async(req,res)=>{
    const { ClientRefNo, RefNo,TransactionType,ProductId} = req.body;
    if(isNull([ClientRefNo , RefNo , TransactionType , ProductId]))
    {
        return res.status(400)
        .json(
            new ApiResponse(400 ,{success:false , data:"Please Enter All field Complsry"} , "Please Add All field complsry")
        )
    }

    const AddPayment = await sendPostRequest(`${process.env.ETRAV_BASEURL}/tradehost/TradeAPIService.svc/JSONService/AddPayment` , {},{
        Auth_Header: authHeaders(),
        ClientRefNo,
        RefNo,
        TransactionType,
        ProductId
    } )
    if(!AddPayment)
    {
        return res.status(500)
        .json(
            new ApiResponse(500 ,{success:false , data:"Something profile while adding payment"})
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200 ,{success:true ,data:AddPayment} , "Payment Add successfully")
    )
})

export {GetBalance}