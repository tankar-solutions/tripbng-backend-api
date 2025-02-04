import twilio from "twilio"



async function sendSMS(message , phone)
{
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const rp = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
    });
    
    return rp;
    
}

export {sendSMS}