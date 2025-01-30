/** @format */
import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
	{
		dmc: { type: mongoose.Schema.Types.ObjectId, ref: 'DMC' },
		name: {
			type: String,
		},
		destination: {
			type: String,
		},
		nights: {
			type: Number,
		},
		days: {
			type: Number,
		},
		currency: {
			type: String,
		},
		theme: { type: [String] },
		isFixDeparture: { type: Boolean, default: false },
		cities: [
			{
				orderNumber: { type: String },
				city: { type: String },
				nights: { type: Number },
				days: { type: Number },
			},
		],
		inclusion: [
			{
				city: { type: String },
				inclusion: {
					hotels: [
						{
							hotel: { type: String },
							nights: { type: Number },
							stars: { type: Number },
							mealPlan: { type: Number },
							category: { type: String },
							description: { type: String },
						},
					],
					activities: [
						{
							activity: { type: String },
							description: { type: String },
						},
					],
					transfers: [
						{
							transfer: { type: String },
							description: { type: String },
						},
					],
					others: [
						{
							other: { type: String },
							description: { type: String },
						},
					],
				},
			},
		],
		commonInclusion: [
			{
				inclusion: { type: String },
			},
		],
		exclusions: [{ exclusion: { type: String } }],
		itinerary: [
			{
				dayNumber: { type: Number },
				highlight: { type: String },
				dayItinerary: { type: String },
			},
		],
		flights: [
			{
				tripType: { type: String },
				airline: { type: String },
				cabinBaggage: { type: String },
				checkinBaggage: { type: String },
				departureCity: { type: String },
				departureDate: { type: String },
				departureTime: { type: String },
				arrivalCity: { type: String },
				arrivalDate: { type: String },
				arrivalTime: { type: String },
				remark: { type: String },
			},
		],
		coverImages: { type: [String] },
		activityImages: { type: [String] },
		specialNotes: [{ note: { type: String } }],
		pricing: [
			{
				date: { type: Date },
				fromPax: { type: String },
				toPax: { type: String },
				singleSharing: { type: String },
				doubleSharing: { type: String },
				tripleSharing: { type: String },
				childWithBed: { type: String },
				childWithoutBed: { type: String },
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model('Package', packageSchema);
