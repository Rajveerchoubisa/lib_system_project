import { useState } from "react";
import axios from "axios";
import { KeyRound, LockKeyhole, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthShell, { Field } from "../components/AuthShell.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const change = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL;
      if (!otpSent) {
        await axios.post(`${API}/api/auth/send-otp`, { email: form.email });
        setOtpSent(true); toast.success("Verification code sent");
      } else {
        await axios.post(`${API}/api/auth/verify-otp`, { otp: form.otp, email: form.email });
        await axios.post(`${API}/api/auth/register`, { name: form.name, email: form.email, password: form.password });
        toast.success("Account created. You can now sign in."); navigate("/login");
      }
    } catch (error) { toast.error(error.response?.data?.message || "Could not create account"); }
    finally { setLoading(false); }
  };
  return <AuthShell eyebrow="Free member account" title={otpSent ? "Check your inbox" : "Create your account"} description={otpSent ? `Enter the verification code sent to ${form.email}.` : "Reserve your ideal study seat and manage it from anywhere."}><form onSubmit={submit} className="space-y-5"><Field label="Full name" icon={User} value={form.name} onChange={change("name")} placeholder="Your full name" autoComplete="name" required disabled={otpSent} /><Field label="Email address" icon={Mail} value={form.email} onChange={change("email")} type="email" placeholder="you@example.com" autoComplete="email" required disabled={otpSent} /><Field label="Password" icon={LockKeyhole} value={form.password} onChange={change("password")} type="password" placeholder="At least 8 characters" minLength={8} autoComplete="new-password" required disabled={otpSent} />{otpSent && <Field label="Verification code" icon={KeyRound} value={form.otp} onChange={change("otp")} inputMode="numeric" placeholder="Enter OTP" autoFocus required />}<button disabled={loading} className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-60">{loading ? "Please wait…" : otpSent ? "Verify & create account" : "Send verification code"}</button>{otpSent && <button type="button" onClick={() => setOtpSent(false)} className="w-full text-sm text-slate-500 hover:text-white">Use a different email</button>}</form><p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-indigo-300 hover:text-indigo-200">Sign in</Link></p></AuthShell>;
}
