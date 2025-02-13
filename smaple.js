import axios from "axios"
async function fetchHotelDetails(hotelId, channelId) {
    const url = "https://nexus.prod.zentrumhub.com/api/content/hotelcontent/getHotelContent";
    
    const headers = {
        "Content-Type": "application/json",
        "accountId": "zentrum-demo-account",  // Add your account ID here
        "customer-ip": "49.34.97.68", // Add customer IP here
        "correlationId": "00f49a21-b0b4-2712-4c47-41caef8c3c26", // Add correlation ID here
        "apiKey": "4477a62d-2bb6-4392-896a-3f5270962dbc" // Add your API key here
    };
    
    const requestBody = {
        "hotelIds": [hotelId],
        "channelId": channelId,
        "culture": "en-US",
        "contentFields": ["All"],
        "useIcePortalImages": true,
        "useTrustYouReview": true,
        "opinionatedContent": true
    };
    
    try {
        const response = await axios.post(url, requestBody, { headers });
        return response.data;
    } catch (error) {
        console.error("Error fetching hotel details:", error.response ? error.response.data : error.message);
        throw new Error("Failed to fetch hotel details");
    }
}

// Example usage
            fetchHotelDetails("154357", "client-demo-channel")
    .then(data => console.log("Hotel Data:", data))
    .catch(err => console.error("Error:", err.message));