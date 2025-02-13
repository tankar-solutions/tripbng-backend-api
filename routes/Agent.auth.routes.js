import {
    SendMail,
    SendSmsOtp,
    CheckOtp,
    Register,
    Login,
    LoginVrfy,
} from "../controllers/Agent/agent.auth.controller.js"
import { GetAgentProfile,
    GetAgentUrl} from "../controllers/Agent/agent.db.controller.js"
import {UserVerify} from "../middlewares/Uservrfy.js"
import { Router } from "express"


const router = Router();

router.route('/sendSMS').post(SendSmsOtp);
router.route('/sendmail').post(SendMail)
router.route('/checkotp').post(CheckOtp);
router.route('/register').post(Register);
router.route('/login').post(Login);
router.route('/loginVrfy').post(LoginVrfy)
router.route('/getagentprofile/:id').get(UserVerify,GetAgentUrl)    

const AgentRoutes = router;
export default AgentRoutes
