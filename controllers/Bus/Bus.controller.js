import {ApiResponse} from "../../utils/ApiResponse.js"
import {AsnycHandler} from "../../utils/AsnycHandler.js"
import {isNull} from "../../utils/FormCheck.js"
const auth ={
    "Auth_Header": {
        "UserId": "xxxxxxxxxx",
        "Password": "xxxxxxxxxx",
        "Request_Id": "PrabaharPostMan",
        "IP_Address": "xxxxxxxxxx",
        "IMEI_Number": "123456789"
    }
    }


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

const SearchBus = AsnycHandler(async(req ,res)=>{
    const {from_city , to_city , travel_date} = req.body;
    //mm/dd/yyyy
    if(isNull([from_city , to_city , travel_date]))
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false} , "All Feild is compalsary")
        )
    }

    auth["From_City"] = from_city;
    auth["To_City"] = to_city;
    auth["TravelDate"] = travel_date;

    const SendRequest = await sendPostRequest("http://domain/BusHost/BusAPIService.svc/JSONService/Bus_Search" , {} , auth)

    console.log(SendRequest)

    return res.status(200)
    .json(
        new ApiResponse(200 , {success:true , data:SendRequest },"Bus Search")
    )


})

const BusSeatMap = AsnycHandler(async(req,res)=>{
    const { Boarding_Id , Dropping_Id,Bus_Key,Search_Key } = req.body;
    
})

