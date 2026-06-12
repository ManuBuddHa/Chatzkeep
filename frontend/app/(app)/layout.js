"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import io from "socket.io-client";
import api from "@/lib/api";
import TopBar from "@/components/TopBar";
import NotificationPanel from "@/components/NotificationPanel";

export default function MainAppLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const userStr = Cookies.get("user");
    if (!token || !userStr) {
      router.replace("/login");
      return;
    }
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);
    localStorage.setItem("user", userStr);

    // Load static alert logs
    const loadNotifs = async () => {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    };
    loadNotifs();

    // Hook runtime socket events stream
    socketRef.current = io("http://localhost:4000", { auth: { token } });
    socketRef.current.on("notification", (notif) => {
      setNotifications(prev => [notif, ...prev]);
    });

    return () => socketRef.current?.disconnect();
  }, [router]);

  const handleMarkAllRead = async () => {
    await api.post("/notifications/read-all");
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!user) return null;

  const links = [
    { name: "Message", path: "/chat", icon: "💬" },
    { name: "Settings", path: "/settings", icon: "⚙️" }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900 antialiased font-sans">
      {/* Structural Left Navigation Frame */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-3 py-2 text-healthcare-600 font-extrabold text-lg">
            <span>❇️</span> ChatzKeep
          </div>
          <nav className="space-y-1">
            {links.map(l => {
              const isAct = pathname === l.path;
              return (
                <Link key={l.path} href={l.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${isAct ? "bg-healthcare-600 text-white shadow-md shadow-healthcare-600/10":"text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
                  <span className="text-sm">{l.icon}</span> {l.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Floating conversion marketing subscription banner container element layout context */}
        <div className="p-4 bg-gradient-to-br from-healthcare-600 to-healthcare-700 text-white rounded-2xl relative overflow-hidden space-y-2 shadow-inner">
          <div className="text-[11px] font-bold uppercase tracking-wider text-healthcare-100">Get Unlimited Access</div>
          <p className="text-[10px] text-healthcare-50/80 leading-relaxed">Subscription Keeps Going And Doing And Going...</p>
          <button className="w-full py-2 bg-white text-healthcare-700 text-[10px] font-black rounded-lg uppercase tracking-wide hover:bg-healthcare-50 transition">Subscribe Now</button>
        </div>
      </aside>

      {/* Main Structural Yield Node Column Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar title={pathname === "/settings" ? "Settings" : "Message"} onToggleNotifications={() => setNotifOpen(!notifOpen)} unreadCount={unreadCount}/>
        
        <NotificationPanel isOpen={notifOpen} notifications={notifications} onClose={() => setNotifOpen(false)} onMarkAllRead={handleMarkAllRead}/>
        
        <main className="flex-1 overflow-hidden bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}