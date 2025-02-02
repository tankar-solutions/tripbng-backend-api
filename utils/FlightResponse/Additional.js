class ADDT1{
    constructor(BageC =null)
    {
        this.BageC = BageC
    }
}

class ADDT2{
    constructor(FareId =null , SeatAvailable =null,SearchKey =null, FlightKey =null , FlightId =null, AirLineEquipmentType =null,FareIdentiFier=null , ID=null)
    {
       this.FareId = FareId;
       this.SeatAvailable = SeatAvailable;
       this.SearchKey = SearchKey;
       this.FlightKey = FlightKey;
       this.FlightId = FlightId,
       this.AirLineEquipmentType = AirLineEquipmentType;
       this.FareIdentiFier = FareIdentiFier;
       this.ID = ID
    }
}

export {ADDT1 , ADDT2}