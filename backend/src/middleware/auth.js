import { verifyToken } from "../utils/jwt.js";

export const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Contains id, email, role
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};