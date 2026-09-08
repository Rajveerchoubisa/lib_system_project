import { Github, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Brand from "./Brand.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div><Brand /><p className="mt-4 max-w-sm text-sm leading-6">A dependable way to choose, hold, pay for, and renew your library seat without waiting in a queue.</p></div>
        <div><p className="mb-3 text-sm font-semibold text-white">Explore</p><div className="space-y-2 text-sm"><FooterLink to="/features">Features</FooterLink><FooterLink to="/bookings">Book a seat</FooterLink><FooterLink to="/my-bookings">Reservations</FooterLink></div></div>
        <div><p className="mb-3 text-sm font-semibold text-white">Legal & contact</p><div className="space-y-2 text-sm"><FooterLink to="/privacy">Privacy policy</FooterLink><FooterLink to="/terms">Terms of service</FooterLink><a href="mailto:support@smartlibrary.app" className="flex items-center gap-2 hover:text-white"><Mail size={15} /> support@smartlibrary.app</a></div></div>
      </div>
      <div className="border-t border-white/8"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><p>© {new Date().getFullYear()} SmartLibrary. Built for focused learners.</p><span className="flex items-center gap-2"><Github size={14} /> Production-minded reservation experience</span></div></div>
    </footer>
  );
}

function FooterLink({ to, children }) { return <Link to={to} className="block hover:text-white">{children}</Link>; }
