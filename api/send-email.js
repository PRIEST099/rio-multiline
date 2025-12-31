import { sendEmailHandler } from "../server/routes/emailRoutes.js";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    console.error('[API /api/send-email] Method not allowed:', req.method);
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    console.log('[API /api/send-email] Processing request');
    return await sendEmailHandler(req, res);
  } catch (error) {
    console.error('[API /api/send-email] Unexpected error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
