/** @format */

import { errorMessage } from './util.js';
import jwt from 'jsonwebtoken';
// import Admin from '../models/admin';
import Users from '../models/Users.js';

export const auth = async (req, res, next) => {
	try {
		const header = req.headers['authorization'];
		const token = header.split(' ')[1];

		if (!token) {
			return res.status(400).json(errorMessage('Token not present!'));
		}

		const userid = jwt.verify(token, process.env.JWT_SECRET);
		const user = await Users.findOne({ _id: userid.id });

		if (!user) {
			return res.status(400).json(errorMessage('Not logged in'));
		}

		req.user = user._id;
		next();
	} catch (err) {
		console.log(err);
		return res.status(400).json(errorMessage(err.message));
	}
};

// export const admin = async (req, res, next) => {
// 	try {
// 		const header = req.headers['authorization'];
// 		const token = header.split(' ')[1];

// 		if (!token) {
// 			return res.status(400).json(errorMessage('Token not present!'));
// 		}

// 		const userid = jwt.verify(token, process.env.JWT_SECRET);
// 		const user = await Admin.findOne({ _id: userid.id });

// 		if (!user) {
// 			return res.status(400).json(errorMessage('Not logged in'));
// 		}

// 		req.user = user._id;
// 		next();
// 	} catch (err) {
// 		console.log(err);
// 		res.status(400).json(errorMessage(err.message));
// 	}
// };

// export default { auth };
