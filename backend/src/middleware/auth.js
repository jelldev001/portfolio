import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.headers?.authorization || "";
  const match = header.match(/^\s*Bearer\s+(.+)$/i);
  const token = match? match[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
