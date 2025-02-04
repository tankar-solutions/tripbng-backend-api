import {
    SendMail,
    sendSMS,
    CheckOtp,
    Register
} from "../controllers/Agent/Agent.auth.controller.js"
import { Router } from "express"

const router = Router();

router.route('/sendSMS').post(sendSMS);
router.route('/CheckOtp').post(CheckOtp);
router.route('/Register').post(Register)

const AgentRoutes = router;
export default AgentRoutes