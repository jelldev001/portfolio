import { Router } from "express";
import prisma from "../prismaClient.js";
import { requireAuth } from "../middleware/auth.js";
import upload from "../upload.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../cloudinary.js";

const router = Router();

router.get("/", async (req, res) => {
  const images = await prisma.image.findMany({ orderBy: { createdAt: "asc" } });
  res.json(images);
});

router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "image file is required" });
  }
  const { caption } = req.body;
  try {
    const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer);
    const image = await prisma.image.create({
      data: { url, cloudinaryId: publicId, caption: caption || "" },
    });
    res.status(201).json(image);
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

router.put("/:id", requireAuth, upload.single("image"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { caption } = req.body;
  try {
    const existing = await prisma.image.findUnique({ where: { id: id } });
    if (!existing) return res.status(404).json({ message: "Image not found" });

    const data = {};
    if (caption !== undefined) data.caption = caption;

    if (req.file) {
      const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer);
      data.url = url;
      data.cloudinaryId = publicId;
      await deleteFromCloudinary(existing.cloudinaryId);
    }

    const image = await prisma.image.update({ where: { id: id }, data });
    res.json(image);
  } catch (err) {
    console.error("Cloudinary update failed:", err);
    res.status(404).json({ message: "Image not found" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const existing = await prisma.image.findUnique({ where: { id:id } });
    if (!existing) return res.status(404).json({ message: "Image not found" });

    await prisma.image.delete({ where: { id: id } });
    await deleteFromCloudinary(existing.cloudinaryId);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(404).json({ message: "Image not found" });
  }
});

export default router;
