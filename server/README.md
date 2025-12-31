# Server Directory

This directory contains the backend logic for the application, designed to work with **serverless functions** on Vercel.

## Architecture

The server code is organized into reusable handlers that are imported by Vercel serverless functions in the `/api` directory. This allows the same business logic to work in both local development and serverless deployment.

### Directory Structure

```
server/
├── config/          # Configuration and environment variables
│   ├── db.js        # MongoDB database connection
│   └── env.js       # Environment configuration
├── routes/          # Request handlers (not Express routes, but handler functions)
│   ├── adminRoutes.js    # Admin dashboard handlers
│   └── emailRoutes.js    # Email and WhatsApp handlers
├── services/        # Business logic services
│   ├── emailTemplates.js # Email template builder
│   └── whatsapp.js       # WhatsApp messaging service
├── templates/       # Email templates
├── utils/           # Utility functions
└── README.md        # This file
```

## Serverless Functions

The handlers in this directory are called by Vercel serverless functions located in the `/api` directory:

- `/api/send-email.js` → calls `sendEmailHandler` from `routes/emailRoutes.js`
- `/api/test-whatsapp.js` → calls `testWhatsAppHandler` from `routes/emailRoutes.js`
- `/api/admin/submissions/index.js` → calls `listSubmissionsHandler` from `routes/adminRoutes.js`
- `/api/admin/submissions/[formType]/[id].js` → calls `getSubmissionHandler` from `routes/adminRoutes.js`

## Local Development

For local development, you can still run `index.js` which sets up an Express server that uses the same handlers. However, on Vercel, the `/api` directory functions are used instead.

## Key Features

- **Serverless-first**: All handlers are designed to work in a serverless environment
- **CORS enabled**: All API endpoints support CORS for frontend integration
- **Error logging**: Comprehensive console error logging throughout all handlers
- **MongoDB integration**: Persists form submissions to MongoDB
- **Email sending**: Uses Nodemailer to send emails via SMTP
- **WhatsApp integration**: Optional WhatsApp notifications via Meta's Business API

## Environment Variables

Required environment variables (see `.env` or Vercel environment settings):

```env
# SMTP Configuration
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM_EMAIL=
SMTP_TO_EMAIL=
SMTP_SECURE=

# MongoDB
MONGODB_URI=

# Admin Configuration
ADMIN_EMAIL=
ADMIN_WHATSAPP_NUMBER=

# WhatsApp (optional)
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_TEMPLATE_ADMIN_FLIGHT=
WHATSAPP_TEMPLATE_ADMIN_LOGISTICS=
WHATSAPP_TEST_TEMPLATE=
```

## Notes

- The `index.js` file in this directory is NOT used in production on Vercel
- All production requests go through the `/api` serverless functions
- Keep this directory for organizing backend logic and local development
