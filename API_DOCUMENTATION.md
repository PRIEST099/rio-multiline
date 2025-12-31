# API Documentation

This document describes the serverless API endpoints available in this application.

## Base URL

- **Local Development**: `http://localhost:5173/api` (when using Vite dev server with proxy)
- **Production**: `https://your-domain.vercel.app/api`

All endpoints are serverless functions deployed on Vercel.

## Endpoints

### 1. Send Email (Form Submission)

**Endpoint**: `POST /api/send-email`

**Description**: Submits a flight ticketing or logistics quotation form. Sends emails to admin and stores the submission in MongoDB.

**Request Body**:
```json
{
  "formType": "flight" | "logistics",
  "data": {
    // Form-specific data object
  },
  "attachments": [
    {
      "name": "file.pdf",
      "data": "base64-encoded-file-content"
    }
  ]
}
```

**Response** (Success):
```json
{
  "success": true,
  "message": "Emails sent",
  "emailStatus": "sent",
  "whatsappAdminStatus": "sent" | "skipped" | "failed: reason",
  "whatsappClientStatus": "skipped",
  "dashboardPath": "/admin/submissions?formType=flight",
  "dashboardApiUrl": "https://domain.com/admin/submissions?formType=flight",
  "recordPath": "/admin/submissions/flight/65a1b2c3d4e5f6g7h8i9j0k1",
  "recordApiUrl": "https://domain.com/admin/submissions/flight/65a1b2c3d4e5f6g7h8i9j0k1",
  "recordId": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Response** (Error):
```json
{
  "success": false,
  "message": "Error description"
}
```

**Status Codes**:
- `200`: Success
- `400`: Bad request (missing formType or data)
- `500`: Server error (email send failed, database error, etc.)

---

### 2. Test WhatsApp

**Endpoint**: `POST /api/test-whatsapp`

**Description**: Sends a test WhatsApp message to the configured admin number.

**Request Body**:
```json
{
  "formType": "test" | "flight" | "logistics"
}
```

**Response** (Success):
```json
{
  "success": true,
  "message": "WhatsApp test message sent (template_name)"
}
```

**Response** (Error):
```json
{
  "success": false,
  "message": "WhatsApp admin configuration missing"
}
```

**Status Codes**:
- `200`: Success
- `400`: Bad request (configuration missing)
- `500`: Server error

---

### 3. List Submissions

**Endpoint**: `GET /api/admin/submissions?formType={flight|logistics}`

**Description**: Retrieves a list of form submissions from MongoDB.

**Query Parameters**:
- `formType` (required): Either "flight" or "logistics"

**Response** (Success):
```json
{
  "success": true,
  "formType": "flight",
  "count": 42,
  "submissions": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "formType": "flight",
      "data": { /* form data */ },
      "attachmentsMetadata": [
        {
          "name": "document.pdf",
          "size": 12345
        }
      ],
      "createdAt": "2025-12-31T12:00:00.000Z"
    }
    // ... more submissions
  ]
}
```

**Response** (Error):
```json
{
  "success": false,
  "message": "formType query param must be 'flight' or 'logistics'"
}
```

**Status Codes**:
- `200`: Success
- `400`: Bad request (invalid formType)
- `500`: Server error

---

### 4. Get Submission Details

**Endpoint**: `GET /api/admin/submissions/{formType}/{id}`

**Description**: Retrieves a single submission by ID.

**Path Parameters**:
- `formType`: Either "flight" or "logistics"
- `id`: MongoDB ObjectId of the submission

**Response** (Success):
```json
{
  "success": true,
  "submission": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "formType": "flight",
    "data": { /* full form data */ },
    "attachmentsMetadata": [],
    "createdAt": "2025-12-31T12:00:00.000Z"
  }
}
```

**Response** (Error):
```json
{
  "success": false,
  "message": "Submission not found"
}
```

**Status Codes**:
- `200`: Success
- `400`: Bad request (invalid formType or id)
- `404`: Submission not found
- `500`: Server error

---

## CORS

All API endpoints support CORS with the following headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, PATCH, DELETE`
- `Access-Control-Allow-Headers: X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version`
- `Access-Control-Allow-Credentials: true`

OPTIONS requests are handled automatically for preflight.

---

## Error Handling

All endpoints include comprehensive error logging to the console (visible in Vercel Function Logs):

```javascript
console.error('[API /api/send-email] Error description:', error);
console.error('[API /api/send-email] Error stack:', error.stack);
```

Frontend applications also log errors:

```javascript
console.error('[sendEmail] Error during email send:', error);
```

This makes debugging easier in both development and production environments.

---

## Environment Variables

The API requires the following environment variables to be configured in Vercel:

### Required
- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `SMTP_FROM_EMAIL` - From email address
- `SMTP_TO_EMAIL` - Default admin recipient email
- `MONGODB_URI` - MongoDB connection string
- `ADMIN_EMAIL` - Admin email address

### Optional
- `SMTP_SECURE` - Use TLS (true/false)
- `ADMIN_WHATSAPP_NUMBER` - Admin WhatsApp number for notifications
- `WHATSAPP_PHONE_NUMBER_ID` - Meta WhatsApp Business Phone Number ID
- `WHATSAPP_ACCESS_TOKEN` - Meta WhatsApp Business API access token
- `WHATSAPP_TEMPLATE_ADMIN_FLIGHT` - WhatsApp template name for flight notifications
- `WHATSAPP_TEMPLATE_ADMIN_LOGISTICS` - WhatsApp template name for logistics notifications
- `WHATSAPP_TEST_TEMPLATE` - WhatsApp template name for test messages

---

## Rate Limits

Vercel serverless functions have the following limits:
- **Execution time**: 10 seconds (configured in vercel.json)
- **Memory**: 1024 MB (configured in vercel.json)
- **Payload size**: 4.5 MB for request body

---

## Testing

### Using cURL

```bash
# Test email submission
curl -X POST https://your-domain.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "flight",
    "data": {
      "tripInformation": {
        "tripType": "one-way",
        "departureAirport": "JFK",
        "destinationAirport": "LHR",
        "departureDate": "2025-12-31"
      }
    }
  }'

# Test WhatsApp
curl -X POST https://your-domain.vercel.app/api/test-whatsapp \
  -H "Content-Type: application/json" \
  -d '{"formType": "test"}'

# List submissions
curl "https://your-domain.vercel.app/api/admin/submissions?formType=flight"

# Get submission details
curl "https://your-domain.vercel.app/api/admin/submissions/flight/65a1b2c3d4e5f6g7h8i9j0k1"
```

### Using the Frontend

The frontend automatically uses these API endpoints through:
- `src/utils/sendEmail.js` - For form submissions and WhatsApp tests
- `src/pages/SubmissionsDashboard.jsx` - For listing submissions
- `src/pages/SubmissionDetail.jsx` - For viewing submission details

---

## Monitoring

To monitor your serverless functions:

1. **Vercel Dashboard**: Go to your project → Functions tab
2. **View Logs**: Click on any function to see real-time logs
3. **Check Errors**: All errors are logged with `console.error()` and include stack traces

---

## Troubleshooting

### "API URL not configured" error
- Set `VITE_API_BASE_URL` or `VITE_API_URL` in your frontend environment
- For local dev: Usually empty string or "http://localhost:5173"
- For production: Your Vercel domain or empty string

### "SMTP environment variables are not fully set"
- Ensure all SMTP_* variables are configured in Vercel

### "Failed to persist submission"
- Check MongoDB connection string
- Verify MongoDB cluster allows connections from Vercel IPs (0.0.0.0/0 in network access)

### Function timeout
- Default is 10 seconds, configured in vercel.json
- Large email attachments or slow SMTP servers may cause timeouts
- Consider increasing maxDuration in vercel.json if needed
