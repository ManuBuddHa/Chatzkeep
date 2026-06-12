import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";

const router = express.Router();

// 1. Unified Registration Handler Pipeline
router.post("/register", async (req, res) => {
  try {
    const { email, password, role, website, phoneNumber, address, city, state, pincode, firstName } = req.body;
    
    // Strict multi-step form parameter checking
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Registration failure: Email is required." });
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

    const user = await User.create({
      role: role || "recruiter",
      firstName: derivedName,
      email: cleanEmail,
      passwordHash, // Securely storing the cryptographically hashed password parameter[cite: 1]
      website: website ? website.trim() : "",
      phoneNumber: phoneNumber ? phoneNumber.trim() : "",
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      title: role === "candidate" ? derivedName : "Healthcare Facility Recruiter"
    });

    // Create session signature payload tokens
    const token = signToken({ id: user._id, email: user.email, role: user.role });
    
    res.status(201).json({
      token,
      user: { id: user._id, role: user.role, firstName: user.firstName, email: user.email }
    });
  } catch (err) {
    console.error("Backend register mapping compilation crash:", err);
    res.status(500).json({ message: "Internal server data compilation or connection handling exception." });
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