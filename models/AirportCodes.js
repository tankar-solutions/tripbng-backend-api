/** @format */
import mongoose from 'mongoose';

const airportCodeSchema = new mongoose.Schema(
	{
		type: {
			type: String,
		},
		name: {
			type: String,
		},
		elevation_ft: {
			type: Number,
		},
		continent: {
			type: String,
		},
		iso_country: {
			type: String,
		},
		iso_region: {
			type: String,
		},
		municipality: {
			type: String,
		},
		gps_code: {
			type: String,
		},
		iata_code: {
			type: String,
		},
		local_code: {
			type: String,
		},
		coordinates: {
			type: {
				type: String,
				enum: ['Point'],
				default: 'Point',
			},
			coordinates: {
				type: [Number], // [longitude, latitude]
				required: true,
			},
		},
	},
	{ timestamps: true }
);

// 2dsphere index for geospatial queries
airportCodeSchema.index({ coordinates: '2dsphere' });

export default mongoose.model('AirportCodes', airportCodeSchema);
