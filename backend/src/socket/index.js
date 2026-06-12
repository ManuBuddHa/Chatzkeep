import { verifyToken } from "../utils/jwt.js";
import { Conversation } from "../models/Conversation.js";

export const registerSocketHandlers = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication authorization payload parsing failed."));
    try {
      socket.user = verifyToken(token);
      next();
    } catch (err) {
      next(new Error("Authentication token validation lifecycle failed."));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    socket.join(userId);

    socket.on("joinConversation", async (conversationId) => {
      // Secure Handshake Verification: Validate ownership constraints on streaming channel connection attempts
      const convo = await Conversation.findById(conversationId);
      if (convo && convo.participants.map(p => p.toString()).includes(userId)) {
        socket.join(`conversation:${conversationId}`);
      }
    });

    socket.on("leaveConversation", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });
  });
};