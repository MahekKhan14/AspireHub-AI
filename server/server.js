import "./loadEnv.js"; // must be first
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import { connectDatabase } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.json({ status: "AspireHub AI API running." }));

app.use("/auth", authRoutes);
app.use("/mentor", mentorRoutes);
app.use("/career", careerRoutes);

app.use((err, _req, res, _next) => {
  console.error("Global error:", err);
  res.status(500).json({ message: "Internal server error." });
});

const start = async () => {
  await connectDatabase();
  app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
};

start();