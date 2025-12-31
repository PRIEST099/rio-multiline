import axios from "axios";
import { config } from "../config/env.js";

export const sendWhatsAppMessage = async (to, messageText) => {
  const { phoneNumberId, accessToken } = config.whatsapp;
  if (!phoneNumberId || !accessToken) {
    throw new Error("WhatsApp credentials are not configured");
  }
  if (!to) {
    throw new Error("WhatsApp recipient is missing");
  }

  const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: messageText },
  };

  try {
    const resp = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("[whatsapp] api response", resp.data);
    return { success: true, data: resp.data };
  } catch (err) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    const detail = data ? JSON.stringify(data) : err?.message;
    throw new Error(`WhatsApp API error${status ? ` ${status}` : ""}: ${detail}`);
  }
};

export const sendWhatsAppTemplate = async ({ to, templateName, language = "en", bodyParams = [] }) => {
  const { phoneNumberId, accessToken } = config.whatsapp;
  if (!phoneNumberId || !accessToken) {
    throw new Error("WhatsApp credentials are not configured");
  }
  if (!to) {
    throw new Error("WhatsApp recipient is missing");
  }
  if (!templateName) {
    throw new Error("WhatsApp template name is missing");
  }

  const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: language },
      components: bodyParams.length
        ? [
            {
              type: "body",
              parameters: bodyParams.map((text) => ({ type: "text", text })),
            },
          ]
        : undefined,
    },
  };

  try {
    const resp = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("[whatsapp:template] api response", resp.data);
    return { success: true, data: resp.data };
  } catch (err) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    const detail = data ? JSON.stringify(data) : err?.message;
    throw new Error(`WhatsApp template error${status ? ` ${status}` : ""}: ${detail}`);
  }
};

export const attemptWhatsApp = async (to, messageText) => {
  try {
    console.log("[whatsapp] attempting send", {
      to,
      preview: String(messageText || "").slice(0, 140),
    });
    await sendWhatsAppMessage(to, messageText);
    console.log("[whatsapp] send success", { to });
    return { success: true };
  } catch (error) {
    console.error("WhatsApp send failed", error);
    return { success: false, message: error?.message };
  }
};

export const attemptWhatsAppTemplate = async ({ to, templateName, bodyParams = [], language }) => {
  try {
    console.log("[whatsapp:template] attempting send", {
      to,
      templateName,
      preview: bodyParams.map((t) => String(t).slice(0, 80)),
    });
    await sendWhatsAppTemplate({ to, templateName, bodyParams, language });
    console.log("[whatsapp:template] send success", { to, templateName });
    return { success: true };
  } catch (error) {
    console.error("WhatsApp template send failed", error);
    return { success: false, message: error?.message };
  }
};
