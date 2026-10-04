import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import skillRoutes from "./routes/skills.js";
import languageRoutes from "./routes/languages.js";
import imageRoutes from "./routes/images.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/images", imageRoutes);

app.use((err, req, res, next) => {
  console.error(`Unhandled request error: ${req.method} ${req.originalUrl}`, err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
