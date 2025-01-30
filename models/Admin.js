/** @format */
import mongoose from 'mongoose';


const adminSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      match: [/^\d{10}$/, 'Mobile number must be a 10 digit number'],
    },
    pincode: {
      type: String,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    logo: {
      type: String,
    }
  },
  { timestamps: true }
);

adminSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('Admin', adminSchema);