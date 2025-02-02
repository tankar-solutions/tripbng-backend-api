class ResponseFormat {
    constructor(ApiId,ApiNo, AirlineCode, FlightNumber, Duration, Destination, Arriving, TDate, Amount = null, Additional1, Additional2) {
         this.ApiId = ApiId; //generate Automatic
         this.ApiNo = ApiNo; // If Data From Api 1 Then ->1 otherwise 2
         this.AirlineCode = AirlineCode; 
         this.FlightNumber = FlightNumber;
         this.Duration = Duration; // Give in Hours
         this.Destination = Destination; //object
         this.Origin = Arriving; //object
         this.TDate = TDate; //Travel Data
         this.Amount= Amount; //Amount Schema 
         this.Additional1 = Additional1; // creating using ADDT1
         this.Additional2 = Additional2; //creating using ADDT2
    }
}
export {ResponseFormat};