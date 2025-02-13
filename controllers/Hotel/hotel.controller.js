import {ApiResponse} from "../../utils/ApiResponse.js"
import {AsnycHandler} from "../../utils/AsnycHandler.js"
import {isNull} from "../../utils/FormCheck.js"
import {sendPostRequest , sendGetRequest}  from "../../utils/sendRequest.js"


const SearchHotelUsingCityName = AsnycHandler(async (req, res) => {
    const { CityName } = req.body;
    console.log(CityName);

    let url = `https://autosuggest.travel.zentrumhub.com/api/locations/locationcontent/autosuggest?term=${CityName}`;
    
    try {
        const response = await sendGetRequest(url, {}, {});
        
        // Extract the actual response data
        const responseData = response.data || response; // Adjust based on sendGetRequest output

        // console.log("Response Data:", responseData);

        return res.status(200).json(
            new ApiResponse(200, { success: true, data: responseData }, "Data Fetch Successfully")
        );
    } catch (error) {
        console.error("Error fetching data:", error);

        return res.status(500).json(
            new ApiResponse(500, { success: false }, "Internal Server Error")
        );
    }
});


const SampleData = {
    "channelId": "{{channelId}}",
    "currency": "USD",
    "culture": "en-US",
    "checkIn": "2025-05-15",
    "checkOut": "2025-05-16",
    "occupancies": [
        {
            "numOfAdults": 2,
            "childAges": []
        }
    ],
    "circularRegion": {
        "centerLat": "{{circularLat}}", //Lat
        "centerLong": "{{circularLong}}", //Lon
        "radiusInKm": 30
    },
    "searchLocationDetails": {
        "id": "{{locationId}}",
        "name": "{{locationName}}",
        "fullName": "{{locationFullName}}",
        "type": "{{locationType}}",
        "state": "{{locationState}}",
        "country": "{{locationCountry}}",
        "coordinates": "{{locationCoordinates}}"
    },
    "nationality": "IN",
    "countryOfResidence": "IN",
    "destinationCountryCode": "IN",
    "travelPurpose": "Leisure",
    "filterBy": null
}



const SearchWithLocation = AsnycHandler(async(req,res)=>{
     const {checkIn , checkOut , numOfAdults ,childAges ,Id , cityname, cityFullname , state ,country } = req.body;

     if(!checkIn)
     {}
     if(checkOut)
     {}
     if(!numOfAdults)
     {}
     if(!childAges)
     {}
     if(!Id)
     {}
     
})



const GetHotelDetails = AsnycHandler(async (req, res) => {

    const { hotelId } = req.body;

    const headers = {
        "Content-Type": "application/json",
        "accountId": "zentrum-demo-account",  // Add your account ID here
        "customer-ip": "49.34.97.68", // Add customer IP here
        "correlationId": "00f49a21-b0b4-2712-4c47-41caef8c3c26", // Add correlation ID here
        "apiKey": "4477a62d-2bb6-4392-896a-3f5270962dbc" // Add your API key here
    };

    const requestBody = {
        "hotelIds": [hotelId],
        "channelId": "client-demo-channel",
        "culture": "en-US",
        "contentFields": ["All"],
        "useIcePortalImages": true,
        "useTrustYouReview": true,
        "opinionatedContent": true
    };

    if (!hotelId) {
        return res.status(400).json({ success: false, message: "Hotel ID is required" });
    }
    
    const {data} = await sendPostRequest('https://nexus.prod.zentrumhub.com/api/content/hotelcontent/getHotelContent' ,{headers} , requestBody )

    if(!data)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false , data:"Data is not found"} , "data is not found")
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200 , {success:true , data:data} ,"Data fetched")
    )   
});


const SearchHotelName = AsnycHandler(async(req,res)=>{
    const {HotelName} = req.body;

    if(!HotelName)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false , data:"Please Enter the Hotel Name"} , "Please Enter the Hotel Name")
        )
    }
    const HotelData = await sendGetRequest(`https://autosuggest.travel.zentrumhub.com/api/locations/locationcontent/autosuggest?term=${HotelName}` , {} , {})

    if(!HotelData)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false , data:"Data is not Come"} , "Data is not come")
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200 , {success:true  , data:HotelData.data} , "Data fetch SuccessFully")
    )
})


export {
    SearchHotelUsingCityName,
    GetHotelDetails,
    SearchHotelName
} 