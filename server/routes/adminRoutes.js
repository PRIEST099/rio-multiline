import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../config/db.js";

const router = Router();

export const listSubmissionsHandler = async (req, res) => {
  console.log('[adminRoutes] listSubmissionsHandler called with formType:', req.query.formType);
  try {
    const { formType } = req.query;
    if (!formType || !["flight", "logistics"].includes(String(formType))) {
      console.error('[adminRoutes] Invalid formType:', formType);
      return res.status(400).json({ success: false, message: "formType query param must be 'flight' or 'logistics'" });
    }
    const db = await getDb();
    const collectionName = formType === "flight" ? "flightSubmissions" : "logisticsSubmissions";
    const docs = await db
      .collection(collectionName)
      .find({}, { sort: { createdAt: -1 } })
      .limit(50)
      .toArray();
    return res.json({ success: true, formType, count: docs.length, submissions: docs });
  } catch (error) {
    console.error("[adminRoutes] Failed to fetch submissions:", error);
    console.error("[adminRoutes] Error stack:", error.stack);
    return res.status(500).json({ success: false, message: error?.message || "Failed to fetch submissions" });
  }
};

export const getSubmissionHandler = async (req, res) => {
  console.log('[adminRoutes] getSubmissionHandler called with formType:', req.params.formType, 'id:', req.params.id);
  try {
    const { formType, id } = req.params;
    if (!formType || !["flight", "logistics"].includes(String(formType))) {
      console.error('[adminRoutes] Invalid formType:', formType);
      return res.status(400).json({ success: false, message: "formType must be 'flight' or 'logistics'" });
    }
    if (!id) {
      console.error('[adminRoutes] Missing id parameter');
      return res.status(400).json({ success: false, message: "id is required" });
    }
    if (!ObjectId.isValid(id)) {
      console.error('[adminRoutes] Invalid ObjectId:', id);
      return res.status(400).json({ success: false, message: "Invalid submission id" });
    }
    const db = await getDb();
    const collectionName = formType === "flight" ? "flightSubmissions" : "logisticsSubmissions";
    const doc = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ success: false, message: "Submission not found" });
    return res.json({ success: true, submission: doc });
  } catch (error) {
    console.error("[adminRoutes] Failed to fetch submission:", error);
    console.error("[adminRoutes] Error stack:", error.stack);
    return res.status(500).json({ success: false, message: error?.message || "Failed to fetch submission" });
  }
};

router.get("/admin/submissions", listSubmissionsHandler);
router.get("/admin/submissions/:formType/:id", getSubmissionHandler);

export default router;
