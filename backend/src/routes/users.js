import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { authRequired } from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// 1. Dynamic Directory User Search Endpoint
router.get("/search", authRequired, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const users = await User.find({
      _id: { $ne: req.user.id }, 
      $or: [
        { firstName: { $regex: q, $options: "i" } },
        { lastName: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ]
    })
    .select("firstName lastName email title organization avatarUrl")
    .limit(10);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to query system directory user registry logs." });
  }
});

// 2. Identity Resource Profile Self Fetch Target
router.get("/me", authRequired, async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  res.json(user);
});

// 3. Identity Resource Update Endpoint
router.put("/me", authRequired, upload.fields([{ name: "avatar", maxCount: 1 }, { name: "resume", maxCount: 1 }]), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files?.avatar?.[0]) updates.avatarUrl = `/uploads/${req.files.avatar[0].filename}`;
    if (req.files?.resume?.[0]) updates.resumeUrl = `/uploads/${req.files.resume[0].filename}`;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-passwordHash");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed updating identity resource profiles." });
  }
});

export default router;