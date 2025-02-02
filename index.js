/** @format */
import {connectDb} from "./db/index.js"
import dotenv from "dotenv"
import { app } from "./app.js";
dotenv.config();


// Environment variables
const PORT = process.env.PORT || '1111';

// Database connection

connectDb()
.then(

	app.listen(PORT, () => {
		console.log(`Server is running on PORT: ${PORT}`);
	})
)
.catch((err)=>{
	console.log(err)
});


