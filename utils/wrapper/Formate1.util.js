const Template2 =
{
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


function FormateForApi1( data) {
    console.log("Formating Data For Api1....")
    if(data.Travel.Travel_Date)
        { 
            let date = data.Travel.Travel_Date;
            const dateArray = date.split("-");
            const FormatedDate = `${dateArray[1]}/${dateArray[0]}/${dateArray[2]}`;

            
            Template2.TripInfo = [{
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
            Template2.TripInfo = [{
                "Origin": data.Travel.FromCity,
                "Destination": data.Travel.toCity,
                "TravelDate": FormatedDate, // Convert DD-MM-YYYY to MM/DD/YYYY
            }];

        }
    

    Template2.Adult_Count = data.Traveler.Adult_Count || 1;
    Template2.Child_Count = data.Traveler.Child_Count[0] || 0;

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
            
            Template2.Infant_Count = infant_count;
        } 
   

    Template2.Class_Of_Travel = data.Travel.Cabine || 0;
    Template2.Travel_Type = data.Travel.Travel_Type || 0;
    
    if (data.Direct[0]) {
        Template2.stops = [0]; // Direct flights only
    } else {
        Template2.stops = data.Direct[1] || [0, 1, 2, 3, 4]; // If not direct, take provided stops or default
    }

    return Template2;
}
export {FormateForApi1}


