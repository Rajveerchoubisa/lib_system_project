import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Brand from "./Brand.jsx";

export default function LoginNavbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/"><Brand /></Link>
        <nav className="hidden items-center gap-2 md:flex">
          <PublicLink to="/" label="Home" active={location.pathname === "/"} />
          <PublicLink to="/features" label="Features" active={location.pathname === "/features"} />
          <Link to="/login" className="ml-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5">Sign in</Link>
          <Link to="/register" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500">Get started</Link>
        </nav>
        <button onClick={() => setOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white md:hidden" aria-label="Toggle navigation">{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      <AnimatePresence>{open && <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/8 bg-slate-950 px-4 md:hidden"><div className="space-y-2 py-4"><PublicLink to="/" label="Home" active={location.pathname === "/"} /><PublicLink to="/features" label="Features" active={location.pathname === "/features"} /><Link to="/login" className="block rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5">Sign in</Link><Link to="/register" className="block rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white">Create free account</Link></div></motion.nav>}</AnimatePresence>
    </header>
  );
}

function PublicLink({ to, label, active }) { return <Link to={to} className={`block rounded-xl px-4 py-2.5 text-sm font-medium ${active ? "text-indigo-300" : "text-slate-400 hover:text-white"}`}>{label}</Link>; }
