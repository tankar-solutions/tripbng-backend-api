/** @format */
import mongoose from 'mongoose';

const airlineCodeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		iata_code: {
			type: String,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('AirlineCodes', airlineCodeSchema);
