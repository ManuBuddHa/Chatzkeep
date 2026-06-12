import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, default: "" },
    attachments: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["resume", "document", "image"], default: "document" }
      }
    ],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);