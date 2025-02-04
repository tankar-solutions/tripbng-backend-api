import { ApiResponse } from "../../utils/ApiResponse.js"
import { generateOTP } from "../../utils/generateOtp.js"
import { sendMail } from "../../utils/sendMail.js"
import { AsnycHandler } from "../../utils/AsnycHandler.js"
import { OtpVfy } from "../../models/Agent/OtpVfy.models.js"
import { isNull } from "../../utils/FormCheck.js"
import { Agent } from "../../models/Agent/Agent.models.js"
import { sendSMS } from "../../utils/SMS.js"

//This controller Send User To Otp for a email veryfication
const SendMail = AsnycHandler(async (req, res) => {
    const Mail = req.body;

    if (!Mail) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter The Email")
            )
    }

    const otp = generateOTP();
    await sendMail(Mail,"Your Validation otp", `Your Otp is ${otp}`);

    const EmailVrf = await OtpVfy.create({
        veryficationType: 'email',
        veryficationFeild: Mail,
        otp: otp
    })

    if (!EmailVrf) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Something went wrong while proceesing the DataBase")
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, { success: true }, "Otp Send SuccessFully")
        )

})
//This controller Send user to otp on the sms
const sendSMSOTP = AsnycHandler(async (req, res) => {
    const { phone } = req.body;
    

    if (!phone) {
        return res.status(400)
            .json(400, { success: false }, "Please Enter The Phone Number")
    }
    
    const otp = generateOTP()
    const SMS = await sendSMS(`your otp is ${otp}` , phone);
    if(!SMS)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false} , "Something Went Wrong while sending OTP message")
        )
    }
   

    const setDataBase = await OtpVfy.create({
        veryficationType: 'phone',
        veryficationFeild: phone,
        otp: otp
    })
    res.status(200).json(
        new ApiResponse(200, { success: true }, "Otp Sent SuccessFully")
    );

})
//this controller The veryfie the otp which is send to the user 
const CheckOtp = AsnycHandler(async (req, res) => {
    const { type, filed, otp } = req.body;
    if (isNull[type, filed, otp]) {
        return res.status(400)
            .json(400, { success: false }, "Please Enter the All Filed ")
    }

    console.log(type, filed, otp)

    const isVerificationExist = await OtpVfy.findOne({
        veryficationType: type,
        veryficationFeild: filed,
        otp: otp
    });
    console.log(isVerificationExist)


    if (!isVerificationExist) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter Valid Otp")
            )
    }


    return res.status(200)
        .json(
            new ApiResponse(200, { success: true }, "Otp is Valid")
        )

})

const Register = AsnycHandler(async(req ,res)=>{
    const {agentType,agencyName,mobile,email,country,state,city,pincode,address1,address2,address3,adharNumber,gstNumber} = req.body;

    if(isNull([agencyName , agentType , mobile , email  , country , state , city , pincode , address1 , address2 , address3 , adharNumber , gstNumber]))
    {
        return res.status(400)
        .json(new ApiResponse(400,{success:false} , "Please Enter All The feilds"))
    }

    const agn = await Agent.create(
        {
            agencyName ,
            agentType ,
            mobile,
            email,
            country,
            state,
            city,
            pincode,
            address1,
            address2,
            address3,
            adharNumber,
            gstNumber
        }
    )

    if(!agn)
    {
        return res.status(400)
        .jaon(
            new ApiResponse(400,{success:false} , "Something Went Wrong While saving details Please try again")
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200,{success:true,data:agn} , "Your Request is sent to Admin We inform All the updates through SMS/email/whatsapp")
    )



})

// const Login = AsnycHandler(async(req,res)=>
// {

// })
export {
    SendMail,
    sendSMS,
    CheckOtp,
    Register
}