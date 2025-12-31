import { listSubmissionsHandler } from "../../../server/routes/adminRoutes.js";

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

  if (req.method !== "GET") {
    console.error('[API /api/admin/submissions] Method not allowed:', req.method);
    res.setHeader("Allow", "GET");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    console.log('[API /api/admin/submissions] Processing request for formType:', req.query.formType);
    return await listSubmissionsHandler(req, res);
  } catch (error) {
    console.error('[API /api/admin/submissions] Unexpected error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
