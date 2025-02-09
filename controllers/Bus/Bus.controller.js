import {ApiResponse} from "../../utils/ApiResponse.js"
import {AsnycHandler} from "../../utils/AsnycHandler.js"
import {isNull} from "../../utils/FormCheck.js"
import {sendPostRequest}  from "../../utils/sendRequest.js"
import {authHeaders} from "../../middlewares/util.js"

//complete
const SearchBus = AsnycHandler(async(req ,res)=>{
    const {From_City , To_City , TravelDate} = req.body;

    if(isNull([From_City , To_City]))
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false} , "Please Enter All Feild" )
        )
    }
    //mm/dd/yyyy
    if(!TravelDate)
    {
       let  MakeADate = new Date();
       TravelDate = MakeADate.toLocaleDateString();
    }
    console.log(TravelDate)
    if(isNull([From_City , To_City , TravelDate]))
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false} , "All Feild is compalsary")
        )
    }

    

    const SendRequest = await sendPostRequest("http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_Search" , {} , 
        {
            Auth_Header: authHeaders(),
            From_City,
            To_City,
            TravelDate

        }
    )

    if(SendRequest.data.Response_Header.Error_InnerException)
    {
        return res.status(200)
        .json(
            new ApiResponse(200 , {success:true , data:SendRequest.data.Response_Header.Error_InnerException} ,SendRequest.data.Response_Header.Error_InnerException )
        )
    }
    if(!SendRequest)
    {
        return res.status(200)
        .json(
            new ApiResponse(200 , {success:true , data:"No Bus Sd on this rute"} , "No Bus Sd on this rute")
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200 , {success:true  , data:SendRequest.data },"Bus Search")
    )


})

//complete
const BusSeatMap = AsnycHandler(async(req,res)=>{

    const { Boarding_Id , Dropping_Id,Bus_Key,Search_Key } = req.body;
    
    if(isNull([Boarding_Id , Dropping_Id , Bus_Key , Search_Key]))
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false} , "please Enter All feild Compalsary")
        )
    }
    const SeatMap = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_SeatMap',{},{
        Auth_Header: authHeaders(),
        Boarding_Id,
        Dropping_Id,
        Bus_Key,
        Search_Key
    })

    if(SeatMap.data.Response_Header.Error_InnerException)
    {
        return res.status(200)
        .json(new ApiResponse(200 , {success:false , data:SeatMap.data.Response_Header.Error_InnerException} , SeatMap.data.Response_Header.Error_InnerException ))
    }

    if(!SeatMap)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false},"Something Wrong while fecthing details")
        )
    }
    return res.status(200)
    .json(
        new ApiResponse(200 , {success:true , data:SeatMap.data} , "SuccessFully Fetached")
    )


})

const TempBooking = AsnycHandler(async(req,res)=>{
    const sampleData ={
        "Boarding_Id":"24514",
        "Bus_Key":"",
        "CorporatePaymentMode":0,
        "CorporateStatus":"0",
        "CostCenterId":0,
        "Customer_Mobile":"9800000001",
        "Deal_Key":"",
        "Dropping_Id":"27177",
        "GST":true,
        "GSTIN":"12345",
        "GSTINHolderAddress":"somthing",
        "GSTINHolderName":"krish",
        "PAX_Details":[
            {
                "Age":38,
                "DOB":"05/06/1984",		
                "Gender":0,
                "Id_Number":"0",
                "Id_Type":0,
                "Ladies_Seat":false,
                "PAX_Id":1,
                "PAX_Name":"Prabahar Test",
                "Penalty_Charge":"",
                "Primary":false,
                "Seat_Number":"1",
                "Status":"",
                "Ticket_Number":"",
                "Title":"Mr"
            }
        ],
        "Passenger_Email":"test@test.com",
        "Passenger_Mobile":"9000000011",
        "ProjectId":1,
        "Remarks":"Bus Chennai - Bangalore - 07/02/2025",
        "Search_Key":"",
        "SendEmail":false,
        "SendSMS":false
    }
    const Booking = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_TempBooking',{},
        {
        Auth_Header: authHeaders(),
        ...req.data
        }
    )

    return res.status(200)
    .json(
        new ApiResponse(200 ,{success:true , data:Booking} ,"FetchSuccessFully")
    )
})

//After Booking
// Do not Add any booking Api now 
const GetBookingDetails = AsnycHandler(async(req ,res)=>{
    
    const {Booking_RefNo} = req.body;
    if(!Booking_RefNo)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 ,{success:false} , "Please Enter the Booking RefNo")
        )
    }

    const BookingData = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_Requery',{},
        {
            Auth_Header: authHeaders(),
            Booking_RefNo
        }
    )
    if(!BookingData)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 ,{success:false} , "Please Enter Correct Booking Ref No")
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200 ,{success:true ,data:BookingData.data} , "Data fetch SuccessFully")
    )

})

const GetBookingCancellationDetails = AsnycHandler(async(req,res)=>{
    const SampleData =
    {"Booking_RefNo":"String content",
	"CancelTicket_Details":[{
		"Seat_Number":"String content",
		"Ticket_Number":"String content",
		"Transport_PNR":"String content"
	}] }

    const {Booking_RefNo , Seat_Number , Ticket_Number , Transport_PNR} = req.body;
    if(isNull([Booking_RefNo , Seat_Number , Ticket_Number , Transport_PNR]))
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false , data:"Please Enter All feild"} , "Pleas Enter All Feild")
        )
    }

    const CancellationDetails = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_CancellationCharge' ,{} ,{
        Auth_Header: authHeaders(),
        Booking_RefNo,
        CancelTicket_Details:[
            {
                Seat_Number,
                Ticket_Number,
                Transport_PNR
            }
        ]

    })

    
    
    if(!CancellationDetails)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false} ,"Invalid Cancellation")
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200 , {success:true , data:CancellationDetails.data} , "All Cancellation details")
    )



})

const CancelBooking = AsnycHandler(async(req ,res)=>{

    const sampleData  ={
        "Booking_RefNo":"String content",
	"BusTicketstoCancel":[{
		"Seat_Number":"String content",
		"Ticket_Number":"String content",
		"Transport_PNR":"String content"
	}],
	"CancellationCharge_Key":"String content"
    }

    const {Booking_RefNo , Seat_Number , CancellationCharge_Key,Ticket_Number} = req.body;

    if(isNull([Booking_RefNo , Seat_Number , CancellationCharge_Key , Ticket_Number]))
    {
        return res.status(400)
        .json(
            new ApiResponse(400, {success:false},"Please Enter All The Feild")
        )
    }
    const GetPNR = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_Ticketing' ,{} ,{
        Auth_Header: authHeaders(),
        Booking_RefNo
    })

    if(!GetPNR)
    {
        return res.status(400)
        .json(400 , {success:false} ,"Please Enter Valid Details")
    }

    const Transport_PNR = GetPNR?.data?.Transport_PNR;

    if(!Transport_PNR)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 ,{success:false}, "Invalid Booking details")
        )
    }

    const TicketCancellation = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_Cancellation',{},{
        Auth_Header: authHeaders(),
        Booking_RefNo,
        BusTicketstoCancel:[{
            Seat_Number,
            Ticket_Number,
            Transport_PNR
        }],
        CancellationCharge_Key
    })
    if(!TicketCancellation)
    {
        return res.status(500)
        .json(
            new ApiResponse(500 , {success:false} ,"Something Went wrong while fetching details")
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200 , {success:true , data:TicketCancellation}  ,"Tickit Cancel SuccessFully")
    )
})


//Some new feture Added Sone



export {SearchBus,
    BusSeatMap,
    TempBooking,
    GetBookingDetails,
    GetBookingCancellationDetails,
    CancelBooking
}