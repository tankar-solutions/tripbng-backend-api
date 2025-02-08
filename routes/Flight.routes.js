import {GetAllBestFlight , 
        SearchAirLine,
        GetAirlinePolicy,
        GetFlightSeat
} from "../controllers/Flight/flight.controller.js"

import { Router } from "express"

const router = Router();

router.route('/getFlights').post(GetAllBestFlight)
router.route('/GetAirPolicy').post(GetAirlinePolicy)
router.route('/SearchAirLine').get(SearchAirLine)
router.route('/seatmap').post(GetFlightSeat)

const Flight = router
export {Flight};