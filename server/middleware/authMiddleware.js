import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "aspirehub-dev-secret-change-in-prod";

export const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token) return res.status(401).json({ message: "Authentication required." });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
