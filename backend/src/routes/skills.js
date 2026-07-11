import { Router } from "express";
import prisma from "../prismaClient.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const VALID_LEVELS = ["basic", "advanced", "expert"];

function normalizeLevel(level) {
  // level เป็น optional: ไม่ส่งมา / ส่ง "" / ส่ง null => เก็บเป็น null (ไม่ระบุ)
  if (level === undefined || level === null || level === "") return null;
  if (!VALID_LEVELS.includes(level)) {
    throw new Error(`level must be one of: ${VALID_LEVELS.join(", ")}`);
  }
  return level;
}

// Public - list all skills
router.get("/", async (req, res) => {
  const skills = await prisma.skill.findMany({ orderBy: { createdAt: "asc" } });
  res.json(skills);
});

// Admin only - create
router.post("/", requireAuth, async (req, res) => {
  const { name, category, level } = req.body;
  if (!name || !category) {
    return res.status(400).json({ message: "name and category are required" });
  }
  try {
    const skill = await prisma.skill.create({
      data: { name, category, level: normalizeLevel(level) },
    });
    res.status(201).json(skill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin only - update
router.put("/:id", requireAuth, async (req, res) => {
  const { name, category, level } = req.body;
  try {
    const skill = await prisma.skill.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(level !== undefined ? { level: normalizeLevel(level) } : {}),
      },
    });
    res.json(skill);
  } catch (err) {
    if (err.message.includes("level must be")) {
      return res.status(400).json({ message: err.message });
    }
    res.status(404).json({ message: "Skill not found" });
  }
});

// Admin only - delete
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await prisma.skill.delete({ where: { id: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(404).json({ message: "Skill not found" });
  }
});

export default router;
