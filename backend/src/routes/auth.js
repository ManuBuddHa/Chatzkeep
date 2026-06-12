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

// Configure storage configuration for candidate resume documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// 1. Unified Registration Handler Pipeline (With Multi-part Text Parsing Configured)
router.post("/register", upload.single("resume"), async (req, res) => {
  try {
    const { email, password, role, website, phoneNumber, address, city, state, pincode, firstName } = req.body;
    
    // Strict multi-step form parameter verification
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Registration failure: Email parameter is required." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Registration failure: Password must be at least 6 characters long." });
    }
    if (!address || !city || !state || !pincode) {
      return res.status(400).json({ message: "Registration failure: Missing mandatory location demographic fields." });
    }

    const cleanEmail = email.trim().toLowerCase();
    
    // Enforce email uniqueness constraint across collection indexes
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: "This email address is already bound to another profile workspace." });
    }

    // Secure Password Hashing Flow using Salt Factors
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Default display string parsing
    const derivedName = firstName ? firstName.trim() : cleanEmail.split('@')[0].toUpperCase();

    // Map attachment URL if profile file is dispatched from request payload
    let uploadedResumeUrl = "";
    if (req.file) {
      uploadedResumeUrl = `/uploads/${req.file.filename}`;
    }

    const user = await User.create({
      role: role || "recruiter",
      firstName: derivedName,
      email: cleanEmail,
      passwordHash, 
      website: website ? website.trim() : "",
      phoneNumber: phoneNumber ? phoneNumber.trim() : "",
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      title: role === "candidate" ? derivedName : "Healthcare Facility Recruiter",
      resumeUrl: uploadedResumeUrl
    });

    // Create session signature payload tokens
    const token = signToken({ id: user._id, email: user.email, role: user.role });
    
    res.status(201).json({
      token,
      user: { id: user._id, role: user.role, firstName: user.firstName, email: user.email }
    });
  } catch (err) {
    console.error("Backend register mapping compilation crash:", err);
    res.status(500).json({ message: "Internal server data compilation exception." });
  }
});

// 2. Secured Login Session Matrix Endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Both email and password data strings must be supplied." });
    }

    // Locate matching credentials document
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    // Validate incoming text password parameter against stored salted bcrypt hashes
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials." });

    const token = signToken({ id: user._id, email: user.email, role: user.role });
    
    res.json({
      token,
      user: { id: user._id, role: user.role, firstName: user.firstName, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server processing exception." });
  }
});

export default router;