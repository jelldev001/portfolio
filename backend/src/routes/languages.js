import { Router } from "express";
import prisma from "../prismaClient.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const VALID_LEVELS = ["basic", "advanced", "native"];

function normalizeLevel(level) {
  if (level === undefined || level === null || level === "") return null;
  if (!VALID_LEVELS.includes(level)) {
    throw new Error(`level must be one of: ${VALID_LEVELS.join(", ")}`);
  }
  return level;
}

// Public - list all languages
router.get("/", async (req, res) => {
  const languages = await prisma.language.findMany({ orderBy: { createdAt: "asc" } });
  res.json(languages);
});

// Admin only - create
router.post("/", requireAuth, async (req, res) => {
  const { name, level } = req.body;
  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }
  try {
    const language = await prisma.language.create({
      data: { name, level: normalizeLevel(level) },
    });
    res.status(201).json(language);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin only - update
router.put("/:id", requireAuth, async (req, res) => {
  const { name, level } = req.body;
  try {
    const language = await prisma.language.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(level !== undefined ? { level: normalizeLevel(level) } : {}),
      },
    });
    res.json(language);
  } catch (err) {
    if (err.message.includes("level must be")) {
      return res.status(400).json({ message: err.message });
    }
    res.status(404).json({ message: "Language not found" });
  }
});

// Admin only - delete
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await prisma.language.delete({ where: { id: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(404).json({ message: "Language not found" });
  }
});

export default router;
