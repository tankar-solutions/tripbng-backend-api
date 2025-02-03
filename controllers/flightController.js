/** @format */

import axios from 'axios';
import {
	errorMessage,
	successMessage,
	authHeaders,
} from '../middlewares/util.js';
import AirportCodes from '../models/AirportCodes.js';
import AirlineCodes from '../models/AirlineCodes.js';

const searchAirport = async (req, res) => {
	try {
		var data = [];
		var defaultData = await AirportCodes.find({
			iata_code: { $in: ['DEL', 'AMD'] },
		});

		const searchTerm = req.query.search;

		let iataResults = await AirportCodes.find({
			iata_code: { $regex: searchTerm, $options: 'i' },
		}).limit(15);

		let remainingLimit = 15 - iataResults.length;

		let municipalityResults = [];
		if (remainingLimit > 0) {
			municipalityResults = await AirportCodes.find({
				municipality: { $regex: searchTerm, $options: 'i' },
				iata_code: { $nin: iataResults.map((res) => res.iata_code) },
			}).limit(remainingLimit);
		}

		remainingLimit -= municipalityResults.length;

		let nameResults = [];
		if (remainingLimit > 0) {
			nameResults = await AirportCodes.find({
				name: { $regex: searchTerm, $options: 'i' },
				iata_code: { $nin: iataResults.map((res) => res.iata_code) },
				municipality: {
					$nin: municipalityResults.map((res) => res.municipality),
				},
			}).limit(remainingLimit);
		}

		if (req.query.search === '') {
			data = [
				...defaultData,
				...iataResults,
				...municipalityResults,
				...nameResults,
			];
		} else {
			data = [...iataResults, ...municipalityResults, ...nameResults];
		}

		if (data.length > 0) {
			data = await Promise.all(
				data.map(async (airport) => {
					const [longitude, latitude] = airport.coordinates.coordinates;

					// Find nearby airports within 200 km radius
					const nearbyAirports = await AirportCodes.aggregate([
						{
							$geoNear: {
								near: { type: 'Point', coordinates: [longitude, latitude] },
								distanceField: 'distance', // Distance will be calculated in meters
								spherical: true,
								maxDistance: 200 * 1000, // 200 km in meters
								distanceMultiplier: 1 / 1000, // Convert distance to kilometers
							},
						},
						{
							$match: {
								_id: { $ne: airport._id },
							},
						},
					]);

					return {
						...airport._doc,
						nearbyAirports: nearbyAirports,
					};
				})
			);
		}

		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const sortFlights = (flights, sortOption) => {
	const durationToMinutes = (duration) => {
		const [hours, minutes] = duration.split(':').map(Number);
		return hours * 60 + minutes;
	};

	const calculateTotalDuration = (segments) => {
		return segments.reduce((total, segment) => {
			return total + durationToMinutes(segment.Duration);
		}, 0);
	};

	// Sort each flight's Fares by Total_Amount
	flights.forEach((flight) => {
		flight.Fares.sort((a, b) => {
			const minFareA = Math.min(...a.FareDetails.map((f) => f.Total_Amount));
			const minFareB = Math.min(...b.FareDetails.map((f) => f.Total_Amount));

			if (sortOption.method === 'asc') {
				return minFareA - minFareB;
			} else {
				return minFareB - minFareA;
			}
		});
	});

	// Sort the Flights array based on the Fares inside each flight or Departure_DateTime
	if (sortOption.name === 'price') {
		flights.sort((a, b) => {
			// Get the minimum fare for each flight
			const minFareA = Math.min(
				...a.Fares.map((fare) =>
					Math.min(...fare.FareDetails.map((f) => f.Total_Amount))
				)
			);
			const minFareB = Math.min(
				...b.Fares.map((fare) =>
					Math.min(...fare.FareDetails.map((f) => f.Total_Amount))
				)
			);

			if (sortOption.method === 'asc') {
				return minFareA - minFareB;
			} else {
				return minFareB - minFareA;
			}
		});
	} else if (sortOption.name === 'departure') {
		flights.sort((a, b) => {
			const departureA = new Date(a.Segments[0].Departure_DateTime);
			const departureB = new Date(b.Segments[0].Departure_DateTime);

			if (sortOption.method === 'asc') {
				return departureA - departureB; // Ascending
			} else {
				return departureB - departureA; // Descending
			}
		});
	} else if (sortOption.name === 'fastest') {
		flights.sort((a, b) => {
			const durationA = calculateTotalDuration(a.Segments);
			const durationB = calculateTotalDuration(b.Segments);

			if (sortOption.method === 'asc') {
				return durationA - durationB;
			} else {
				return durationB - durationA;
			}
		});
	}

	return flights;
};

const searchFlight = async (req, res) => {
	try {
		const { data } = await axios.post(
			`${process.env.ETRAV_BASEURL}/airlinehost/AirAPIService.svc/JSONService/Air_Search`,
			{
				Auth_Header: authHeaders(),
				...req.body,
			}
		);

		const { min, max } = req.body.priceRange;
		const timeRanges = [
			{ start: 0, end: 6 }, // 0: 12am - 6am
			{ start: 6, end: 12 }, // 1: 6am - 12pm
			{ start: 12, end: 18 }, // 2: 12pm - 6pm
			{ start: 18, end: 24 }, // 3: 6pm - 12am
		];

		const { TripDetails } = data;

		if (TripDetails && TripDetails?.length > 0) {
			TripDetails.forEach((rev) => {
				rev.Flights = rev.Flights.filter((ele) => {
					// Check stops condition
					const validStops = req.body.stops.includes(ele.Segments?.length - 1);

					// Check price range condition
					const validPrice = ele.Fares.some((fare) =>
						fare.FareDetails.some(
							(fareDetail) =>
								fareDetail.Total_Amount >= min && fareDetail.Total_Amount <= max
						)
					);

					// Check departure time condition
					let validDepartureTime = true;
					if (
						req.body.departureFromOrigin !== null &&
						req.body.departureFromOrigin !== undefined
					) {
						const departureSegment = ele.Segments[0];
						const departureTime = new Date(
							departureSegment.Departure_DateTime
						).getHours();
						const selectedRange = timeRanges[req.body.departureFromOrigin];

						validDepartureTime =
							departureTime >= selectedRange.start &&
							departureTime < selectedRange.end;
					}

					// Check arrival time condition
					let validArrivalTime = true;
					if (
						req.body.arrivalAtDestination !== null &&
						req.body.arrivalAtDestination !== undefined
					) {
						const arrivalSegment = ele.Segments[ele.Segments.length - 1];
						const arrivalTime = new Date(
							arrivalSegment.Arrival_DateTime
						).getHours();
						const selectedArrivalRange =
							timeRanges[req.body.arrivalAtDestination];

						validArrivalTime =
							arrivalTime >= selectedArrivalRange.start &&
							arrivalTime < selectedArrivalRange.end;
					}

					return (
						validStops && validPrice && validDepartureTime && validArrivalTime
					);
				});
			});

			TripDetails.forEach((rev) => {
				// Sort the flights according to price
				rev.Flights = sortFlights(rev.Flights, req.body.sort);
			});
		}

		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const searchAirlines = async (req, res) => {
	try {
		const searchTerm = req.query.search;
		const query = searchTerm
			? {
					$or: [
						{ name: { $regex: searchTerm, $options: 'i' } },
						{ iata_code: { $regex: searchTerm, $options: 'i' } },
					],
			  }
			: {};

		const data = await AirlineCodes.find(query);

		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const getAirlinePolicy = async (req, res) => {
	try {
		const { data } = await axios.post(
			`${process.env.ETRAV_BASEURL}/airlinehost/AirAPIService.svc/JSONService/Air_FareRule`,
			{
				Auth_Header: authHeaders(),
				...req.body,
			}
		);

		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const getFlightReprice = async (req, res) => {
	try {
		const { data } = await axios.post(
			`${process.env.ETRAV_BASEURL}/airlinehost/AirAPIService.svc/JSONService/Air_Reprice`,
			{
				Auth_Header: authHeaders(),
				...req.body,
			}
		);

		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const getFlightSSR = async (req, res) => {
	try {
		const { data } = await axios.post(
			`${process.env.ETRAV_BASEURL}/airlinehost/AirAPIService.svc/JSONService/Air_GetSSR`,
			{
				Auth_Header: authHeaders(),
				...req.body,
			}
		);

		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const getFlightSeats = async (req, res) => {
	try {
		const { data } = await axios.post(
			`${process.env.ETRAV_BASEURL}/airlinehost/AirAPIService.svc/JSONService/Air_GetSeatMap`,
			{
				Auth_Header: authHeaders(),
				...req.body,
			}
		);

		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const tempBooking = async (req, res) => {
	try {
		const { data } = await axios.post(
			`${process.env.ETRAV_BASEURL}/airlinehost/AirAPIService.svc/JSONService/Air_TempBooking`,
			{
				Auth_Header: authHeaders(),
				...req.body,
			}
		);

		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const addPayment = async (req, res) => {
	try {
		const { data } = await axios.post(
			`${process.env.ETRAV_BASEURL}/tradehost/TradeAPIService.svc/JSONService/AddPayment`,
			{
				Auth_Header: authHeaders(),
				...req.body,
			}
		);

		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const ticketingStatus = async (req, res) => {
	try {
		const { data } = await axios.post(
			`${process.env.ETRAV_BASEURL}/airlinehost/AirAPIService.svc/JSONService/Air_Ticketing`,
			{
				Auth_Header: authHeaders(),
				...req.body,
			}
		);

		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const reprintPNR = async (req, res) => {
	try {
		const { data } = await axios.post(
			`${process.env.ETRAV_BASEURL}/airlinehost/AirAPIService.svc/JSONService/Air_Reprint`,
			{
				Auth_Header: authHeaders(),
				...req.body,
			}
		);

		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const cancelFlight = async (req, res) => {
	try {
		const { data } = await axios.post(
			`${process.env.ETRAV_BASEURL}/airlinehost/AirAPIService.svc/JSONService/Air_TicketCancellation`,
			{
				Auth_Header: authHeaders(),
				...req.body,
			}
		);

		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

export default {
	searchAirport,
	searchFlight,
	searchAirlines,
	getAirlinePolicy,
	getFlightReprice,
	getFlightSSR,
	getFlightSeats,
	tempBooking,
	addPayment,
	ticketingStatus,
	reprintPNR,
	cancelFlight,
};
