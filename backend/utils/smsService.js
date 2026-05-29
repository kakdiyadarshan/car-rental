const twilio = require("twilio");

const sendSMS = async (to, body) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    console.log("SMS Sent Successfully 📱");
  } catch (error) {
    console.error("SMS Error ❌", error.message);
  }
};

module.exports = sendSMS;
