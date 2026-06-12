import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.post("/register", upload.single("resume"), async (req, res) => {
  try {
    const { role, firstName, lastName, email, password, title, organization, bio, location } = req.body;
    if (!role || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Required fields missing." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(499).json({ message: "Email already registered." });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const user = await User.create({
      role, firstName, lastName, email, passwordHash, title, organization, bio, location, resumeUrl
    });

    const token = signToken({ id: user._id, email: user.email, role: user.role });
    res.status(201).json({
      token,
      user: { id: user._id, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server registration error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials." });

    const token = signToken({ id: user._id, email: user.email, role: user.role });
    res.json({
      token,
      user: { id: user._id, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error." });
  }
});

export default router;