import { Router } from "express";
import nodemailer from "nodemailer";
import { ObjectId } from "mongodb";
import { config } from "../config/env.js";
import { getDb } from "../config/db.js";
import {
  buildTemplates,
  mapAttachments,
  buildFlightAdminParams,
  buildLogisticsAdminParams,
} from "../services/emailTemplates.js";
import { attemptWhatsAppTemplate } from "../services/whatsapp.js";

const router = Router();

const buildTransporter = () => {
  const { host, port, user, pass, secure } = config.smtp;
  if (!host || !port || !user || !pass) {
    throw new Error("SMTP environment variables are not fully set");
  }
  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: String(secure || "false").toLowerCase() === "true",
    auth: { user, pass },
  });
};

export const sendEmailHandler = async (req, res) => {
  console.log('[emailRoutes] sendEmailHandler called with formType:', req.body?.formType);
  const { formType, data, attachments = [] } = req.body || {};
  if (!formType || !data) {
    console.error('[emailRoutes] Missing required fields - formType:', formType, 'data:', !!data);
    return res.status(400).json({ success: false, message: "formType and data are required" });
  }

  try {
    let insertedId;
    try {
      const db = await getDb();
      const collectionName = formType === "flight" ? "flightSubmissions" : "logisticsSubmissions";
      const result = await db.collection(collectionName).insertOne({
        formType,
        data,
        attachmentsMetadata: (attachments || []).map((f) => ({ name: f.name, size: f.data?.length || 0 })),
        createdAt: new Date(),
      });
      insertedId = result.insertedId?.toString();
      console.log(
        `[admin] submission stored -> view list: http://localhost:${config.port}/admin/submissions?formType=${encodeURIComponent(
          formType
        )} | record: http://localhost:${config.port}/admin/submissions/${formType}/${insertedId || ""}`
      );
    } catch (dbErr) {
      console.error("Failed to persist submission", dbErr);
    }

    const transporter = buildTransporter();
    const templates = buildTemplates(formType, data);
    const adminTo = config.admin.toEmail || config.smtp.toEmail;
    if (!adminTo) throw new Error("Admin recipient is not configured");

    const mailAttachments = mapAttachments(attachments);

    const sends = [
      transporter.sendMail({
        from: config.smtp.fromEmail || config.smtp.user,
        to: adminTo,
        subject: templates.admin.subject,
        html: templates.admin.html,
        attachments: mailAttachments,
      }),
    ];

    await Promise.all(sends);

    let whatsappAdminStatus = "skipped";
    const adminWhatsAppNumber = config.admin.whatsappNumber;

    if (config.whatsapp.phoneNumberId && config.whatsapp.accessToken && adminWhatsAppNumber) {
      const templateName =
        formType === "flight" ? config.whatsapp.templateAdminFlight : config.whatsapp.templateAdminLogistics;

      if (!templateName) {
        whatsappAdminStatus = "failed: missing admin WhatsApp template name";
      } else {
        const bodyParams =
          formType === "flight" ? buildFlightAdminParams(data).slice(0, 5) : buildLogisticsAdminParams(data);

        const result = await attemptWhatsAppTemplate({
          to: adminWhatsAppNumber,
          templateName,
          bodyParams,
        });
        whatsappAdminStatus = result.success ? "sent" : `failed: ${result.message}`;
      }
    }

    const dashboardPath = `/admin/submissions?formType=${formType}`;
    const dashboardApiUrl = `${req.protocol}://${req.get("host")}${dashboardPath}`;
    const recordPath = insertedId ? `/admin/submissions/${formType}/${insertedId}` : undefined;
    const recordApiUrl = insertedId ? `${req.protocol}://${req.get("host")}${recordPath}` : undefined;

    return res.status(200).json({
      success: true,
      message: "Emails sent",
      emailStatus: "sent",
      whatsappAdminStatus,
      whatsappClientStatus: "skipped",
      dashboardPath,
      dashboardApiUrl,
      recordPath,
      recordApiUrl,
      recordId: insertedId,
    });
  } catch (error) {
    console.error("[emailRoutes] Email send failed:", error);
    console.error("[emailRoutes] Error stack:", error.stack);
    return res.status(500).json({ success: false, message: error?.message || "Email send failed" });
  }
};

export const testWhatsAppHandler = async (req, res) => {
  console.log('[emailRoutes] testWhatsAppHandler called');
  const { formType = "test" } = req.body || {};

  if (!config.whatsapp.phoneNumberId || !config.whatsapp.accessToken || !config.admin.whatsappNumber) {
    console.error('[emailRoutes] WhatsApp configuration missing');
    return res.status(400).json({ success: false, message: "WhatsApp admin configuration missing" });
  }

  try {
    console.log("[whatsapp:test] sending", {
      to: config.admin.whatsappNumber,
      formType,
    });
    const templateName = config.whatsapp.testTemplate;
    if (!templateName) {
      return res.status(400).json({ success: false, message: "WHATSAPP_TEST_TEMPLATE is not configured" });
    }
    const result = await attemptWhatsAppTemplate({
      to: config.admin.whatsappNumber,
      templateName,
      bodyParams: [],
      language: "en_US",
    });
    const status = result.success ? `WhatsApp test message sent (${templateName})` : result.message;
    console.log("[whatsapp:test] template status", { to: config.admin.whatsappNumber, templateName, status });
    if (!result.success) {
      return res.status(500).json({ success: false, message: status });
    }
    return res.status(200).json({ success: true, message: status });
  } catch (error) {
    console.error("[emailRoutes] WhatsApp test send failed:", error);
    console.error("[emailRoutes] Error stack:", error.stack);
    return res.status(500).json({ success: false, message: error?.message || "WhatsApp send failed" });
  }
};

router.post("/api/send-email", sendEmailHandler);
router.post("/api/test-whatsapp", testWhatsAppHandler);

export default router;
