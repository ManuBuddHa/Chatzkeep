"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("candidate");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", title: "", organization: "", bio: "", location: "" });
  const [resume, setResume] = useState(null);

  const handleFinish = async () => {
    const data = new FormData();
    data.append("role", role);
    Object.entries(form).forEach(([key, val]) => data.append(key, val));
    if (resume) data.append("resume", resume);

    try {
      const res = await api.post("/auth/register", data);
      Cookies.set("token", res.data.token);
      Cookies.set("user", JSON.stringify(res.data.user));
      router.push("/chat");
    } catch (err) {
      alert("Registration failed. Please check inputs.");
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Step {step} of 3</h3>
        <div className="flex gap-2">
          <button className={`px-4 py-1.5 text-sm rounded-lg font-medium transition ${role === "candidate" ? "bg-blue-600 text-white":"bg-slate-100 text-slate-600"}`} onClick={() => setRole("candidate")}>Candidate</button>
          <button className={`px-4 py-1.5 text-sm rounded-lg font-medium transition ${role === "recruiter" ? "bg-blue-600 text-white":"bg-slate-100 text-slate-600"}`} onClick={() => setRole("recruiter")}>Recruiter</button>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="First Name" className="p-3 border rounded-xl" onChange={e => setForm({...form, firstName: e.target.value})}/>
            <input placeholder="Last Name" className="p-3 border rounded-xl" onChange={e => setForm({...form, lastName: e.target.value})}/>
          </div>
          <input placeholder="Email" type="email" className="w-full p-3 border rounded-xl" onChange={e => setForm({...form, email: e.target.value})}/>
          <input placeholder="Password" type="password" className="w-full p-3 border rounded-xl" onChange={e => setForm({...form, password: e.target.value})}/>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <input placeholder={role === "candidate" ? "Current Title" : "Hiring Role Title"} className="w-full p-3 border rounded-xl" onChange={e => setForm({...form, title: e.target.value})}/>
          <input placeholder={role === "candidate" ? "Target Location" : "Hospital/Clinic Facility"} className="w-full p-3 border rounded-xl" onChange={e => role === "candidate" ? setForm({...form, location: e.target.value}) : setForm({...form, organization: e.target.value})}/>
          <textarea placeholder="Tell us about yourself..." className="w-full p-3 border rounded-xl" rows={3} onChange={e => setForm({...form, bio: e.target.value})}/>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 text-center">
          <p className="text-sm text-slate-500">Provide verified paperwork documentation credentials profiles.</p>
          <input type="file" accept=".pdf,.doc,.docx" className="mx-auto block text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700" onChange={e => setResume(e.target.files[0])}/>
        </div>
      )}

      <div className="flex justify-between mt-8">
        {step > 1 && <button className="px-6 py-2 border rounded-xl text-slate-600" onClick={() => setStep(step - 1)}>Back</button>}
        <span />
        {step < 3 ? (
          <button className="px-6 py-2 bg-blue-600 text-white rounded-xl" onClick={() => setStep(step + 1)}>Continue</button>
        ) : (
          <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold" onClick={handleFinish}>Complete Setup</button>
        )}
      </div>
    </div>
  );
}