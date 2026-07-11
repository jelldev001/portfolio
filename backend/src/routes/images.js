import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../prismaClient.js";
import { requireAuth } from "../middleware/auth.js";
import upload from "../upload.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "..", "uploads");

const router = Router();

// Public - list all images
router.get("/", async (req, res) => {
  const images = await prisma.image.findMany({ orderBy: { createdAt: "asc" } });
  res.json(images);
});

// Admin only - create (upload a file from disk, field name: "image")
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "image file is required" });
  }
  const { caption } = req.body;
  const image = await prisma.image.create({
    data: { url: `/uploads/${req.file.filename}`, caption: caption || "" },
  });
  res.status(201).json(image);
});

// Admin only - update (optionally replace the file, and/or update caption)
router.put("/:id", requireAuth, upload.single("image"), async (req, res) => {
  const { caption } = req.body;
  try {
    const existing = await prisma.image.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Image not found" });

    const data = {};
    if (caption !== undefined) data.caption = caption;

    if (req.file) {
      data.url = `/uploads/${req.file.filename}`;
      // ลบไฟล์เก่าออกจากดิสก์ถ้ามี
      const oldPath = path.join(uploadDir, path.basename(existing.url));
      fs.unlink(oldPath, () => {});
    }

    const image = await prisma.image.update({ where: { id: req.params.id }, data });
    res.json(image);
  } catch (err) {
    res.status(404).json({ message: "Image not found" });
  }
});

// Admin only - delete (also removes file from disk)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const existing = await prisma.image.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Image not found" });

    await prisma.image.delete({ where: { id: req.params.id } });

    const filePath = path.join(uploadDir, path.basename(existing.url));
    fs.unlink(filePath, () => {});

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(404).json({ message: "Image not found" });
  }
});

export default router;
