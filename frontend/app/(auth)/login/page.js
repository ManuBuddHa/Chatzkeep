"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      Cookies.set("token", res.data.token);
      Cookies.set("user", JSON.stringify(res.data.user));
      router.push("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left Side: Login Form Card Component */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 bg-white">
        <div />
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="flex items-center gap-2 text-healthcare-600 font-bold text-xl">
            <span className="p-2 bg-healthcare-50 rounded-lg">❇️</span> ChatzKeep
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Login</h1>
            <p className="text-sm text-slate-400 mt-1">welcome back! Sign in to your account</p>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative border border-slate-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-healthcare-600/20 transition">
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email address</label>
              <input type="email" required className="w-full bg-transparent text-sm focus:outline-none pt-0.5" placeholder="suresh@gmail.com" onChange={e => setForm({...form, email: e.target.value})}/>
            </div>

            <div className="relative border border-slate-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-healthcare-600/20 transition">
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Password</label>
              <input type="password" required className="w-full bg-transparent text-sm focus:outline-none pt-0.5" placeholder="••••••••" onChange={e => setForm({...form, password: e.target.value})}/>
            </div>

            <button type="submit" className="w-full py-3.5 bg-healthcare-600 hover:bg-healthcare-700 text-white font-semibold rounded-xl transition shadow-md shadow-healthcare-600/10">
              Login
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don't have an account? <span className="text-healthcare-600 font-bold cursor-pointer hover:underline" onClick={() => router.push("/register")}>Register now</span>
          </p>
        </div>
        <div className="text-center text-[11px] text-slate-400">©2025 Chatzkeep. All rights reserved</div>
      </div>

      {/* Right Side: High-Fidelity Healthcare Wallpaper Cover Frame */}
      <div className="hidden lg:block flex-1 relative bg-gradient-to-br from-healthcare-700 to-healthcare-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80" 
          alt="Healthcare Professionals Staff" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
        />
        <div className="absolute bottom-16 left-16 z-20 text-white max-w-md">
          <h2 className="text-3xl font-bold leading-tight">Very good works are waiting for you</h2>
          <p className="text-healthcare-100/80 text-sm mt-2">Connect seamlessly with prime clinic centers and medical systems instantly.</p>
        </div>
      </div>
    </div>
  );
}