import { testWhatsAppHandler } from "../server/routes/emailRoutes.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
  return testWhatsAppHandler(req, res);
}
