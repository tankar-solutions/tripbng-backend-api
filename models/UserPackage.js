import mongoose from "mongoose";
import DMC from "./DMC.js"
import { sendMail } from "../../utils/sendMail.js"


const userPackageSchema = new mongoose.Schema({

    username: {
        type: String
    },
    Usertype: {
        type: String
    },
    destination: {
        type: String,
        required: true
    },
    nights: {
        type: String
    },
    days: {
        type: String
    },
    hotel_type: {
        type: String

    },
    discription: {
        type: String
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    }


}, { timestamps: true })


userPackageSchema.models.info = async (subject, context) => {
    const AllDmcMember = await DMC.find({}).select("email mobile -_id")
    for (let i = 0; i < AllDmcMember.length; i++) {
        await sendMail(AllDmcMember[i].email, subject, context)
    }
    return "done"
}


export const userPackage = mongoose.model("userPackage", userPackageSchema);