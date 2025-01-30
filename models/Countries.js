/** @format */

import mongoose from 'mongoose';

const countriesSchema = new mongoose.Schema(
	{
		countryname: { type: String },
		name: { type: String },
		dial_code: { type: String },
		countryid: { type: String },
		code: { type: String },
		isocode: { type: String },
	},
	{ timestamps: true }
);

export default mongoose.model('Countries', countriesSchema);
