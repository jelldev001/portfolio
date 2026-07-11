import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

// POST /api/auth/login
// Body: { username, password }
// Simple credential check against ADMIN_USERNAME / ADMIN_PASSWORD in .env
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const validUser = username === process.env.ADMIN_USERNAME;
  const validPass = password === process.env.ADMIN_PASSWORD;

  if (!validUser || !validPass) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  res.json({ token, username });
});

export default router;
