import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["recruiter", "candidate"], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    title: { type: String, default: "" },
    organization: { type: String, default: "" },
    bio: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    location: { type: String, default: "" },
    notificationsEnabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);