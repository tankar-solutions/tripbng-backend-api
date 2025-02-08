/** @format */

import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import UserController from '../controllers/user.controller.js';
import { auth } from '../middlewares/auth.js';
import multer from 'multer';

const storage = multer.memoryStorage({
	destination(req, file, callback) {
		callback(null, '');
	},
});

const uploadMedia = multer({ storage });

const router = express.Router();

router.route('/login').post(AuthController.login);
router.route('/verify').post(AuthController.verifyOTP);
router.route('/resend').post(AuthController.resendOTP);
router.route('/socialLogin').post(AuthController.socialLogin);

router.route('/presignedurl').post(UserController.getPreSignedUrl);

router
	.route('/profile')
	.get(auth, UserController.getProfile)
	.patch(auth, UserController.updateProfile);

router.route('/countries/all').get(UserController.AllCountries);
router.route('/visa/all').get(auth, UserController.UserVisaBookings);
router.route('/visa/save').post(auth, UserController.visaBooking);
router
	.route('/visa/upload')
	.post(auth, uploadMedia.single('file'), UserController.UploadVisaFile);
router
	.route('/visa/:id')
	.get(auth, UserController.VisaBookingById)
	.patch(auth, UserController.UpdateVisaBooking)
	.delete(auth, UserController.DeleteVisaBooking);

router.route('/makePayment').post(auth, UserController.payUPayment);

export default router;
