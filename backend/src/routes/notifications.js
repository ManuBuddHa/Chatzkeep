import express from "express";
import { authRequired } from "../middleware/auth.js";
import { Notification } from "../models/Notification.js";

const router = express.Router();

router.get("/", authRequired, async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notifications);
});

router.post("/read-all", authRequired, async (req, res) => {
  await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
  res.json({ success: true });
});

export default router;