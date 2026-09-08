import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, LayoutDashboard, LogOut, Menu, RefreshCw, User, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Brand from "./Brand.jsx";

const links = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/bookings", label: "Book a seat", icon: CalendarDays },
  { to: "/my-bookings", label: "Reservations", icon: CalendarDays },
  { to: "/renew", label: "Renew", icon: RefreshCw },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = (() => { try { return JSON.parse(localStorage.getItem("userInfo")); } catch { return null; } })();

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const close = (event) => !profileRef.current?.contains(event.target) && setProfileOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    delete axios.defaults.headers.common.Authorization;
    navigate("/login");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" aria-label="SmartLibrary dashboard"><Brand /></Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {links.map((link) => <DesktopLink key={link.to} {...link} active={location.pathname === link.to} />)}
        </nav>
        <div className="flex items-center gap-2">
          <div ref={profileRef} className="relative hidden sm:block">
            <button onClick={() => setProfileOpen((value) => !value)} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5 pr-3 text-sm text-slate-200 transition hover:bg-white/10" aria-expanded={profileOpen}>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/20 font-semibold text-indigo-300">{user?.name?.[0]?.toUpperCase() || "M"}</span>
              <span className="max-w-24 truncate">{user?.name?.split(" ")[0] || "Member"}</span>
            </button>
            <AnimatePresence>{profileOpen && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-slate-900 p-2 shadow-2xl">
                <Link to="/my-profile" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white"><User size={17} /> My profile</Link>
                <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-rose-300 hover:bg-rose-500/10"><LogOut size={17} /> Sign out</button>
              </motion.div>
            )}</AnimatePresence>
          </div>
          <button onClick={() => setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white hover:bg-white/5 lg:hidden" aria-label="Open navigation"><Menu size={21} /></button>
        </div>
      </div>

      <AnimatePresence>{mobileOpen && (
        <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }} className="absolute right-0 top-0 flex h-dvh w-[min(88vw,380px)] flex-col border-l border-white/10 bg-slate-950 p-5 shadow-2xl">
            <div className="flex items-center justify-between"><Brand /><button onClick={() => setMobileOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-white" aria-label="Close navigation"><X size={20} /></button></div>
            <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4"><p className="text-xs uppercase tracking-widest text-indigo-300">Signed in as</p><p className="mt-1 truncate font-semibold text-white">{user?.name || user?.email || "Library member"}</p></div>
            <nav className="mt-6 space-y-2">{links.map((link) => <MobileLink key={link.to} {...link} active={location.pathname === link.to} />)}<MobileLink to="/my-profile" label="My profile" icon={User} active={location.pathname === "/my-profile"} /></nav>
            <button onClick={logout} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 py-3 text-sm font-semibold text-rose-300"><LogOut size={17} /> Sign out</button>
          </motion.aside>
        </motion.div>
      )}</AnimatePresence>
    </header>
  );
}

function DesktopLink({ to, label, active }) {
  return <Link to={to} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${active ? "bg-indigo-500/15 text-indigo-300" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>{label}</Link>;
}

function MobileLink({ to, label, icon: Icon, active }) {
  return <Link to={to} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-white/5"}`}><Icon size={19} />{label}</Link>;
}
