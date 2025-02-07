import axios from "axios";
import { AsnycHandler } from "../../utils/AsnycHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { FormateForApi2 } from "../../utils/wrapper/Formate2.util.js";
import { FormateForApi1 } from "../../utils/wrapper/Formate1.util.js";
import { ResponseAdder } from "../../utils/FlightResponse/FormateSearch.js";
import { sendGetRequest, sendPostRequest } from "../../utils/sendRequest.js";
import { isNull } from "../../utils/FormCheck.js"
import { authHeaders } from "../../middlewares/util.js";
import AirlineCodes from "../../models/AirlineCodes.js"



const head = {
    'Content-Type': 'application/json',
    apikey: process.env.KEY_API
}
const GetBookingId = async (Id) => {
    let FunctionResponse = 0;
    const data = await sendPostRequest('https://apitest.tripjack.com/fms/v1/review', head, {
        priceIds: [Id]
    })
    if (data.errors) {
        if (data.errors[0].id) {
            FunctionResponse = data.errors[0].id
            return FunctionResponse
        }
        else {
            FunctionResponse = data.errors[0].message
            return FunctionResponse
        }
    }

    FunctionResponse = data.data.bookingId;
    return FunctionResponse;
}

const GetAllBestFlight = AsnycHandler(async (req, res) => {

    const Data = req.body
    console.log(Data)
    const Api1 = FormateForApi1(Data);
    const Api2 = FormateForApi2(Data);

    const response1 = await sendPostRequest(process.env.API1_URL, {}, Api1)
    const response2 = await sendPostRequest(process.env.API2_URL, head, Api2);
    const response = ResponseAdder(response1.data.TripDetails[0].Flights, response1.data.Search_Key, response2.data.searchResult.tripInfos.ONWARD)
    res.status(200)
        .json(
            new ApiResponse(200, { response }, "Suceess")
        )

})


const SearchAirLine = AsnycHandler(async (req, res) => {

    try {
        const searchTerm = req.query.search;
        const query = searchTerm
            ? {
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { iata_code: { $regex: searchTerm, $options: 'i' } },
                ],
            }
            : {};

        const data = await AirlineCodes.find(query);

        return res.status(200).json(
            new ApiResponse(200, { success: true, data }, "Data Fetch")
        );
    } catch (err) {
        return res
            .status(500)
            .json(
                new ApiResponse(500, { success: false }, "Fail to fetch AirLine")
            );
    }


})


const GetAirlinePolicy = AsnycHandler(async (req, res) => {
    const { FareId, SearchKey, FlightKey, ApiNo, id } = req.body
    // console.log(FareId ,SearchKey , FlightKey , ApiNo , id)
    if (ApiNo == 1) {
        if (isNull([FareId, SearchKey, FlightKey, ApiNo])) {
            return res.status(400)
                .json(
                    new ApiResponse(400, { success: false }, "please Enter All the Feild Compalsary")
                )
        }

        const AirPolicy = await sendPostRequest(`${process.env.ETRAV_BASEURL}/airlinehost/AirAPIService.svc/JSONService/Air_FareRule`, { 'Content-Type': 'application/json' }, {
            Auth_Header: authHeaders(),
            Search_Key: SearchKey, Flight_Key: FlightKey, Fare_Id: FareId
        })



        return res.status(200)
            .json(
                new ApiResponse(200, { success: true, data: AirPolicy?.data?.FareRules[0].FareRuleDesc }, "Fetch SuccessFully")
            )
    }

    if (ApiNo == 2) {
        const AirLinePolicy = await sendPostRequest('https://apitest.tripjack.com/fms/v2/farerule', head, {
            id,
            "flowType": "SEARCH"
        })

        return res.status(200)
            .json(
                new ApiResponse(200, { success: true, data: AirLinePolicy.data }, "Fetch SuccessFully")
            )


    }




})


const sampleData = {
    "Search_Key": "",
    "Flight_Keys": [""
    ], //Reprice Flight Key
    "PAX_Details": [
        {
            "Pax_type": 0,
            "Title": "Mr",
            "First_Name": "Testing",
            "Last_Name": "Sample",
            "Gender": 0,
            "Age": null,
            "DOB": null,
            "Passport_Number": null,
            "Passport_Issuing_Country": null,
            "Passport_Expiry": null,
            "Nationality": null,
            "FrequentFlyerDetails": null
        }
    ]
}


const FlightReview = AsnycHandler(async (req, res) => {

})



// const Api1SeatData = {
//     "Search_Key":"",
//     "Flight_Keys":[""],

//     "PAX_Details": [
//         {
//             "Pax_type": 0,
//             "Title": "Mr",
//             "First_Name": "Testing",
//             "Last_Name": "Sample",
//             "Gender": 0,
//             "Age": null,
//             "DOB": null,
//             "Passport_Number": null,
//             "Passport_Issuing_Country": null,
//             "Passport_Expiry": null,
//             "Nationality": null,
//             "FrequentFlyerDetails": null
//         }
//     ]
// }


//complete
const getFlightSeat = AsnycHandler(async (req, res) => {
    const { Id, ApiNo, Api1Data} = req.body;
    // const {username} = req.user;

    if (ApiNo == "1") {
        if(!Api1Data)
        {
            return res.status(400)
            .json(
                new ApiResponse(400,{success:false} , "Please Enter the Api 1 request Data")
            )
        }

        const {data} = await sendPostRequest('http://uat.etrav.in/airlinehost/AirAPIService.svc/JSONService/Air_GetSeatMap' , {} , {
         Auth_Header: authHeaders(),
         ...Api1Data

        })
        console.log(data)
        if(data.Response_Header.Error_InnerException)
        {
            return res.status(200)
            .json(
                new ApiResponse(
                    200 ,{success:true , data:data.Response_Header.Error_InnerException} , data.Error_InnerException
                )
            )
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200, {success:true , data} , "Data Fetch"
            )
        )


    }
    if (ApiNo == "2") {
        const bookingid = await GetBookingId(Id)
        //This is Run While id is Exired
        if (bookingid == "Keys Passed in the request is already expired. Please pass valid keys") {
            return res.status(400)
                .json(
                    new ApiResponse(400, { success: false }, bookingid)
                )
        }

        //if we get the Booking Id then get the SeatMap using bookingId
        const seatMap = await sendPostRequest('https://apitest.tripjack.com/fms/v1/seat', head, { bookingId: bookingid })

        //if seat selection is not Applicable for the flight
        if (seatMap.errors) {

            return res.status(200)
                .json(
                    new ApiResponse(200, { success: false }, seatMap.errors[0].message)
                )
        }

        //This return seatMap if seatMaping is avble
        return res.status(200)
            .json(
                new ApiResponse(200, { success: true, data: seatMap.data }, "Data SuccessFully Fetched")
            )
    }

    return res.status(400)
    .json( new ApiResponse(400 ,{success:false , data:"Please Enter ApiNo"} , "Please Enter ApiNo"))
})


export {
    GetAllBestFlight,
    SearchAirLine,
    GetAirlinePolicy,
    getFlightSeat
}
