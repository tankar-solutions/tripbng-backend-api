import axios from "axios";
import { AsnycHandler } from "../utils/AsnycHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { FormateForApi2 } from "../utils/wrapper/Formate2.util.js";
import { FormateForApi1 } from "../utils/wrapper/Formate1.util.js";
import { ResponseAdder } from "../utils/FlightResponse/FormateSearch.js";
async function sendPostRequest(url, headers, body) {
    try {
        console.log('Fetching Data From Api....')
        const response = await axios.post(url, body, {
            headers: headers
        })
        return response.data
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

//Note : We Assuming We Get Data from the FrontEnd Like This :
const Data ={
    Travel:
    {
        FromCity:"BOM",
        toCity:"DEL",
        Cabine:"1", //0- ECONOMY, 1- BUSINESS, 2- FIRST, 3- PREMIUM_ECONOMY
        Travel_Date:"03-02-2025", // DD-MM-YYYY
        Travel_Type:0, //0 -DOMESTIC, 1 - INTERNATIONAL //optional
    },
    Traveler:
    {
        Adult_Count:"1" ,// By Defalut 1,
        Child_Count:["1" , [10] ], // [ childNumber , [age]]  

    },
    Direct :[true], //  if Not Direct then do [false , [0,1,2,3,4]]



}

const head = {
    'Content-Type': 'application/json',
    apikey: process.env.KEY_API

}

const GetAllBestFlight = AsnycHandler(async (req ,res) =>{

    //   const Data = req.data 
      const Api1 = FormateForApi1(Data);
      const Api2 = FormateForApi2(Data);

      const response1 = await sendPostRequest(process.env.API1_URL ,{} , Api1)
      const response2 = await sendPostRequest(process.env.API2_URL , head , Api2);
      const response = ResponseAdder(response1.data.TripDetails[0].Flights ,null, response2.
        searchResult.tripInfos.ONWARD)
      res.status(200)
      .json(
        new ApiResponse(200 , {response} ,"Suceess" )
      )

})

export {GetAllBestFlight}
