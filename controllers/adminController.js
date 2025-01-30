import { hashPassword } from "../middlewares/util.js";
import Admin from "../models/Admin.js";
import {
	errorMessage,
	successMessage,
} from '../middlewares/util.js';



const createAdmin = async (req, res) => {
	try {
        req.body.password = hashPassword(req.body.password);
		const data = await Admin.create(req.body);

		return res.status(201).json(successMessage('Admin Created Successfullys', data));
	} catch (err) {
		console.log(err)
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const getAdmin = async (req, res) => {
	try {
        
		const data = await Admin.findById(req.params.id);

		return res.status(200).json(successMessage('Fetched Successfully', data));
	} catch (err) {
		console.log(err)
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const updateAdmin = async (req, res) => {
	try {
		const allowedFields = ["companyName", "mobile", "pincode", "address", "logo"];
		const updateData = Object.keys(req.body).reduce((acc, key) => {
            if (allowedFields.includes(key)) {
                acc[key] = req.body[key];
            }
            return acc;
        }, {});

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json(errorMessage("No valid fields to update"))
        }
		const data = await Admin.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
			runValidators: true
		});
		return res.status(200).json(successMessage('Admin Updated Successfully', data));
	} catch (err) {
		console.log(err);
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

const deleteAdmin = async (req, res) => {
	try {
		const data = await Admin.findByIdAndDelete(req.params.id);
		if (data !== null) return res.status(200).json(successMessage('Admin Deleted Successfully', data));
		else return res.status(404).json(errorMessage('ID not found', data));
	} catch (err) {
		console.log(err)
		return res
			.status(500)
			.json(errorMessage(err?.message || 'Something went wrong'));
	}
};

export default {
    createAdmin,
	getAdmin,
	updateAdmin,
	deleteAdmin
}
