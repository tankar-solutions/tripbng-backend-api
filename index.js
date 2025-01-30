/** @format */

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import flightRouter from './routes/flight.js';
import UserRouter from './routes/user.js';
import DMCRouter from './routes/dmc.js';
import AdminRouter from './routes/admin.js';

dotenv.config();

const app = express();
app.use(
	cors({
		origin: 'https://api.tripbng.com',
	})
);
app.use(morgan('dev'));
app.use(express.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
app.use(bodyParser.json({ limit: '200mb' }));

// Routes
app.use('/flight', flightRouter);
app.use('/user', UserRouter);
app.use('/dmc', DMCRouter);
app.use('/admin', AdminRouter);

// Environment variables
const URL = process.env.MONGODB_URI;
const PORT = process.env.PORT || '1111';

// Database connection
const connectDb = () => {
	mongoose
		.connect(URL, {
			maxPoolSize: 3,
			minPoolSize: 2,
		})
		.then(() => {
			console.log('Database is connected...');
		})
		.catch((error) => {
			console.log('Error:', error.message);
		});
};

connectDb();

// Root route
app.get('/', async (req, res) => {
	res.set('Access-Control-Allow-Origin', '*');
	res.send({ msg: 'This has enabled CORSa' });
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on PORT: ${PORT}`);
});
