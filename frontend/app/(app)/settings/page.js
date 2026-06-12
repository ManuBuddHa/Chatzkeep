"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ProfileSettingsPage() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/users/me");
      setUser(res.data);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const fd = new FormData();
    Object.entries(user).forEach(([k, v]) => { if(v !== null) fd.append(k, v); });
    if (avatar) fd.append("avatar", avatar);

    const res = await api.put("/users/me", fd, { headers: { "Content-Type": "multipart/form-data" } });
    setUser(res.data);
    alert("Profile configurations updated.");
  };

  if (!user) return null;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Profile Matrix Configurations</h2>
        <p className="text-sm text-slate-500">Manage directory visibility settings variables</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input value={user.firstName} placeholder="First Name" className="p-3 border rounded-xl" onChange={e => setUser({...user, firstName: e.target.value})}/>
          <input value={user.lastName} placeholder="Last Name" className="p-3 border rounded-xl" onChange={e => setUser({...user, lastName: e.target.value})}/>
        </div>
        <input value={user.title} placeholder="Professional Title" className="w-full p-3 border rounded-xl" onChange={e => setUser({...user, title: e.target.value})}/>
        <textarea value={user.bio} placeholder="Biography profile text summary..." className="w-full p-3 border rounded-xl" rows={4} onChange={e => setUser({...user, bio: e.target.value})}/>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Avatar Update File Upload</label>
          <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files[0])}/>
        </div>

        <button onClick={handleSave} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow hover:bg-blue-700 transition">Save Adjustments</button>
      </div>
    </div>
  );
}