import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    toEmail: process.env.SMTP_TO_EMAIL,
    fromEmail: process.env.SMTP_FROM_EMAIL,
  },
  admin: {
    toEmail: process.env.TO_EMAIL,
    whatsappNumber: process.env.ADMIN_WHATSAPP_NUMBER,
  },
  whatsapp: {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    testTemplate: process.env.WHATSAPP_TEST_TEMPLATE,
    templateAdminFlight: process.env.WHATSAPP_TEMPLATE_ADMIN_FLIGHT,
    templateAdminLogistics: process.env.WHATSAPP_TEMPLATE_ADMIN_LOGISTICS,
  },
  mongoUri: process.env.MONGODB_URI,
};
