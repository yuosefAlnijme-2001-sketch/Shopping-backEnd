const twilio = require("twilio");
require("dotenv").config();

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsApp = (to, message) => {
  return client.messages.create({
    body: message,
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
  });
};

module.exports = sendWhatsApp;
