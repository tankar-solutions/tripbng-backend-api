/** @format */
import { errorMessage, successMessage } from '../middlewares/util.js';
import Payment from '../models/Payment.js';
import TempPayment from '../models/TempPayment.js';
import Users from '../models/Users.js';
import PayU from 'payu-sdk-node-index-fixed';
import dotenv from 'dotenv';
import Visa from '../models/Visa.js';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '../middlewares/s3Client.js';
import Countries from '../models/Countries.js';
dotenv.config();

const getProfile = async (req, res) => {
	try {
		const data = await Users.findById(req.user);

		return res.status(200).json(successMessage('Fetched Successfuly!', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const updateProfile = async (req, res) => {
	try {
		await Users.findByIdAndUpdate(req.user, req.body);

		return res.status(200).json(successMessage('Updated Successfuly!'));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const payUPayment = async (req, res) => {
	try {
		const payu = PayU({
			key: process.env.PAYU_KEY,
			salt: process.env.PAYU_SALT,
		});

		const { amount, name, email, phone, category } = req.body;

		req.body.user = req.user;
		const payTxn = await TempPayment.create(req.body);

		const hash = payu.hasher.generateHash({
			txnid: payTxn._id.toString(),
			amount: amount.toString(),
			productinfo: category === 'flight' ? 'flight ticket' : 'visa',
			firstname: name,
			email: email,
		});

		var data = {
			key: process.env.PAYU_KEY,
			txnid: payTxn._id.toString(),
			amount: amount.toString(),
			firstname: name,
			email: email,
			phone: phone,
			productinfo: category === 'flight' ? 'flight ticket' : 'visa',
			surl: `${process.env.BackendUrl}/orders/success?txnid=${payTxn._id}`,
			furl: `${process.env.FrontendUrl}`,
			hash: hash,
		};

		return res.status(200).json(successMessage('Created Successfuly!', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const payUsuccess = async (req, res) => {
	try {
		var paytxn = await TempPayment.findById(req.query.txnid);
		if (!paytxn) {
			return res.redirect(`${process.env.FrontendUrl}`);
		}

		await Payment.create({ ...paytxn });

		if (paytxn?.category === 'visa') {
			await Visa.findByIdAndUpdate(paytxn?.bookingId, {
				$set: { status: 'Paid' },
			});
		}

		return res.redirect(`${process.env.FrontendUrl}`);
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const AllCountries = async (req, res) => {
	try {
		const data = await Countries.find();
		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const UserVisaBookings = async (req, res) => {
	try {
		const data = await Visa.find({ user: req.user });
		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const VisaBookingById = async (req, res) => {
	try {
		const data = await Visa.findById(req.params.id);
		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const UploadVisaFile = async (req, res) => {
	try {
		if (req.file) {
			const uploadParams = {
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				Key: `user/visa/${Date.now()}-${req.file.originalname}`,
				Body: req.file.buffer,
			};

			await s3Client.send(new PutObjectCommand(uploadParams));
			const unsignedUrl = `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`;

			return res
				.status(200)
				.json(successMessage('Upload Successfully', { data: unsignedUrl }));
		} else {
			return res.status(400).json(errorMessage('File is mising.'));
		}
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const getPreSignedUrl = async (req, res) => {
	try {
		const { unsignedUrl } = req.body;

		const bucketName = unsignedUrl
			.split('.s3.amazonaws.com/')[0]
			.split('https://')[1];
		const objectKey = unsignedUrl.split('.s3.amazonaws.com/')[1];

		if (!unsignedUrl || !bucketName || !objectKey) {
			return res.status(400).send('Invalid unsigned URL');
		}

		const getObjectCommand = new GetObjectCommand({
			Bucket: bucketName,
			Key: objectKey,
		});
		const getObjUrl = await getSignedUrl(s3Client, getObjectCommand);
		return res.send({ publicUrl: getObjUrl });
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const visaBooking = async (req, res) => {
	try {
		req.body.user = req.user;
		const data = await Visa.create(req.body);
		return res.status(200).json(successMessage('Saved Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const UpdateVisaBooking = async (req, res) => {
	try {
		const data = await Visa.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		return res.status(200).json(successMessage('Updated Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const DeleteVisaBooking = async (req, res) => {
	try {
		await Visa.findByIdAndDelete(req.params.id);
		return res.status(200).json(successMessage('Deleted Successfully'));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

export default {
	getProfile,
	updateProfile,
	payUPayment,
	payUsuccess,
	AllCountries,
	visaBooking,
	UserVisaBookings,
	VisaBookingById,
	UpdateVisaBooking,
	DeleteVisaBooking,
	UploadVisaFile,
	getPreSignedUrl,
};
