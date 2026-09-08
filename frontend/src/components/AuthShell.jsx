import { CheckCircle2, ShieldCheck } from "lucide-react";
import LoginNavbar from "./LoginNavbar.jsx";
import PageWrapper from "./PageWrapper.jsx";

export default function AuthShell({ eyebrow, title, description, children }) {
  return <PageWrapper><LoginNavbar /><main className="app-shell min-h-screen px-4 pb-16 pt-28 text-white sm:px-6 sm:pt-32"><div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-white/8 bg-slate-900/75 shadow-2xl shadow-black/25 lg:grid-cols-[.85fr_1.15fr]">
    <aside className="relative hidden overflow-hidden bg-indigo-600 p-10 lg:flex lg:flex-col lg:justify-between"><div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" /><div><span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">A calmer way to study</span><h2 className="mt-6 text-4xl font-bold leading-tight">Your preferred desk, ready when you are.</h2><p className="mt-4 leading-7 text-indigo-100/75">Choose from live seats and complete a secure reservation in just a few steps.</p></div><div className="space-y-3">{["Atomic seat holds", "Verified payments", "Simple renewals"].map((item) => <p key={item} className="flex items-center gap-2 text-sm text-indigo-100"><CheckCircle2 size={17} />{item}</p>)}</div></aside>
    <section className="p-5 sm:p-9 lg:p-12"><span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-indigo-300"><ShieldCheck size={15} />{eyebrow}</span><h1 className="mt-4 text-3xl font-bold tracking-tight">{title}</h1><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p><div className="mt-8">{children}</div></section>
  </div></main></PageWrapper>;
}

export function Field({ label, icon: Icon, ...props }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">{label}</span><span className="relative block"><Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input {...props} className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-indigo-400/60 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60" /></span></label>;
}
