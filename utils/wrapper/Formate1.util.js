const Temp =
{
"Auth_Header":{
		"IMEI_Number":process.env.ETRAV_IMEI_NO,
		"IP_Address":process.env.ETRAV_IP,
		"Password":process.env.ETRAV_PASSWORD,
		"Request_Id":process.env.ETRAV_REQUESTID,
		"UserId":process.env.ETRAV_USERID
	},
    "Travel_Type": 0, //0 -DOMESTIC, 1 - INTERNATIONAL
    "Booking_Type": 0, //0 - ONE_WAY, 1- ROUNDTRIP, 2- SPECIALROUNDTRIP
    "TripInfo": [
        // {
        //     "Origin": "IXC", //IATA Code Source/Start
        //     "Destination": "DEL", //IATA Code Desination/End
        //     "TravelDate": "02/01/2025" //MM/DD/YYYY 
        // }
        
    ],
    "Adult_Count": "1",
	"SrCitizen_Search":false,
	"StudentFare_Search":false,
    "Child_Count": "0",
    "Infant_Count": "0",
    "Class_Of_Travel": "0", //0- ECONOMY, 1- BUSINESS, 2- FIRST, 3- PREMIUM_ECONOMY
    "Filtered_Airline":[  
        {  
            "Airline_Code": ""  
        }  
    ],
    "stops": [0, 1, 2, 3],
    "priceRange": {
        "min": 0,
        "max": 250000
    },
    "departureFromOrigin": null, //0 - 12-6am, 1 - 6-12pm, 2 - 12-6pm, 3 - 6-12am 
    "arrivalAtDestination": null, //0 - 12-6am, 1 - 6-12pm, 2 - 12-6pm, 3 - 6-12am 
    "sort": {
        "name": "price", //price, departure, fastest
        "method": "asc" //asc
    }
}




function FormateForApi1(data) {
    console.log("Formating Data For Api1....")
    if(data.Travel.Travel_Date)
        { 
            let date = data.Travel.Travel_Date;
            const dateArray = date.split("-");
            const FormatedDate = `${dateArray[1]}/${dateArray[0]}/${dateArray[2]}`;

            
            Temp.TripInfo = [{
                "Origin": data.Travel.FromCity,
                "Destination": data.Travel.toCity,
                "TravelDate": FormatedDate, // Convert DD-MM-YYYY to MM/DD/YYYY
            }];
        }
    else 
        {
            let TodayData = new Date()
            const Today = TodayData.toLocaleDateString(); //DD-MM-YYYY
            const dateArray = Today.split("-");
            const FormatedDate = `${dateArray[1]}/${dateArray[0]}/${dateArray[2]}`;
            Temp.TripInfo = [{
                "Origin": data.Travel.FromCity,
                "Destination": data.Travel.toCity,
                "TravelDate": FormatedDate, // Convert DD-MM-YYYY to MM/DD/YYYY
            }];

        }
    

    Temp.Adult_Count =  new Number(data.Traveler.Adult_Count) || 1;
    Temp.Child_Count = new Number(data.Traveler.Child_Count[0]) || 0;

    if(data.Traveler.Child_Count[0] !="0")
        {
            let infant_count =0;
            for(let i=0; i< new Number(data.Traveler.Child_Count[0]) ; i++)
            {
                if(data.Traveler.Child_Count[1][i]<=1)
                {
                    infant_count++;
                }
            }
            
            Temp.Infant_Count = 0;
        } 
   

    Temp.Class_Of_Travel = data.Travel.Cabine || 0;
    Temp.Travel_Type = data.Travel.Travel_Type || 0;
   
    return Temp;
}
export {FormateForApi1}


