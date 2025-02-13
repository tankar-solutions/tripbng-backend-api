import {
     SearchHotelUsingCityName,
     GetHotelDetails,
     SearchHotelName
     } from "../controllers/Hotel/hotel.controller.js";
import { Router } from "express";

const router = Router();

router.route('/searchhotelcityname').get(SearchHotelUsingCityName)
router.route('/gethoteldetails').post(GetHotelDetails)
router.route('/searchhotelname').get(SearchHotelName)
const HotelRoutes = router;

export {HotelRoutes};