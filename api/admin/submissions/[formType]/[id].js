import { getSubmissionHandler } from "../../../../server/routes/adminRoutes.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
  return getSubmissionHandler(req, res);
}
