/** @format */
import mongoose from 'mongoose';

const dmcSchema = new mongoose.Schema(
	{
		companyType: {
			type: String,
			enum: ['Proprietor', 'Partner', 'Company / LLP'],
		},
		name: {
			type: String,
		},
		email: {
			type: String,
		},
		mobile: {
			type: String,
		},
		code: {
			type: String,
		},
		address: {
			type: String,
		},
		city: { type: String },
		state: { type: String },
		country: { type: String },
		pincode: { type: Number },
		pan: { type: String },
		gst: { type: String },
		remarks: { type: String },
		isAccepted: { type: Boolean, default: false },
		adminApproved: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export default mongoose.model('DMC', dmcSchema);
