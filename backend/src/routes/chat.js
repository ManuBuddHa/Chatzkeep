import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { authRequired } from "../middleware/auth.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { Notification } from "../models/Notification.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `msg-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.get("/conversations", authRequired, async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user.id })
    .populate("participants", "firstName lastName avatarUrl role organization title")
    .sort({ updatedAt: -1 });
  res.json(conversations);
});

router.get("/conversations/:id/messages", authRequired, async (req, res) => {
  const messages = await Message.find({ conversation: req.params.id })
    .populate("sender", "firstName lastName avatarUrl")
    .sort({ createdAt: 1 });
  res.json(messages);
});

// Single Unified Controller Strategy: Message creation through both REST and WebSockets safely
router.post("/conversations/:id/messages", authRequired, upload.single("attachment"), async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { text } = req.body;

    const convo = await Conversation.findById(conversationId);
    if (!convo || !convo.participants.includes(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized interaction with this chat room." });
    }

    const attachments = [];
    if (req.file) {
      attachments.push({
        url: `/uploads/${req.file.filename}`,
        type: req.file.mimetype.startsWith("image/") ? "image" : "document"
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      text,
      attachments,
      readBy: [req.user.id]
    });

    convo.lastMessage = text || (attachments.length ? "Sent an attachment" : "");
    convo.lastMessageAt = new Date();
    await convo.save();

    const populated = await message.populate("sender", "firstName lastName avatarUrl");

    // Secure Pipeline Push: Broadcast updates using IO instances securely inside endpoints
    const io = req.app.get("io");
    io.to(`conversation:${conversationId}`).emit("newMessage", populated);

    // Track active notifications
    const recipients = convo.participants.filter(p => p.toString() !== req.user.id);
    for (const rec of recipients) {
      const notif = await Notification.create({
        user: rec,
        type: "new_message",
        title: `New Message from ${populated.sender.firstName}`,
        body: text || "Sent an attachment",
        data: { conversationId }
      });
      io.to(rec.toString()).emit("notification", notif);
    }

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to dispatch message reliably." });
  }
});

router.post("/conversations", authRequired, async (req, res) => {
  const { participantId } = req.body;
  let convo = await Conversation.findOne({
    participants: { $all: [req.user.id, participantId] }
  });
  if (!convo) {
    convo = await Conversation.create({ participants: [req.user.id, participantId] });
  }
  res.status(201).json(convo);
});

export default router;