/** @format */
import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
		amount: { type: Number },
		email: { type: String },
		phone: { type: String },
		refNo: { type: String },
		type: { type: String },
	},
	{ timestamps: true }
);

export default mongoose.model('Payment', PaymentSchema);
