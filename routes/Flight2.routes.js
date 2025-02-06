import {GetAllBestFlight , 
    SearchAirLine,
    GetAirlinePolicy
} from "../controllers/Flight/Flight.controller.js"

import { Router } from "express"

const router = Router();

router.route('/getFlights').post(GetAllBestFlight)
router.route('/GetAirPolicy').post(GetAirlinePolicy)
router.route('/SearchAirLine').get(SearchAirLine)

const Flight2 = router
export {Flight2};