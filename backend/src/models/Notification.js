import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["new_message", "profile_view", "system"], required: true },
    title: { type: String, required: true },
    body: { type: String, default: "" },
    data: { type: Object, default: {} },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);