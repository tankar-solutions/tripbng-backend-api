import {SearchBus,
    BusSeatMap,
    TempBooking
} from "../controllers/Bus/Bus.controller.js"
import { Router } from "express"

const router = Router();

router.route('/searchbus').post(SearchBus)
router.route('/seatmap').post(BusSeatMap)
router.route('/tempbooking').post(TempBooking)
const BusRoutes = router;

export {BusRoutes}