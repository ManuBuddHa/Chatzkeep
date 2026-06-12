"use client";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
import api from "@/lib/api";
import NewChatModal from "@/components/NewChatModal";

export default function ChatView() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const [currentUser, setCurrentUser] = useState({});
  const API_BASE = "http://localhost:4000";

  // Load initial conversation data list metrics
  useEffect(() => {
    setCurrentUser(JSON.parse(Cookies.get("user") || "{}"));
    const init = async () => {
      const res = await api.get("/chat/conversations");
      setConversations(res.data);
    };
    init();
  }, []);

  // Synchronize dynamic socket channels layout parameters
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    socketRef.current = io(API_BASE, { auth: { token } });

    socketRef.current.on("forceJoinRoom", (conversationId) => {
      socketRef.current.emit("joinConversation", conversationId);
      api.get("/chat/conversations").then(res => setConversations(res.data));
    });

    socketRef.current.on("newMessage", (msg) => {
      setSelectedConvo(currentSelected => {
        if (currentSelected && (msg.conversation === currentSelected._id || msg.conversation?._id === currentSelected._id)) {
          // FIX: Dedup check to handle real-time messaging pushes without duplicate keys
          setMessages(prev => {
            if (prev.some(m => m._id === msg._id)) return prev; 
            return [...prev, msg];
          });
        }
        return currentSelected;
      });
    });

    if (selectedConvo) {
      socketRef.current.emit("joinConversation", selectedConvo._id);
    }

    return () => socketRef.current?.disconnect();
  }, [selectedConvo?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectChat = async (convo) => {
    setSelectedConvo(convo);
    const res = await api.get(`/chat/conversations/${convo._id}/messages`);
    setMessages(res.data);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    const fd = new FormData();
    fd.append("text", text);
    if (file) fd.append("attachment", file);

    try {
      const res = await api.post(`/chat/conversations/${selectedConvo._id}/messages`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // FIX: Add a dedup check here as well to make sure we don't preemptively double-mount
      setMessages(prev => {
        if (prev.some(m => m._id === res.data._id)) return prev;
        return [...prev, res.data];
      });

      setText("");
      setFile(null);

      const refreshInbox = await api.get("/chat/conversations");
      setConversations(refreshInbox.data);
    } catch (err) {
      console.error("Message send failed:", err);
    }
  };

  const handleChatCreated = (newConvo) => {
    if (!conversations.some(c => c._id === newConvo._id)) {
      setConversations(prev => [newConvo, ...prev]);
    }
    selectChat(newConvo);
  };

  return (
    <div className="h-screen flex bg-white w-full">
      <div className="w-80 border-r border-slate-200/80 flex flex-col bg-white shrink-0">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-extrabold text-xl tracking-tight text-slate-900">Inbox</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setModalOpen(true)} className="w-7 h-7 bg-healthcare-600 hover:bg-healthcare-700 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow transition">
              +
            </button>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">{conversations.length}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {conversations.map(c => {
            const partner = c.participants.find(p => p._id !== currentUser.id);
            const isSelected = selectedConvo?._id === c._id;
            return (
              <div key={c._id} className={`p-4 mx-2 my-1 rounded-xl cursor-pointer transition ${isSelected ? "bg-healthcare-50 border-l-4 border-l-healthcare-600" : "hover:bg-slate-50"}`} onClick={() => selectChat(c)}>
                <div className="font-bold text-sm text-slate-800">{partner ? `${partner.firstName} ${partner.lastName}` : "System Room"}</div>
                <div className="text-xs text-slate-500 truncate mt-1">{c.lastMessage || "No communications yet"}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-50 relative">
        {selectedConvo ? (
          <>
            <div className="p-4 bg-white border-b border-slate-200/60 shadow-sm flex items-center justify-between px-6 z-10">
              <div className="font-bold text-slate-900 text-sm">Active Communications Framework</div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(m => {
                const isMe = (m.sender?._id || m.sender) === currentUser.id;
                return (
                  <div key={m._id} className={`flex w-full ${isMe ? "justify-end":"justify-start"}`}>
                    <div className={`p-3.5 px-4.5 rounded-2xl text-sm leading-relaxed shadow-sm max-w-[70%] ${isMe ? "bg-healthcare-600 text-white rounded-br-none" : "bg-white border text-slate-800 rounded-bl-none"}`}>
                      <p>{m.text}</p>
                      {m.attachments?.map((a, i) => (
                        <a key={i} href={`${API_BASE}${a.url}`} target="_blank" rel="noreferrer" className="block text-xs underline mt-2 text-sky-200">📄 View Document</a>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200/80 flex gap-3 items-center px-6">
              <input type="file" id="attachment" className="hidden" onChange={e => setFile(e.target.files[0])}/>
              <label htmlFor="attachment" className={`p-3 px-4 rounded-xl font-bold text-xs cursor-pointer border ${file ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"}`}>
                📎 {file ? "Loaded" : "Attach File"}
              </label>
              <input value={text} placeholder="Type your message securely..." className="flex-1 p-3 px-4 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-600/20" onChange={e => setText(e.target.value)}/>
              <button type="submit" className="px-6 py-3 bg-healthcare-600 text-white text-sm font-bold rounded-xl shadow-md">Send</button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
            <div className="text-4xl">💬</div>
            <div className="font-semibold text-sm">No Chat Selected</div>
          </div>
        )}
      </div>

      <NewChatModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onChatCreated={handleChatCreated}/>
    </div>
  );
}