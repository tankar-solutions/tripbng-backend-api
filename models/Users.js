/** @format */
import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema(
	{
		profile: {
			type: String,
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
		DOB: { type: String },
		gender: { type: String },
		maritalStatus: { type: String },
		code: {
			type: String,
		},
		provider: {
			type: String,
		},
		address: { type: String },
		state: { type: String },
		pincode: { type: String },
	},
	{ timestamps: true }
);

export default mongoose.model('Users', usersSchema);
