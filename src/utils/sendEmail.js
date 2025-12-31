import { nanoid } from "nanoid";

const apiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";
const API_URL = `${apiBase}/api/send-email`;
const API_WHATSAPP_TEST_URL = `${apiBase}/api/test-whatsapp`;

const filesToBase64 = async (files) => {
  if (!files) return [];
  const list = Array.from(files);
  const convert = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name || nanoid(), data: reader.result });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  return Promise.all(list.map(convert));
};

const postEmail = async (payload) => {
  if (!API_URL) {
    console.error('[sendEmail] API URL not configured');
    return { success: false, error: "API URL not configured" };
  }
  try {
    console.log('[sendEmail] Sending email request to:', API_URL);
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      console.error('[sendEmail] Email sending failed - status:', res.status, 'data:', data);
      throw new Error(data.message || "Email sending failed");
    }
    console.log('[sendEmail] Email sent successfully');
    return { success: true, data };
  } catch (error) {
    console.error('[sendEmail] Error during email send:', error);
    return { success: false, error: error.message || "Email sending failed" };
  }
};

export const sendFlightEmail = async (formData) => {
  return postEmail({ formType: "flight", data: formData, attachments: [] });
};

export const sendLogisticsEmail = async (formData) => {
  const attachments = await filesToBase64(formData?.notes?.files);
  return postEmail({ formType: "logistics", data: formData, attachments });
};

export const sendWhatsAppTest = async (formType = "test") => {
  if (!API_WHATSAPP_TEST_URL) {
    console.error('[sendWhatsAppTest] API URL not configured');
    return { success: false, error: "API URL not configured" };
  }
  try {
    console.log('[sendWhatsAppTest] Sending WhatsApp test request to:', API_WHATSAPP_TEST_URL);
    const res = await fetch(API_WHATSAPP_TEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formType }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      console.error('[sendWhatsAppTest] WhatsApp test failed - status:', res.status, 'data:', data);
      throw new Error(data.message || "WhatsApp test failed");
    }
    console.log('[sendWhatsAppTest] WhatsApp test sent successfully');
    return { success: true };
  } catch (error) {
    console.error('[sendWhatsAppTest] Error during WhatsApp test:', error);
    return { success: false, error: error.message || "WhatsApp test failed" };
  }
};
