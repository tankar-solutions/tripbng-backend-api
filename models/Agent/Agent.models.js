import mongoose from "mongoose";
import { generateOTP } from "../../utils/generateOtp.js"
import { sendMail } from "../../utils/sendMail.js"
import { sendSMS } from "../../utils/SMS.js";

const AgentSchema = mongoose.Schema({

    agentType:{
        type:String,
        enum:['become a retailer' , 'become a distributor']
    },
    agencyName:{
        type:String,
        required:true,
        uniqe:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    PanCardDetails :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PanCard",
        // required:true
    },
    country:{
        type:String,
        required:true

    },
    state:{
        type:String,
        required:true

    },
    city:{
        type:String,
        required:true
        
    },
    pincode:{
        type:String,
        required:true

    },
    address1:{
        type:String,
        required:true
    },
    address2:{
        type:String
    },
    address3:{
        type:String
    },
    adharNumber:{
        type:String,
        required:true
    },
    gstNumber:{
        type:String
    },
    aprove:{
        type:Boolean,
        default:false,
        
    }


},{ timestamps: true })

AgentSchema.post("save" ,async function()
{
    const AgencyUrl = 'something.com';
    const message = `Agency name ${this.agencyName} is Request to Aprove Thire request click on this link ${AgencyUrl}`;

    const otp = generateOTP();
    await sendMail(this.email , "Aprove request" , message);
    await sendSMS(message , this.mobile);
})

export const Agent = mongoose.model('Agent' , AgentSchema)