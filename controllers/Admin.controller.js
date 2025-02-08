//All About The Admin Controller
import { AsnycHandler } from "../utils/AsnycHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Admin } from "../models/Admin.js";
import { SubAdmin } from "../models/SubAdmin.models.js";
import { isNull } from "../utils/FormCheck.js";
import { generateOTP } from "../utils/generateOtp.js"
import { sendMail } from "../utils/sendMail.js"
import { EmailVerification } from "../models/EmailVerification.js";
import Users from "../models/Users.js";
import { Cp } from "../models/Agent_Cp/Cp.models.js";
import { Agent } from "../models/Agent_Cp/Agent.models.js";
const options = {
    httpOnly: true,
    secure: true
};

//Ignore This, This is for just Test
const CreateSuperAdmin = AsnycHandler(async (req, res) => {

    console.log("Yes Log Arrive Here")
    const { companyName, username, email, mobile, pincode, address, password } = req.body;
    console.log(companyName, username, email, mobile, pincode, address, password)
    const admin = await Admin.create(
        {
            companyName,
            username,
            email,
            mobile,
            pincode,
            address,
            password
        }
    )
    console.log(admin)
    return res.status(200)
        .json(
            new ApiResponse(200, { admin }, "Admin Create SuccessFully")
        )

})

const LoginAdmin = AsnycHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false , data:"Please Enter the username" }, "Please Enter The userId")
            )
    }

    if (!password) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false , data:"Please Enter The password" }, "Please Enter the password")
            )
    }

    const user = await Admin.findOne({ username })

    const isPasswordCorrect = await user.PassCompare(password);

    if (!isPasswordCorrect) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter Correct Password")
            )
    }



    const otp = generateOTP();
    await sendMail(user.email,"Validation otp", `your otp is ${otp}`)

    await EmailVerification.create({
        email: user.email,
        code: otp,
    })



    return res.status(200)
        .json(
            new ApiResponse(200, { sucess: true }, "Opt is Sent on your email")
        )


})

const veryfyOTPLogin = AsnycHandler(async (req, res) => {
    const { email, code } = req.body;

    const isOtpCorrect = await EmailVerification.findOne(
        {
            $and: [{ email, code }]
        }
    )
    if (!isOtpCorrect) {
        return res.status(400)
            .json(
                new ApiResponse(400, { sucess: false }, "Please Enter Correct OTP")
            )
    }

    const user = await Admin.findOne({ email })
    if (!user) {
        return res.status(400)
            .json(new ApiResponse(400, { status: false }, "Something went wrong while fetching account"))
    }
    const AccessTocken = user.GenrateAccessTocken();

    if (!AccessTocken) {
        return res.status(500)
            .json(
                new ApiResponse(500, { status: false }, "Something Went wrong while generating AccessTocken")
            )
    }
    const LoginUser = {
        username: user.username,
        cname: user.companyName,
        email: user.email,
        phoneNo: user.mobile
    }

    const delteEmail = await EmailVerification.findByIdAndDelete(isOtpCorrect._id)

    if (!delteEmail) {
        return res.status(400)
            .json(400, { success: false }, "something while wrong When check the otp")
    }


    return res.status(200)
        .cookie("AccessToken", AccessTocken, options)
        .json(
            new ApiResponse(200, { sucess: true, data: LoginUser }, "Otp is Correct")
        )
})

const CreateSubAdmin = AsnycHandler(async (req, res) => {
    const { username, email, password, domain } = req.body;

    if (isNull([username, email, password, domain])) {
        return res.status(400)
            .json(new ApiResponse(400, { success: false }, "Please Enter All Feilds"))
    }

    const isUserNameExist = await SubAdmin.findOne({ username });

    if (!isUserNameExist) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Choose Other Username This Username is already exist")
            )
    }

    if (!email.includes('@')) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter Correct Email")
            )
    }

    const CreateUser = await SubAdmin.create(
        {
            username,
            email,
            password,
            domain
        }
    )

    if (!CreateSubAdmin) {
        return res.status(500)
            .json(
                new ApiResponse(500, { sucess: false }, "something went Wrong While Creating Account")
            )
    }


    const user = {
        username,
        email,
        domain
    }


    return res.status(200)
        .json(
            new ApiResponse(200, { success: true, data: user }, `Created User for ${domain}`)
        )
})

const ChangePassword = AsnycHandler(async (req, res) => {
    const { CurrectPass, NewPass } = req.body;
    const user = req.user;

    const PassChangeuser = await Admin.findById(user._id)
    console.log(CurrectPass, NewPass)
    const isCurrentIsCorrect = await PassChangeuser.PassCompare(CurrectPass);
    console.log("Code arrave here 2")
    if (!isCurrentIsCorrect) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter Correct Current Password")
            )
    }

    if (CurrectPass === NewPass) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Your Currect And New Password is same")
            )
    }

    user.password = NewPass;
    console.log(user.password)
    await user.save()

    return res.status(200)
        .json(
            new ApiResponse(200, { sucess: true }, "password is change")
        )
})

const AdminLogout = AsnycHandler(async (req, res) => {
    const user = req.user;

    return res.status(200)
        .clearCookie("AccessToken", options)
        .json(new ApiResponse(200, { user }, "Logout Successfully"))
})

const ForgetPassword = AsnycHandler(async (req, res) => {
    const user = req.user;
    const code = generateOTP();
    await sendMail(user.email,"Validation otp", `your otp is ${code}`);
    await EmailVerification.create({
        email:user.email,
        code:code
    })
    return res.status(200)
        .json(new ApiResponse(200, { success: true }, "veryfication otp is sent on your register email"))

})


const ChangeForgetPassword = AsnycHandler(async (req, res) => {
    const {code , newPassword } = req.body;
    if (!code) {
        return res.status(400).json(new ApiResponse(400, { success: false }, "OTP is required"))
    }
    if (!newPassword) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter The password")
            )
    }


    const user = req.user;
    const otpRecord = await EmailVerification.findOne({ email: user.email, code: code });

    if (!otpRecord) {
        return res.status(400).json(new ApiResponse(400, { success: false }, "Invalid or expired OTP"));
    }


    if (!user) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Something problem while fetching Admin Details")
            )
    }


    const ChangePassUser = await Admin.findById(user._id)
    ChangePassUser.password = newPassword;
    await  ChangePassUser.save();
    

    return res.status(200)
        .json(
            new ApiResponse(200, { success: true }, "Your Password is SuccessFully Change")
        )


})


//Dashboard controller


const GetAllUser = AsnycHandler(async(req,res)=>{

    const AllUsers =  await Users.find({})
    res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:AllUsers} ,"Fetched All User")
    )

})

// const GetAllBookedFlights = AsnycHandler(async(req,res)=>{})

const GetAllAgents = AsnycHandler(async(req,res)=>{

    const UnAproveAgents = await Agent.find({aprove:false}) || null
    const AproveAgents = await Agent.find({aprove:true}) || null

    return res.status(200)
    .json(
        new ApiResponse(200 , {success:true , data:{
            UnAproveAgents,
            AproveAgents
        }} , "Data Fetch SuccessFully" )
    )

    
})

const GiveAgentAprove = AsnycHandler(async(req,res)=>{
    const {_id} = req.body;
    const user= req.user;

    if(user.Usertype != "Admin")
    {
        return res.status(400)
        .json(new ApiResponse(400 , {success:false , data:"You Can't Aprove This request , you are not Admin"}  , "you Can't Aprove This Request Your are not Admin" ))
    }
    if(!_id)
    {
        return res.status(400)
        .json(new ApiResponse(400 , {success:false} , "Id is not Geted"))
    }

    const AgentUser = await Agent.findById(_id)
    if(!AgentUser)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false} , "Id is wrong")
        )
    }

    AgentUser.aprove = true;
    await AgentUser.save()
    const otp = generateOTP();
    await sendMail(AgentUser.email , "Aprove Success" , "Congrts Admin Aprove Your Request")

    return res.status(200)
    .json(
        new ApiResponse(200 , {success:true} , "Give Aprove")
    )
    
})

const GetAllCp = AsnycHandler(async(req,res)=>{

    const UnAproveCp = await Cp.find({aprove:false}) || null
    const AproveCp= await Cp.find({aprove:true}) || null

    return res.status(200)
    .json(
        new ApiResponse(200 , {success:true , data:{
            UnAproveCp,
            AproveCp
        }} , "Data Fetch SuccessFully" )
    )

    
})

const GiveCpAprove = AsnycHandler(async(req,res)=>{
    const {_id} = req.body;
    const user= req.user;

    if(user.Usertype != "Admin")
    {
        return res.status(400)
        .json(new ApiResponse(400 , {success:false , data:"You Can't Aprove This request , you are not Admin"}  , "you Can't Aprove This Request Your are not Admin" ))
    }
    if(!_id)
    {
        return res.status(400)
        .json(new ApiResponse(400 , {success:false} , "Id is not Geted"))
    }

    const CpUser = await Agent.findById(_id)
    if(!CpUser)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false} , "Id is wrong")
        )
    }

    CpUser.aprove = true;
    await CpUser.save()
    await sendMail(CpUser.email , "Aprove Success" , "Congrts Admin Aprove Your Request")

    return res.status(200)
    .json(
        new ApiResponse(200 , {success:true} , "Congrts Your Request Aprove From the Admin")
    )
    
})



export {
    CreateSuperAdmin,
    LoginAdmin,
    CreateSubAdmin,
    ChangePassword,
    AdminLogout,
    veryfyOTPLogin,
    ForgetPassword,
    ChangeForgetPassword,
    GetAllUser,
    GetAllAgents,
    GiveAgentAprove,
    GetAllCp,
    GiveCpAprove
}