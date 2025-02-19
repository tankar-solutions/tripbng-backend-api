/** @format */

import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import { generateOTP } from "../utils/generateOtp.js";
import { sendSMS } from "../utils/SMS.js";
import { OtpVfy } from "../models/Agent_Cp/OtpVfy.models.js";
import { ApiResponse } from '../utils/ApiResponse.js';
import { AsnycHandler } from "../utils/AsnycHandler.js";

const login = AsnycHandler(async (req, res) => {
    const { mobile } = req.body;

    if (!mobile) {
        return res.status(400).json(new ApiResponse(400, null, "Valid mobile number required"));
    }

    let user = await User.findOne({ mobile });
    if (!user) {
        user = await User.create({ mobile });
    }

    const otp = generateOTP();
    try {
        await sendSMS(`Your OTP is ${otp}`, mobile);
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to send OTP"));
    }

    const otpRecord = await OtpVfy.create({
        veryficationType: "login",
        veryficationFeild: mobile,
        otp
    });

    if (!otpRecord) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to create OTP record"));
    }

    return res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});

const verifyOTP = AsnycHandler(async (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json(new ApiResponse(400, null, "Mobile and OTP required"));
    }

    const user = await User.findOne({ mobile });
    if (!user) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    const otpRecord = await OtpVfy.findOne({
		veryficationType: "login",
        veryficationFeild: mobile,
        otp
    });

    if (!otpRecord) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid OTP"));
    }

    // Check OTP expiration (5 minutes)
    if (Date.now() - otpRecord.createdAt > 300000) {
        await OtpVfy.deleteOne({ _id: otpRecord._id });
        return res.status(401).json(new ApiResponse(401, null, "OTP expired"));
    }

    // Cleanup OTP record
    await OtpVfy.deleteOne({ _id: otpRecord._id });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.status(200).json(new ApiResponse(200, { token, user }, "OTP verified successfully"));
});

const resendOTP = AsnycHandler(async (req, res) => {
    const { mobile } = req.body;

    if (!mobile) {
        return res.status(400).json(new ApiResponse(400, null, "Valid mobile number required"));
    }

    const otp = generateOTP();
    try {
        await sendSMS(`Your new OTP is ${otp}`, mobile);
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to resend OTP"));
    }

    // Update existing OTP record
    await OtpVfy.findOneAndUpdate(
        { verificationField: mobile, verificationType: "login" },
        { otp, createdAt: Date.now() },
        { upsert: true }
    );

    return res.status(200).json(new ApiResponse(200, null, "OTP resent successfully"));
});

const socialLogin = AsnycHandler(async (req, res) => {
    const { email, name, provider } = req.body;

    if (!provider || !email || !name) {
        return res.status(400).json(new ApiResponse(400, null, "Provider, email, and name are required"));
    }

    let user = await User.findOne({ email, provider });
    if (!user) {
        user = await User.create({ email, name, provider });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.status(200).json(new ApiResponse(200, { token, user }, "Social login successful"));
});

export default {
    login,
    verifyOTP,
    resendOTP,
    socialLogin
};