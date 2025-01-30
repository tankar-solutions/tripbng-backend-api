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

export default mongoose.model('EmailVerification', emailVerificationSchema);
