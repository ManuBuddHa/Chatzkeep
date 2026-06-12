"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("recruiter"); 
  const [form, setForm] = useState({
    email: "", website: "", phoneNumber: "", title: "", password: "",
    address: "", city: "", state: "", pincode: ""
  });
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");

  const validateStepOne = () => {
    setError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!form.email.trim() || !emailRegex.test(form.email)) {
      setError("Please provide a valid, well-formatted email address.");
      return false;
    }
    if (!form.password || form.password.length < 6) {
      setError("Password is required and must be at least 6 characters long.");
      return false;
    }
    if (role === "recruiter" && !form.website.trim()) {
      setError("Facility website URL configuration is required.");
      return false;
    }
    if (role === "candidate" && !form.title.trim()) {
      setError("Professional specialization title field cannot be blank.");
      return false;
    }
    if (!form.phoneNumber.trim() || form.phoneNumber.length < 7) {
      setError("Please provide a valid contact phone number.");
      return false;
    }
    return true;
  };

  const validateStepTwo = () => {
    setError("");
    if (!form.address.trim()) {
      setError("Physical street address mapping parameter is required.");
      return false;
    }
    if (!form.city.trim()) {
      setError("City field cannot be empty.");
      return false;
    }
    if (!form.state.trim()) {
      setError("State field cannot be empty.");
      return false;
    }
    if (!form.pincode.trim() || form.pincode.length < 4) {
      setError("Please provide a valid geographic postal pincode tracking value.");
      return false;
    }
    if (role === "candidate" && !resume) {
      setError("Candidates must upload a professional resume PDF to complete registration.");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStepOne()) {
      setError(""); // Clean error state cleanly
      setStep(2);
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    if (!validateStepTwo()) return;

    setError("");
    const data = new FormData();
    data.append("role", role);
    data.append("email", form.email.trim().toLowerCase());
    data.append("password", form.password);
    data.append("phoneNumber", form.phoneNumber.trim());
    data.append("address", form.address.trim());
    data.append("city", form.city.trim());
    data.append("state", form.state.trim());
    data.append("pincode", form.pincode.trim());
    
    if (role === "recruiter") {
      data.append("firstName", form.email.split('@')[0].toUpperCase());
      data.append("organization", form.website.trim());
      data.append("title", "Healthcare Facility Recruiter");
    } else {
      data.append("firstName", form.title.trim());
      if (resume) data.append("resume", resume);
    }

    try {
      const res = await api.post("/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      Cookies.set("token", res.data.token);
      Cookies.set("user", JSON.stringify(res.data.user));
      router.push("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Registration processing encountered an issue on the server.");
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

          {step === 1 && (
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100 shrink-0">
              <button type="button" className={`py-2 text-xs font-bold rounded-lg transition-all ${role === "recruiter" ? "bg-healthcare-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`} onClick={() => { setRole("recruiter"); setError(""); }}>🏥 Healthcare Facility</button>
              <button type="button" className={`py-2 text-xs font-bold rounded-lg transition-all ${role === "candidate" ? "bg-healthcare-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`} onClick={() => { setRole("candidate"); setError(""); }}>🧑‍⚕️ Medical Candidate</button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-semibold animate-in fade-in duration-100">
              {error}
            </div>
          )}

          {/* STEP 1 SECTION */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border border-slate-200 rounded-xl px-4 py-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email address</label>
                <input type="email" className="w-full bg-transparent text-sm focus:outline-none pt-0.5" placeholder="getwell@kmchhospitals.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
              </div>

              <div className="border border-slate-200 rounded-xl px-4 py-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Password</label>
                <input type="password" className="w-full bg-transparent text-sm focus:outline-none pt-0.5" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>
              </div>

              {role === "recruiter" ? (
                <div className="border border-slate-200 rounded-xl px-4 py-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Website</label>
                  <input type="text" className="w-full bg-transparent text-sm focus:outline-none pt-0.5" placeholder="www.kmchhospitals.com" value={form.website} onChange={e => setForm({...form, website: e.target.value})}/>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl px-4 py-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Professional Specialization Title</label>
                  <input type="text" className="w-full bg-transparent text-sm focus:outline-none pt-0.5" placeholder="Registered ICU Nurse..." value={form.title} onChange={e => setForm({...form, title: e.target.value})}/>
                </div>
              )}

              <div className="border border-slate-200 rounded-xl px-4 py-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Phone number</label>
                <input type="text" className="w-full bg-transparent text-sm focus:outline-none pt-0.5" placeholder="+91 422 - 4378720" value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})}/>
              </div>
              
              <button type="button" onClick={handleNextStep} className="w-full py-3.5 bg-healthcare-600 hover:bg-healthcare-700 text-white font-semibold rounded-xl transition shadow-md">
                Continue
              </button>
            </div>
          )}

          {/* STEP 2 SECTION */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border border-slate-200 rounded-xl px-4 py-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Address</label>
                <input type="text" className="w-full bg-transparent text-sm focus:outline-none pt-0.5" placeholder="No.18, Vivekananda Road" value={form.address} onChange={e => setForm({...form, address: e.target.value})}/>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-xl px-4 py-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">City</label>
                  <input type="text" className="w-full bg-transparent text-sm focus:outline-none pt-0.5" placeholder="Coimbatore" value={form.city} onChange={e => setForm({...form, city: e.target.value})}/>
                </div>
                <div className="border border-slate-200 rounded-xl px-4 py-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">State</label>
                  <input type="text" className="w-full bg-transparent text-sm focus:outline-none pt-0.5" placeholder="Tamilnadu" value={form.state} onChange={e => setForm({...form, state: e.target.value})}/>
                </div>
              </div>
              
              <div className="border border-slate-200 rounded-xl px-4 py-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pincode</label>
                <input type="text" className="w-full bg-transparent text-sm focus:outline-none pt-0.5" placeholder="641 009" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})}/>
              </div>

              {role === "candidate" && (
                <div className="p-4 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl text-center space-y-1">
                  <label className="block text-xs font-bold text-slate-600">Upload Professional Resume (PDF)</label>
                  <input type="file" accept=".pdf" className="text-xs text-slate-400 mx-auto block" onChange={e => setResume(e.target.files[0])}/>
                  {resume && <p className="text-[10px] text-healthcare-600 font-bold">📄 Loaded: {resume.name}</p>}
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => { setError(""); setStep(1); }} className="w-1/3 py-3.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition">Back</button>
                <button type="button" onClick={handleComplete} className="flex-1 py-3.5 bg-healthcare-600 hover:bg-healthcare-700 text-white font-semibold rounded-xl transition shadow-md">Submit</button>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-slate-500">Don't have an account? <span className="text-healthcare-600 font-bold cursor-pointer hover:underline" onClick={() => router.push("/login")}>Login</span></p>
        </div>
        <div className="text-center text-[11px] text-slate-400">©2025 Chatzkeep. All rights reserved</div>
      </div>

      <div className="hidden lg:block flex-1 relative bg-gradient-to-br from-healthcare-700 to-healthcare-900 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80" alt="Cover" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"/>
      </div>
    </div>
  );
}