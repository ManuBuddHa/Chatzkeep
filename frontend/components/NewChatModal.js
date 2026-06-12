"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function NewChatModal({ isOpen, onClose, onChatCreated }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error("Directory execution sync network drop:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelectUser = async (targetUserId) => {
    try {
      const res = await api.post("/chat/conversations", {
        participantId: targetUserId
      });
      onChatCreated(res.data);
      setQuery("");
      onClose();
    } catch (err) {
      alert("Failed to create conversation session room channel.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md border shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h3 className="font-extrabold text-slate-900 text-base">New Conversation</h3>
          <button onClick={() => { setQuery(""); onClose(); }} className="text-slate-400 text-sm hover:text-slate-600">✕</button>
        </div>

        <div className="space-y-3 flex-1 flex flex-col min-h-0">
          <div className="shrink-0">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Search User by Name / Email</label>
            <input 
              type="text" 
              autoFocus
              placeholder="Type name (e.g. Sanjay, Raymond...)" 
              value={query}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-600/20"
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50/50 divide-y divide-slate-100 min-h-[150px]">
            {loading && (
              <div className="p-4 text-center text-xs text-slate-400 font-medium animate-pulse">Searching directory lists...</div>
            )}
            
            {!loading && query && results.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400 font-medium">No matching users registered.</div>
            )}

            {!loading && !query && (
              <div className="p-4 text-center text-xs text-slate-400 font-medium">Start typing to view medical staff listings.</div>
            )}

            {!loading && results.map(u => (
              <div 
                key={u._id} 
                className="p-3 flex items-center justify-between hover:bg-white cursor-pointer transition"
                onClick={() => handleSelectUser(u._id)}
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">{u.firstName} {u.lastName}</div>
                  <div className="text-[10px] text-slate-400 font-medium truncate">{u.email}</div>
                  {u.title && (
                    <div className="text-[9px] text-healthcare-600 font-bold uppercase mt-0.5">{u.title}</div>
                  )}
                </div>
                <button className="text-[11px] font-bold text-healthcare-600 bg-healthcare-50 hover:bg-healthcare-100 px-3 py-1.5 rounded-lg transition">
                  Chat
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}