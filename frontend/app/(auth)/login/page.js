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
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
      <p className="text-slate-500 text-sm mb-6">Sign in to manage conversations</p>
      {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Email</label>
          <input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" onChange={e => setForm({...form, email: e.target.value})}/>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Password</label>
          <input type="password" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" onChange={e => setForm({...form, password: e.target.value})}/>
        </div>
        <button type="submit" className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition shadow-md">Sign In</button>
      </form>
    </div>
  );
}