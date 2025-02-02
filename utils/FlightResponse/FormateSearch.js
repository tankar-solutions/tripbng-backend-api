import {ResponseFormat} from "./ResponseFormate.js"
import {ADDT1 , ADDT2} from "./Additional.js"

const ResponseData =[];

function ResponseAdder(Data1 , searchkey=null , Data2)
{
    console.log("Creating Response....")

    if(!Data1)
    {
        let Data2Length = Data2.length;
        for(let i=0; i<Data2Length; i++)
            {
                let Destination =
                {
                    Destination:Data2[i].sI[0].da.cityCode,
                    Destination_Terminal:Data2[i].sI[0].da.terminal,
        
                }
                let Origin  = {
                    Origin:Data2[i].sI[0].aa.cityCode,
                    Destination_Terminal:Data2[i].sI[0].aa.terminal,
        
                }
        
        
                ResponseData.push(
                    new ResponseFormat(
                        `${i}/A2`,
                        2,
                        Data2[i].sI[0].fD.aI.code,
                        Data2[i].sI[0].fD.fN,
                        Data2[i].sI[0].duration,
                        Destination,
                        Origin,
                        null,
                        "Data2 Pricing",
                        new ADDT1(null),
                        new ADDT2(null,null,null,null,null,
                            Data2[i].sI[0].fD.eT,
                            Data2[i].totalPriceList[0].fareIdentifier,
                            Data2[i].totalPriceList[0].id
                        )
        
                    )
                )
            }
        
            return ResponseData;

    }
    if(!Data2)
    {
        let Data1Length = Data1.length;
        for(let i=0; i<Data1Length; i++)
            {
                let Destination =
                {
                    Destination:Data1[i].Segments[0].Destination,
                    Destination_Terminal:Data1[i].Segments[0].Destination_Terminal,
        
                }
                let Origin  = {
                    Origin:Data1[i].Segments[0].Origin,
                    Origin_Terminal:Data1[i].Segments[0].Origin_Terminal,
                }
        
                
               
                ResponseData.push(
                    new ResponseFormat(
                        `${i}/A1`,
                        1 ,
                        Data1[i].Airline_Code  ,
                        Data1[i].Segments[0].Flight_Number ,
                        Data1[i].Segments[0].Duration , Destination , 
                         Origin , Data1[i].TravelDate , Data1[i].Fares[0] ,
                          new ADDT1(null) , 
                          new ADDT2(
                            Data1[i].Fares.Fare_Id ,
                             Data1[i].Fares.Fare_Id ,
                             searchkey ,
                             Data1[i].Flight_Key ,
                             Data1[i].Flight_Id , 
                             null ,
                              null ,
                              null
                        
                        )  
                    )
                
                )
            }

    }
    let Data1Length = Data1.length;
    let Data2Length = Data2.length;

    for(let i=0; i<Data1Length; i++)
    {
        let Destination =
        {
            Destination:Data1[i].Segments[0].Destination,
            Destination_Terminal:Data1[i].Segments[0].Destination_Terminal,

        }
        let Origin  = {
            Origin:Data1[i].Segments[0].Origin,
            Origin_Terminal:Data1[i].Segments[0].Origin_Terminal,
        }

        
       
        ResponseData.push(
            new ResponseFormat(
                `${i}/A1`,
                1 ,
                Data1[i].Airline_Code  ,
                Data1[i].Segments[0].Flight_Number ,
                Data1[i].Segments[0].Duration , Destination , 
                 "Pricing 2",//Origin , Data1[i].TravelDate , Data1[i].Fares[0] ,
                  new ADDT1(null) , 
                  new ADDT2(
                    Data1[i].Fares.Fare_Id ,
                     Data1[i].Fares.Fare_Id ,
                     searchkey ,
                     Data1[i].Flight_Key ,
                     Data1[i].Flight_Id , 
                     null ,
                      null ,
                      null
                
                )  
            )
        
        )
    }
    for(let i=0; i<Data2Length; i++)
    {
        let Destination =
        {
            Destination:Data2[i].sI[0].da.cityCode,
            Destination_Terminal:Data2[i].sI[0].da.terminal,

        }
        let Origin  = {
            Origin:Data2[i].sI[0].aa.cityCode,
            Destination_Terminal:Data2[i].sI[0].aa.terminal,

        }


        ResponseData.push(
            new ResponseFormat(
                `${i}/A2`,
                2,
                Data2[i].sI[0].fD.aI.code,
                Data2[i].sI[0].fD.fN,
                Data2[i].sI[0].duration,
                Destination,
                Origin,
                null,
                "Data2 Pricing",
                new ADDT1(null),
                new ADDT2(null,null,null,null,null,
                    Data2[i].sI[0].fD.eT,
                    Data2[i].totalPriceList[0].fareIdentifier,
                    Data2[i].totalPriceList[0].id
                )

            )
        )
    }

    return ResponseData

}

export {ResponseAdder};