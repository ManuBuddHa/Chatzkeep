"use client";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
import api from "@/lib/api";

export default function ChatView() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const currentUser = JSON.parse(Cookies.get("user") || "{}");
  const API_BASE = "http://localhost:4000";

  useEffect(() => {
    const init = async () => {
      const res = await api.get("/chat/conversations");
      setConversations(res.data);
    };
    init();

    socketRef.current = io(API_BASE, { auth: { token: Cookies.get("token") } });

    socketRef.current.on("newMessage", (msg) => {
      if (msg.conversation === selectedConvo?._id) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socketRef.current.disconnect();
  }, [selectedConvo]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectChat = async (convo) => {
    setSelectedConvo(convo);
    const res = await api.get(`/chat/conversations/${convo._id}/messages`);
    setMessages(res.data);
    socketRef.current.emit("joinConversation", convo._id);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    const fd = new FormData();
    fd.append("text", text);
    if (file) fd.append("attachment", file);

    // REST handles storage and automated pipeline broadcasts securely
    await api.post(`/chat/conversations/${selectedConvo._id}/messages`, fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setText("");
    setFile(null);
  };

  return (
    <div className="h-screen flex bg-white">
      <div className="w-80 border-r flex flex-col bg-slate-50">
        <div className="p-4 border-b font-bold text-lg text-slate-800">Inbox</div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(c => {
            const partner = c.participants.find(p => p._id !== currentUser.id);
            return (
              <div key={c._id} className={`p-4 border-b cursor-pointer transition ${selectedConvo?._id === c._id ? "bg-blue-50 border-l-4 border-l-blue-600":""}`} onClick={() => selectChat(c)}>
                <div className="font-bold text-sm text-slate-800">{partner ? `${partner.firstName} ${partner.lastName}` : "System Room"}</div>
                <div className="text-xs text-slate-500 truncate">{c.lastMessage || "No messages yet"}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-slate-100">
        {selectedConvo ? (
          <>
            <div className="p-4 bg-white border-b font-bold shadow-sm z-10">
              Active Session Matrix
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(m => {
                const isMe = (m.sender?._id || m.sender) === currentUser.id;
                return (
                  <div key={m._id} className={`flex ${isMe ? "justify-end":"justify-start"}`}>
                    <div className={`p-3 rounded-2xl max-w-md ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border rounded-tl-none text-slate-800"}`}>
                      <p className="text-sm">{m.text}</p>
                      {m.attachments?.map((a, i) => (
                        <a key={i} href={`${API_BASE}${a.url}`} target="_blank" rel="noreferrer" className="block text-xs underline mt-1 text-sky-200">
                          Attachment File Resource
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2 items-center">
              <input type="file" id="attachment" className="hidden" onChange={e => setFile(e.target.files[0])}/>
              <label htmlFor="attachment" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer text-xs font-bold transition">📎 {file ? "Loaded":"File"}</label>
              <input value={text} placeholder="Type a message..." className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setText(e.target.value)}/>
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow">Send</button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-medium">Select an conversations inbox queue channel to establish streams.</div>
        )}
      </div>
    </div>
  );
}