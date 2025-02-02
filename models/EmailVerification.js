/** @format */
import mongoose from 'mongoose';

const emailVerificationSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		code: {
			type: String,
		},
	},
	{ timestamps: true }
);

export const EmailVerification =  mongoose.model('EmailVerification', emailVerificationSchema);
