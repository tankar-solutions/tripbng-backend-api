/** @format */

import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import { errorMessage, successMessage } from '../middlewares/util.js';
import { generateOTP } from "../../utils/generateOtp.js"
import { sendSMS } from "../../utils/SMS.js"
import {OtpVfy} from "../../models/Agent_Cp/OtpVfy.models.js"
import { ApiResponse } from '../utils/ApiResponse.js';


const login = async (req, res) => {
	try {
		const { mobile } = req.body;

		if (!mobile) {
			return res
				.status(400)
				.json(errorMessage('Please enter the valid mobile.'));
		}

		let user = await User.findOne({ mobile: mobile });

		if (!user) {
			user = await User.create({ mobile: mobile });
		}

		const otp = generateOTP();
		await sendSMS(`opt is ${otp}` , mobile)


		// const number = `91${mobile}`;

		// await axios.post(
		// 	`https://control.msg91.com/api/v5/otp?template_id=64f0546cd6fc0564cc6ff353&mobile=${number}`,
		// 	{},
		// 	{
		// 		headers: {
		// 			accept: 'application/json',
		// 			'Content-Type': 'application/json',
		// 			authkey: process.env.MSG_AUTH_KEY,
		// 		},
		// 	}
		// );
		const object = await OtpVfy.create({
			veryficationType:"login",
			veryficationFeild:mobile,
			otp:otp
		})
		if(!object)
		{
			return res.status(400)
			.json(errorMessage("something wrong while creating login"))
		}


		return res.status(200).json(successMessage('OTP Sent Successfully'));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const verifyOTP = async (req, res) => {
	try {
		const { mobile, otp } = req.body;

		if (!mobile) {
			return res
				.status(400)
				.json(errorMessage('Please enter the valid number.'));
		}

		let user = await User.findOne({ mobile: mobile });

		if (!user) {
			return res
				.status(400)
				.json(errorMessage('No account exists with this number.'));
		}

		  const isVerificationExist = await OtpVfy.findOne({
				veryficationType: 'login',
				veryficationfield: mobile,
				otp: otp
			});
			if(!isVerificationExist)
			{
				return res.status(400)
				.json(
					new ApiResponse(400 , {success:false , data:"Please Enter Correct otp"} , "Please Enter Correct otp")
				)
			}
		

		// const number = `91${mobile}`;

		// const result = await axios.get(
		// 	`https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${number}`,
		// 	{
		// 		headers: {
		// 			authkey: process.env.MSG_AUTH_KEY,
		// 		},
		// 	}
		// );

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
		return res
			.status(200)
			.json(successMessage('OTP Verified', { token, user }));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const resendOTP = async (req, res) => {
	try {
		const { mobile } = req.body;

		if (!mobile) {
			return res
				.status(400)
				.json(errorMessage('Please enter the valid number.'));
		}

		// const number = `91${mobile}`;

		// const result = await axios.get(
		// 	`https://control.msg91.com/api/v5/otp/retry?retrytype=text&authkey=${process.env.MSG_AUTH_KEY}&mobile=${number}`,
		// 	{
		// 		headers: {
		// 			authkey: process.env.MSG_AUTH_KEY,
		// 		},
		// 	}
		// );

		return res.status(200).json(successMessage('OTP Sent Successfully'));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const socialLogin = async (req, res) => {
	try {
		const { email, name, provider } = req.body;

		if (!provider) {
			return res.status(400).json(errorMessage('Provider is missing.'));
		}
		if (!email || !name) {
			return res.status(400).json(errorMessage('Email & Name is missing.'));
		}

		let user = await User.findOne({ email: email, provider: provider });

		if (!user) {
			user = await User.create({
				email: email,
				name: name,
				provider: provider,
			});
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
		return res
			.status(200)
			.json(successMessage('Login Successfully', { token, user }));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

export default {
	login,
	verifyOTP,
	resendOTP,
	socialLogin,
};
