import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import flightRouter from './routes/flight.js';
import UserRouter from './routes/user.routes.js';
import DMCRouter from './routes/dmc.routes.js';
import AdminRouter from './routes/admin.routes.js';
import AgentRoutes from "./routes/Agent.auth.routes.js"
import CpRoutes from "./routes/cp.auth.routes.js"
import {Flight} from "./routes/Flight.routes.js"
import { BusRoutes } from './routes/bus.routes.js';
// import BestRouter from "./routes/bestFlight.routes.js"


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
app.get('/',(req,res)=>
{
	res.send("hellowq")
})
app.use('/flight', flightRouter);
app.use('/user', UserRouter);
app.use('/dmc', DMCRouter);
app.use('/admin', AdminRouter);
// app.use('/best', BestRouter);
app.use('/best' , Flight);
app.use('/AgentAuth' , AgentRoutes);	
app.use('/CpAuth' , CpRoutes);	
app.use('/bus' , BusRoutes);

export {app}