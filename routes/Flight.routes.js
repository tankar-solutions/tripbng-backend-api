import {GetAllBestFlight , 
        SearchAirLine,
        GetAirlinePolicy,
        GetFlightSeat,
        GetFlightSSR,
        FlightBooking
} from "../controllers/Flight/flight.controller.js"

import { Router } from "express"

const router = Router();

router.route('/getFlights').post(GetAllBestFlight)
router.route('/GetAirPolicy').post(GetAirlinePolicy)
router.route('/SearchAirLine').get(SearchAirLine)
router.route('/seatmap').post(GetFlightSeat)
router.route('/getflightssr').post(GetFlightSSR)
router.route('/flightbooking').post(FlightBooking)
const Flight = router
export {Flight};