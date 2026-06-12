"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ProfileSettingsPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/users/me");
      setUser(res.data);
    };
    fetchProfile();
  }, []);

  if (!user) return <div className="p-8 text-center text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">Syncing matrix profile...</div>;

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-8 space-y-6">
      <div className="flex gap-2 border-b pb-3">
        <button className="px-5 py-2 bg-white border text-slate-700 rounded-xl text-xs font-bold shadow-sm">📁 General</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-2xl p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">First Name</label>
                <div className="p-3 bg-slate-50 border rounded-xl text-xs font-medium text-slate-700 mt-1">{user.firstName || "Suresh"}</div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Last Name</label>
                <div className="p-3 bg-slate-50 border rounded-xl text-xs font-medium text-slate-700 mt-1">{user.lastName || "S"}</div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                <div className="p-3 bg-slate-50 border rounded-xl text-xs font-medium text-slate-700 mt-1">{user.email || "suresh@gmail.com"}</div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                <div className="p-3 bg-slate-50 border rounded-xl text-xs font-medium text-slate-700 mt-1">+91 97913 36535</div>
              </div>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Bio Overview</label>
            <p className="p-4 bg-slate-50 border rounded-xl text-xs text-slate-600 leading-relaxed font-medium mt-1">
              The Kovai Medical Center and Hospital is a Multi Disciplinary Super Specialty Hospital operating its services in five main and satellite centers in the city of Coimbatore and Erode.
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b pb-2">Address</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Country</label>
                <div className="p-2.5 bg-slate-50 border rounded-lg text-xs font-medium text-slate-700 mt-0.5">India</div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">City/State</label>
                <div className="p-2.5 bg-slate-50 border rounded-lg text-xs font-medium text-slate-700 mt-0.5 truncate">Coimbatore, TN</div>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Area Line</label>
              <div className="p-2.5 bg-slate-50 border rounded-lg text-xs font-medium text-slate-600 mt-0.5">24, Park Gate Rd, ATT Colony, Gopalapuram, Coimbatore, Tamil Nadu 641018</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-28 w-full rounded-xl border overflow-hidden relative shadow-inner">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80" alt="Static Map Indicator Framework" className="w-full h-full object-cover opacity-80 mix-blend-multiply bg-slate-100"/>
              <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 text-[9px] font-bold text-slate-600 rounded-md">📍 Coimbatore, India</div>
            </div>
            <button className="w-full py-3 bg-healthcare-600 text-white text-xs font-bold rounded-xl shadow-md">Edit profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}