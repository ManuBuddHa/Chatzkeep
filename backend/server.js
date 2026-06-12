import http from "http";
import { Server as SocketIOServer } from "socket.io";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { registerSocketHandlers } from "./src/socket/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:3000", methods: ["GET", "POST"] }
});

app.set("io", io);
registerSocketHandlers(io);

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chatzkeep").then(() => {
  server.listen(PORT, () => console.log(`🛰️ Server infrastructure deployed online on port ${PORT}`));
});