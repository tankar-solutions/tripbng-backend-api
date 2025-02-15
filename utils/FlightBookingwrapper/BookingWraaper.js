const Api1BookingConverter = (data) => {
    const Template1 = {
        "Customer_Mobile": data.mobile_number || "",
        "Passenger_Mobile": data.mobile_number || "",
        "Passenger_Email": data.email || "",
        "PAX_Details": [],
        "GST": data.GstDetails?.is_gst || false,
        "GST_Number": data.GstDetails?.gst_number || "",
        "GST_HolderName": data.GstDetails?.gst_holder_name || "",
        "GST_Address": data.GstDetails?.address || "",
        "BookingFlightDetails": [
            {
                "Search_Key": data.search_key || "",
                "Flight_Key": data.flight_key || "",
                "BookingSSRDetails": [
                    {
                        "SSR_Key": data.ssr_key || ""
                    }
                ]
            }
        ],
        "BookingRemark": data.booking_remark || ""
    };

    if (Array.isArray(data.pax_details)) { 
        for (let i = 0; i < data.pax_details.length; i++) { 
            console.log("Pax details:", data.pax_details[i]);
            Template1.PAX_Details.push(data.pax_details[i]); 
        }
    } else {
        console.error("pax_details is not an array!");
    }

    return Template1;
};


const Api2BookingConverter = (data) => {
    const Template2 = {
        "Id": data.Id,
        "bookingId": "",
        "paymentInfos": [
            {
                "amount": data.amount || ""
            }
        ],
        "travellerInfo": [],
        "gstInfo": {
            "gstNumber": data.GstDetails?.gst_number || "07ZZAS7YY6XXZF",
            "email": data.email || "apitest@apitest.com",
            "registeredName": data.GstDetails?.gst_holder_name || "XYZ Pvt Ltd",
            "mobile": data.mobile_number || "9728408906",
            "address": data.GstDetails?.address || "Delhi"
        },
        "deliveryInfo": {
            "emails": [data.email],
            "contacts": [data.mobile_number]
        }
    };

    console.log("Pax details:", data.pax_details);

    if (Array.isArray(data.pax_details)) { // Ensure pax_details is an array
        for (let i = 0; i < data.pax_details.length; i++) { // Use .length
            console.log("Pax details:", data.pax_details[i]);
            Template2.travellerInfo.push(data.pax_details[i]);
        }
    } else {
        console.error("pax_details is not an array!");
    }

    return Template2;
};


export {Api1BookingConverter , Api2BookingConverter}