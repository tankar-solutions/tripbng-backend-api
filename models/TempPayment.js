/** @format */
import mongoose from 'mongoose';

const tempPaymentSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
		amount: { type: Number },
		email: { type: String },
		phone: { type: String },
		category: { type: String },
		refNo: { type: String },
		type: { type: String },
		bookingId: { type: String },
	},
	{ timestamps: true }
);

export default mongoose.model('TempPayment', tempPaymentSchema);
