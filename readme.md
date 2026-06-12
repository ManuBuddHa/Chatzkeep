# ChatzKeep – Healthcare Recruitment Messaging Platform

ChatzKeep is a real-time healthcare staffing communication platform designed to connect healthcare professionals, candidates, and staffing recruiters seamlessly[cite: 1]. Built as a full-stack JavaScript application using Next.js, Node.js, and MongoDB, it implements a highly responsive layout featuring secure file transfers, floating notification workflows, and a polished dark emerald design aesthetic[cite: 1].

---

## 🛠️ Tech Stack Matrix

*   **Frontend Framework:** Next.js (App Router layout framework)[cite: 1]
*   **Styling Engine:** Tailwind CSS (Custom Healthcare Emerald Theme Palette)[cite: 1]
*   **Backend Runtime:** Node.js & Express.js REST API[cite: 1]
*   **Database Management:** MongoDB with Mongoose ODM[cite: 1]
*   **Real-time Protocol Engine:** Socket.io for messaging pipelines and system notification feeds[cite: 1]
*   **File Stream Handlers:** Multer (Server storage) & Axios (Client HTTP transfer pipeline)[cite: 1]
*   **Security Protocol:** JSON Web Tokens (JWT) for session management with salted `bcrypt` password hashing[cite: 1]

---

## 📁 Repository Directory Architecture

This workspace is organized as a clean, unified monorepo:

```text
chatzkeep/
├── backend/
│   ├── src/
│   │   ├── config/       # Database connection bootstrap
│   │   ├── middleware/   # JWT authentication validation layer
│   │   ├── models/       # Mongoose schemas (User, Conversation, Message, Notification)
│   │   ├── routes/       # Controller routing modules (auth, chat, users, notifications)
│   │   └── socket/       # Socket.io event handshake listener rooms
│   ├── app.js            # Express application middleware configuration
│   └── server.js         # HTTP server entrypoint & WebSocket initialization
├── frontend/
│   ├── app/              # Next.js App Router folders
│   │   ├── (app)/        # Protected workspace route group layout (chat, settings)
│   │   ├── (auth)/       # Public split-screen onboarding engine (login, register)
│   │   ├── globals.css   # Main Tailwind compilation directives
│   │   └── layout.js     # Global baseline HTML layout framework shell
│   ├── components/       # Reusable modular UI cards (TopBar, NotificationPanel)
│   ├── lib/              # Client application utilities (Axios API configuration context)
│   └── jsconfig.json     # Absolute path matching file mapping template config
├── uploads/              # Shared local server directory storage folder for media assets
└── .env                  # Core backend infrastructure variables environment template configuration