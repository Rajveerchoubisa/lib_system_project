import { useState } from "react";
import axios from "axios";
import { LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthShell, { Field } from "../components/AuthShell.jsx";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = async (event) => {
    event.preventDefault(); setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { identifier, password });
      localStorage.setItem("token", data.token); localStorage.setItem("userInfo", JSON.stringify(data));
      axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      toast.success("Welcome back"); navigate("/dashboard");
    } catch (error) { toast.error(error.response?.data?.message || "Login failed"); }
    finally { setLoading(false); }
  };
  return <AuthShell eyebrow="Secure member access" title="Welcome back" description="Sign in to manage your seat and get back to focused work."><form onSubmit={login} className="space-y-5"><Field label="Email or phone" icon={Mail} value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="you@example.com" autoComplete="username" required /><Field label="Password" icon={LockKeyhole} value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Enter your password" autoComplete="current-password" required /><div className="flex justify-end"><Link to="/forgot-password" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">Forgot password?</Link></div><button disabled={loading} className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button></form><p className="mt-6 text-center text-sm text-slate-500">New to SmartLibrary? <Link to="/register" className="font-semibold text-indigo-300 hover:text-indigo-200">Create an account</Link></p></AuthShell>;
}
