//All About The Admin Controller
import { AsnycHandler } from "../utils/AsnycHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Admin } from "../models/Admin.js";
import { SubAdmin } from "../models/SubAdmin.models.js";
import { isNull } from "../utils/FormCheck.js";
import { generateOTP } from "../utils/generateOtp.js"
import { sendOTP } from "../utils/sendMail.js"
import { EmailVerification } from "../models/EmailVerification.js";

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
                new ApiResponse(400, { success: false }, "Please Enter The userId")
            )
    }

    if (!password) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter the password")
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
    await sendOTP(user.email, otp)

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
    console.log("code arrive here 1")
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
    await sendOTP(user.email, code);
    await EmailVerification.create({
        email:user.email,
        code:code
    })
    return res.status(200)
        .json(new ApiResponse(200, { success: true }, "veryfication otp is sent on your register email"))

})


const ChangeForgetPassword = AsnycHandler(async (req, res) => {
    const {code , newPassord } = req.body;
    if (!code) {
        return res.status(400).json(new ApiResponse(400, { success: false }, "OTP is required"))
    }
    if (!newPassord) {
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
    ChangePassUser.password = newPassord;
    await  ChangePassUser.save();
    

    return res.status(200)
        .json(
            new ApiResponse(200, { success: true }, "Your Password is SuccessFully Change")
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
    ChangeForgetPassword
}