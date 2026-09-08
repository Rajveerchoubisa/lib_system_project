import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock3, MousePointer2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import LoginNavbar from "../components/LoginNavbar.jsx";
import PageWrapper from "../components/PageWrapper.jsx";

const benefits = [
  { icon: MousePointer2, title: "Choose the exact seat", text: "Compare zones, floors and desk amenities on a live visual map." },
  { icon: Clock3, title: "Five-minute secure hold", text: "Your chosen desk is temporarily locked while you complete checkout." },
  { icon: ShieldCheck, title: "Verified payment", text: "Server-side pricing and signed payment confirmation keep every reservation reliable." },
];

export default function LandingPage() {
  return (
    <PageWrapper>
      <div className="overflow-hidden bg-slate-950 text-white">
        <LoginNavbar />
        <main>
          <section className="relative isolate min-h-[760px] px-4 pb-20 pt-32 sm:px-6 sm:pt-40 lg:px-8">
            <div className="hero-glow absolute inset-0 -z-10" />
            <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-semibold text-indigo-300"><Sparkles size={14} /> Your best study session starts here</span>
                <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">A better seat for your <span className="text-gradient">deepest work.</span></h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">See live availability, choose your preferred desk, and secure it in minutes. No queues. No guesswork. No double bookings.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold shadow-xl shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-500">Reserve your seat <ArrowRight size={18} /></Link><Link to="/features" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-slate-200 hover:bg-white/10">See how it works</Link></div>
                <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">{["Live availability", "Secure Razorpay checkout", "Easy renewal"].map((item) => <span key={item} className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" />{item}</span>)}</div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: .96, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: .6, delay: .1 }} className="relative mx-auto w-full max-w-xl">
                <div className="absolute -inset-8 -z-10 rounded-full bg-indigo-600/15 blur-3xl" />
                <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-black/40 backdrop-blur sm:p-6">
                  <div className="flex items-center justify-between border-b border-white/8 pb-5"><div><p className="text-xs font-medium text-slate-500">Live seat map</p><p className="mt-1 font-semibold">Quiet Zone · Floor 1</p></div><span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> 14 available</span></div>
                  <div className="my-7 grid grid-cols-5 gap-3">{Array.from({ length: 20 }, (_, index) => <span key={index} className={`grid aspect-square place-items-center rounded-lg border text-xs font-medium ${index === 7 ? "border-indigo-300 bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : [2, 5, 13, 16, 18].includes(index) ? "border-slate-700 bg-slate-800 text-slate-600" : "border-emerald-500/20 bg-emerald-500/8 text-emerald-300"}`}>A{String(index + 1).padStart(2, "0")}</span>)}</div>
                  <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4 sm:flex sm:items-center sm:justify-between"><div><p className="text-xs text-indigo-300">Your selection</p><p className="mt-1 font-semibold">Seat A08 · Power outlet</p></div><div className="mt-3 text-left sm:mt-0 sm:text-right"><p className="text-xs text-slate-500">Monthly</p><p className="text-xl font-bold">₹750</p></div></div>
                </div>
                <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 shadow-xl sm:-left-8"><span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-400/10 text-amber-300"><Zap size={18} /></span><div><p className="text-xs text-slate-500">Seat held safely</p><p className="text-sm font-semibold">04:38 remaining</p></div></div>
              </motion.div>
            </div>
          </section>

          <section className="border-y border-white/8 bg-white/[0.02] px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-semibold uppercase tracking-[.25em] text-indigo-400">Built around your focus</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">From finding a desk to getting settled</h2></div><div className="mt-12 grid gap-4 md:grid-cols-3">{benefits.map(({ icon: Icon, title, text }, index) => <motion.article key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className="group rounded-2xl border border-white/8 bg-slate-900/60 p-6 transition hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-slate-900"><span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-500/10 text-indigo-300 group-hover:bg-indigo-500 group-hover:text-white"><Icon size={21} /></span><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></motion.article>)}</div></div></section>
        </main>
      </div>
    </PageWrapper>
  );
}
