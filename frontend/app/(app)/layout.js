"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

export default function MainAppLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const userStr = Cookies.get("user");
    if (!token || !userStr) {
      router.replace("/login");
    } else {
      setUser(JSON.parse(userStr));
    }
  }, [router]);

  if (!user) return null;

  const routes = [
    { name: "Messages", path: "/chat" },
    { name: "Notifications", path: "/notifications" },
    { name: "Settings", path: "/settings" }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6">
        <div>
          <div className="font-black text-2xl tracking-tight text-blue-600 mb-8">ChatzKeep</div>
          <nav className="space-y-1.5">
            {routes.map(r => (
              <Link key={r.path} href={r.path} className={`block px-4 py-3 rounded-xl text-sm font-semibold transition ${pathname === r.path ? "bg-blue-50 text-blue-600":"text-slate-600 hover:bg-slate-50"}`}>{r.name}</Link>
            ))}
          </nav>
        </div>
        <div className="border-t pt-4">
          <div className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">{user.role}</div>
          <button className="w-full text-left text-xs font-bold text-red-500 hover:text-red-700" onClick={() => { Cookies.remove("token"); Cookies.remove("user"); router.replace("/login"); }}>Sign Out</button>
        </div>
      </aside>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}