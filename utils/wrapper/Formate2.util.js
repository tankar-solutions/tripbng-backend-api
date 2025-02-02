const Template2 = {
    "searchQuery": {
        "cabinClass": "ECONOMY",
        "paxInfo": {
            "ADULT": "1",
            "CHILD": "0",
            "INFANT": "0"
        },
        "routeInfos": [
            {
                "fromCityOrAirport": {
                    "code": "DEL"
                },
                "toCityOrAirport": {
                    "code": "MAA"
                },
                "travelDate": "2025-03-11" //yyyy-mm-dd
            }
        ],
        "searchModifiers": {
            "isDirectFlight": true,
            "isConnectingFlight": true
        }
    }
}

function FormateForApi2(data)
{

    console.log("Formation Data For Api 2.....");
if(data)
{
    if(data.Travel.Cabine == "0")
    {

        Template2["searchQuery"].cabinClass = "ECONOMY"
    }
    else if(data.Travel.Cabine == "1")
    {
        Template2["searchQuery"].cabinClass = "BUSINESS";

    }
    else if(data.Travel.Cabine == "2")
        {
            Template2["searchQuery"].cabinClass = "FIRST";
    
        }
    else if(!data.Travel.Cabine){
        Template2["searchQuery"].cabinClass = "ECONOMY";
     }   

    else{
            Template2["searchQuery"].cabinClass = "PREMIUM_ECONOMY";

        }


    if(data.Traveler)
    {
        Template2["searchQuery"].paxInfo.ADULT = data.Traveler.Adult_Count || 1;
        Template2["searchQuery"].paxInfo.CHILD = data.Traveler.Child_Count[0] || 0;
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
                
                Template2["searchQuery"].paxInfo.INFANT = infant_count;
            } 
    }

    if(data.Travel.Travel_Date)
        { 
            let date = data.Travel.Travel_Date;
            const dateArray = date.split("-");
            const FormatedDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;

            Template2["searchQuery"].routeInfos[0].travelDate =FormatedDate;
        }
        else 
        {
            let TodayData = new Date()
            const Today = TodayData.toLocaleDateString(); //DD-MM-YYYY
            const dateArray = Today.split("-");
            const FormatedDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
            Template2["searchQuery"].routeInfos[0].travelDate =FormatedDate;

        }

    Template2["searchQuery"].routeInfos[0].fromCityOrAirport.code = data.Travel.FromCity;
    Template2["searchQuery"].routeInfos[0].toCityOrAirport.code = data.Travel.toCity;

}

return Template2;
}



export {FormateForApi2}
