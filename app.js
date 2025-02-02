import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import flightRouter from './routes/flight.js';
import UserRouter from './routes/user.js';
import DMCRouter from './routes/dmc.js';
import AdminRouter from './routes/admin.routes.js';
import BestRouter from "./routes/bestFlight.routes.js"


const app = express();
app.use(
	cors({
		origin: '*',
	})
);
app.use(morgan('dev'));
app.use(express.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(cookieParser())

// Routes
app.use('/flight', flightRouter);
app.use('/user', UserRouter);
app.use('/dmc', DMCRouter);
app.use('/admin', AdminRouter);
app.use('/best', BestRouter);

export {app}