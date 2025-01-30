/** @format */
import mongoose from 'mongoose';

const visaSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
		destination: { type: String },
		visaType: { type: String },
		date: { type: String },
		lengthOfStay: { type: String },
		validity: { type: String },
		entry: { type: String },
		status: { type: String, default: 'Pending' },
		paxType: {
			adult: { type: String },
			child: { type: String },
			infant: { type: String },
		},
		travellersDetail: [
			{
				traveller: { type: String },
				paxType: { type: String },
				firstName: { type: String },
				lastName: { type: String },
				fatherName: { type: String },
				motherName: { type: String },
				gender: { type: String },
				dob: { type: String },
				maritalStatus: { type: String },
				passportIssueDate: { type: String },
				passportNumber: { type: String },
				passportValidTill: { type: String },
				photo: { type: String },
				passportfrontPage: { type: String },
				passportLastPage: { type: String },
				returnTicket: { type: String },
				hotelVoucher: { type: String },
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model('Visa', visaSchema);
