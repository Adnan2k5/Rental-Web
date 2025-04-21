import twilio from 'twilio';

// Singleton pattern to reuse the client
let twilioClient = null;

export const initTwilio = () => {
    if (twilioClient) return twilioClient;
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
        throw new Error('Twilio credentials are missing in environment variables');
    }

    twilioClient = twilio(accountSid, authToken);
    return twilioClient;
}

export const sendSMS = async (phoneNumber, messageBody, fromNumber = process.env.TWILIO_PHONE_NUMBER) => {
    try {
        if (!phoneNumber || !messageBody) {
            throw new Error('Phone number and message body are required');
        }

        const client = initTwilio();
        
        const message = await client.messages.create({
            body: messageBody,
            from: fromNumber,
            to: phoneNumber,
        });

        return { success: true, message };
    }
    catch(e) {
        console.error("Error sending SMS:", e);
        return { 
            success: false, 
            error: e.message,
            code: e.code || 'UNKNOWN_ERROR'
        };
    }
}