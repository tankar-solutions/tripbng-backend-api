/** @format */

import express from 'express';
import DMCController from '../controllers/dmcController.js';

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

export default router;
