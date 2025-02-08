import express from 'express';
import  {
    LoginAdmin,
    CreateSubAdmin,
    CreateSuperAdmin,
    ChangePassword,
    AdminLogout,
    ChangeForgetPassword,
    ForgetPassword,
    veryfyOTPLogin,
    GetAllUser,
    GiveAgentAprove
} from '../controllers/admin.controller.js'; 
import {UserVerify} from "../middlewares/Uservrfy.js"

const router = express.Router();

router.route('/testCreate').post(CreateSuperAdmin)
router.route('/login').post(LoginAdmin)
router.route('/vfyOTPLogin').post(veryfyOTPLogin)
router.route('/createSubAdmin').post(UserVerify , CreateSubAdmin)
router.route('/changePass').post(UserVerify , ChangePassword)
router.route('/forgetPass').post(UserVerify ,ForgetPassword)
router.route('/ChangeForgetPass').post(UserVerify ,ChangeForgetPassword)
router.route('/getalluser').get(UserVerify ,GetAllUser)
router.route('/logout').post(UserVerify , AdminLogout)
router.route('/Aprove').post(UserVerify,GiveAgentAprove)
router.route('/getagenturl/:id').get()
export default router;