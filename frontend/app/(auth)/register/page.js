"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "", website: "", phoneNumber: "",
    address: "", city: "", state: "", pincode: "", password: "defaultSecurePassword123"
  });

  const handleComplete = async () => {
    try {
      const payload = {
        role: "recruiter",
        firstName: form.email.split('@')[0],
        lastName: "Facility",
        email: form.email,
        password: form.password,
        location: `${form.city}, ${form.state}`,
        organization: form.website,
        bio: `Located at ${form.address}. contact sequence: ${form.phoneNumber}`
      };

      const res = await api.post("/auth/register", payload);
      Cookies.set("token", res.data.token);
      Cookies.set("user", JSON.stringify(res.data.user));
      router.push("/chat");
    } catch (err) {
      alert("Registration submission handling failed.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 bg-white">
        <div />
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="flex items-center gap-2 text-healthcare-600 font-bold text-xl">
            <span>❇️</span> ChatzKeep
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Register</h1>
            <p className="text-sm text-slate-400 mt-1">welcome back! Sign in to your account.</p>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl px-4 py-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Email</label>
                <input type="email" className="w-full bg-transparent text-sm focus:outline-none" placeholder="getwell@kmchhospitals.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
              </div>
              <div className="border border-slate-200 rounded-xl px-4 py-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Website</label>
                <input type="text" className="w-full bg-transparent text-sm focus:outline-none" placeholder="www.kmchhospitals.com" value={form.website} onChange={e => setForm({...form, website: e.target.value})}/>
              </div>
              <div className="border border-slate-200 rounded-xl px-4 py-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Phone Number</label>
                <input type="text" className="w-full bg-transparent text-sm focus:outline-none" placeholder="+91 422 - 4378720" value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})}/>
              </div>
              <button onClick={() => setStep(2)} className="w-full py-3.5 bg-healthcare-600 hover:bg-healthcare-700 text-white font-semibold rounded-xl transition">
                Continue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl px-4 py-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Address</label>
                <input type="text" className="w-full bg-transparent text-sm focus:outline-none" placeholder="No.18, Vivekananda Road" value={form.address} onChange={e => setForm({...form, address: e.target.value})}/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-xl px-4 py-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">City</label>
                  <input type="text" className="w-full bg-transparent text-sm focus:outline-none" placeholder="Coimbatore" value={form.city} onChange={e => setForm({...form, city: e.target.value})}/>
                </div>
                <div className="border border-slate-200 rounded-xl px-4 py-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">State</label>
                  <input type="text" className="w-full bg-transparent text-sm focus:outline-none" placeholder="Tamilnadu" value={form.state} onChange={e => setForm({...form, state: e.target.value})}/>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl px-4 py-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Pincode</label>
                <input type="text" className="w-full bg-transparent text-sm focus:outline-none" placeholder="641 009" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})}/>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="w-1/3 py-3.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold">Back</button>
                <button onClick={handleComplete} className="flex-1 py-3.5 bg-healthcare-600 hover:bg-healthcare-700 text-white font-semibold rounded-xl transition">Submit</button>
              </div>
            </div>
          )}
        </div>
        <div className="text-center text-[11px] text-slate-400">©2025 Chatzkeep. All rights reserved</div>
      </div>

      <div className="hidden lg:block flex-1 relative bg-gradient-to-br from-healthcare-700 to-healthcare-900">
        <img 
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80" 
          alt="Doctors Team" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
      </div>
    </div>
  );
}