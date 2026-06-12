"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function TopBar({ title, onToggleNotifications, unreadCount }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    }
  }, []);

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-6 flex-1">
        <h1 className="text-xl font-black text-slate-800 tracking-tight">{title}</h1>
        <div className="hidden md:flex items-center gap-2.5 bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2 w-full max-w-md">
          <span className="text-slate-400 text-sm">🔍</span>
          <input type="text" placeholder="Search candidate, vacancy post..." className="bg-transparent text-xs text-slate-700 focus:outline-none w-full placeholder-slate-400"/>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell Badge Trigger Button Container */}
        <button className="relative w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/40 flex items-center justify-center text-lg transition" onClick={onToggleNotifications}>
          🔔
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
          <div className="w-9 h-9 rounded-full bg-healthcare-100 text-healthcare-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center border border-healthcare-200">
            {user.firstName?.[0] || "U"}{user.lastName?.[0] || "S"}
          </div>
        </div>
      </div>
    </header>
  );
}