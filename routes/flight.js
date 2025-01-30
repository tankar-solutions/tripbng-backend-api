/** @format */

import express from 'express';
import FlightController from '../controllers/flightController.js';

const router = express.Router();

router.route('/searchAirport').get(FlightController.searchAirport);
router.route('/searchFlight').post(FlightController.searchFlight);
router.route('/searchAirlines').get(FlightController.searchAirlines);
router.route('/airlinePolicy').post(FlightController.getAirlinePolicy);
router.route('/reprice').post(FlightController.getFlightReprice);
router.route('/ssr').post(FlightController.getFlightSSR);
router.route('/seats').post(FlightController.getFlightSeats);
router.route('/tempBooking').post(FlightController.tempBooking);
router.route('/addPayment').post(FlightController.addPayment);
router.route('/ticketingStatus').post(FlightController.ticketingStatus);
router.route('/reprintPNR').post(FlightController.reprintPNR);
router.route('/cancel').post(FlightController.cancelFlight);

export default router;
