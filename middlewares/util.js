/** @format */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export const generateToken = (userid) => {
	const token = jwt.sign(userid, process.env.JWT_SECRET);
	return token;
};

export const hashPassword = (password) => {
	const hashedPassword = bcrypt.hashSync(password, 8);
	return hashedPassword;
};

export const verifyPassword = (password, hashedPassword) => {
	return bcrypt.compareSync(password, hashedPassword);
};

export const successMessage = (message, payload = true) => {
	return {
		success: true,
		message,
		data: payload,
	};
};

export const errorMessage = (error) => {
	return {
		success: false,
		error,
	};
};

export const authHeaders = () => {
	return {
		UserId: process.env.ETRAV_USERID,
		Password: process.env.ETRAV_PASSWORD,
		IP_Address: process.env.ETRAV_IP,
		Request_Id: process.env.ETRAV_REQUESTID,
		IMEI_Number: process.env.ETRAV_IMEI_NO,
	};
};

export const isValidMongoObjectId = (id) => {
	return mongoose.Types.ObjectId.isValid(id);
};

export const isNonEmptyArray = (arr) => {
	return arr && Array.isArray(arr) && arr.length > 0;
};
