import express from "express";
import cors from "cors";

import { config } from "./config/env.js";
import emailRoutes from "./routes/emailRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" }));

app.use(emailRoutes);
app.use(adminRoutes);

app.post("/api/submit-form", (_req, res) => {
	return res.status(410).json({ success: false, message: "Use /api/send-email" });
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(config.port, () => {
	console.log(`Email server listening on port ${config.port}`);
});

