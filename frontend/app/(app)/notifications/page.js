"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/notifications");
      setNotifs(res.data);
    };
    load();
  }, []);

  const clearAll = async () => {
    await api.post("/notifications/read-all");
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight">System Alerts</h2>
          <p className="text-sm text-slate-500">Real-time update streams logging</p>
        </div>
        <button onClick={clearAll} className="text-sm text-blue-600 font-bold hover:underline">Mark all read</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border divide-y">
        {notifs.map(n => (
          <div key={n._id} className="p-4 flex items-start gap-4 transition hover:bg-slate-50">
            <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-slate-200":"bg-blue-600"}`} />
            <div>
              <div className="text-sm font-bold text-slate-900">{n.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{n.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}