/** @format */

import express from 'express';
import DMCController from '../controllers/dmc.controller.js';
import {createPackages} from "../controllers/Holiday/holiday.controller.js"
const router = express.Router();

router.route('/login').post(DMCController.loginDMC);
router.route('/verify').post(DMCController.verifyOTP);

router.route('/email/send').post(DMCController.sendVerificationEmail);
router.route('/email/verify').post(DMCController.verifyEmail);
router.route('/signup').post(DMCController.registerDMC);

router.route('/packages').get(DMCController.getPackages);
router.route('/package').post(DMCController.createPackage);
router
	.route('/package/:id')
	.get(DMCController.getPackageById)
	.patch(DMCController.updatePackage);


//This Rotuter is for the user user is also create a package this package is send in the mail to DMC's for the create this packages

router.route('/createuserpackage').post(createPackages)


export default router;
