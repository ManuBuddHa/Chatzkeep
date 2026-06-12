import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["recruiter", "candidate"], default: "recruiter" },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, default: "", trim: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    
    // Aligned dataset parameters mapped explicitly from task PDF screens
    website: { type: String, default: "", trim: true },
    phoneNumber: { type: String, default: "", trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    
    // Resume file storage destination link string
    resumeUrl: { type: String, default: "" }, 
    
    avatarUrl: { type: String, default: "" },
    title: { type: String, default: "" },
    notificationsEnabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);