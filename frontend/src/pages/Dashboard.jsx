import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowRight, Armchair, CalendarCheck, CheckCircle2, Clock3, MapPin, RefreshCw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import PageWrapper from "../components/PageWrapper.jsx";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [seats, setSeats] = useState([]);
  const user = (() => { try { return JSON.parse(localStorage.getItem("userInfo")); } catch { return null; } })();

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.allSettled([
      axios.get(`${API}/api/bookings/my`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API}/api/bookings/seats`),
    ]).then(([bookingResult, seatResult]) => {
      if (bookingResult.status === "fulfilled") setBookings(bookingResult.value.data.bookings || []);
      if (seatResult.status === "fulfilled") setSeats(seatResult.value.data.seats || []);
    });
  }, []);

  const activeBooking = bookings.find((booking) => ["confirmed", "active", "held", "payment_pending"].includes(booking.status));
  const available = useMemo(() => seats.filter((seat) => seat.availability === "available").length, [seats]);
  const expiryDays = activeBooking ? Math.max(0, Math.ceil((new Date(activeBooking.expiryDate) - Date.now()) / 86400000)) : 0;

  return (
    <PageWrapper>
      <Navbar />
      <main className="app-shell min-h-screen px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div><span className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300"><Sparkles size={16} /> Member dashboard</span><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, {user?.name?.split(" ")[0] || "reader"}.</h1><p className="mt-2 max-w-xl text-slate-400">Everything you need for a focused day at the library, in one place.</p></div>
            <Link to="/bookings" className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-3 font-semibold shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-500">Choose a seat <ArrowRight size={18} /></Link>
          </section>

          <section className="mt-9 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat icon={Armchair} label="Seats available" value={seats.length ? available : "—"} accent="emerald" />
            <Stat icon={CalendarCheck} label="Your reservations" value={bookings.length} accent="indigo" />
            <Stat icon={Clock3} label="Days remaining" value={activeBooking ? expiryDays : "—"} accent="amber" />
            <Stat icon={RefreshCw} label="Renewal" value={activeBooking?.status === "confirmed" ? "Ready" : "—"} accent="cyan" />
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
            <article className="surface-card overflow-hidden p-5 sm:p-7">
              <div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Current reservation</p><h2 className="mt-1 text-xl font-semibold">{activeBooking ? `Seat ${activeBooking.seatNumber || "assigned"}` : "No active reservation"}</h2></div>{activeBooking && <StatusBadge status={activeBooking.status} />}</div>
              {activeBooking ? <div className="mt-7 grid gap-3 sm:grid-cols-3"><Detail icon={MapPin} label="Study zone" value={activeBooking.section || "Main library"} /><Detail icon={CalendarCheck} label="Starts" value={new Date(activeBooking.joiningDate).toLocaleDateString()} /><Detail icon={Clock3} label="Valid until" value={new Date(activeBooking.expiryDate).toLocaleDateString()} /></div> : <div className="mt-7 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center"><Armchair className="mx-auto text-slate-600" size={32} /><p className="mt-3 text-sm text-slate-400">Pick a desk that matches how you like to study.</p><Link to="/bookings" className="mt-4 inline-flex text-sm font-semibold text-indigo-300 hover:text-indigo-200">Explore live seats →</Link></div>}
            </article>

            <aside className="surface-card p-5 sm:p-7"><p className="text-sm text-slate-500">Quick actions</p><div className="mt-4 space-y-2"><QuickLink to="/bookings" icon={Armchair} title="Book a new seat" text="View live availability" /><QuickLink to="/my-bookings" icon={CalendarCheck} title="Reservation history" text="Track every booking" /><QuickLink to="/renew" icon={RefreshCw} title="Renew access" text="Extend a confirmed seat" /></div></aside>
          </section>

          <section className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-5 sm:flex sm:items-center sm:justify-between sm:p-6"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={21} /><div><h2 className="font-semibold">Availability updates automatically</h2><p className="mt-1 text-sm text-slate-400">A seat is locked for five minutes during checkout, preventing two members from reserving it.</p></div></div><span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 sm:mt-0"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> System online</span></section>
        </div>
      </main>
    </PageWrapper>
  );
}

const accents = { emerald: "bg-emerald-400/10 text-emerald-300", indigo: "bg-indigo-400/10 text-indigo-300", amber: "bg-amber-400/10 text-amber-300", cyan: "bg-cyan-400/10 text-cyan-300" };
function Stat({ icon: Icon, label, value, accent }) { return <article className="surface-card p-4 sm:p-5"><span className={`grid h-9 w-9 place-items-center rounded-xl ${accents[accent]}`}><Icon size={18} /></span><p className="mt-4 text-2xl font-bold sm:text-3xl">{value}</p><p className="mt-1 text-xs text-slate-500 sm:text-sm">{label}</p></article>; }
function Detail({ icon: Icon, label, value }) { return <div className="rounded-xl bg-slate-950/55 p-4"><Icon size={17} className="text-indigo-300" /><p className="mt-3 text-xs text-slate-500">{label}</p><p className="mt-1 text-sm font-medium text-slate-200">{value}</p></div>; }
function QuickLink({ to, icon: Icon, title, text }) { return <Link to={to} className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-white/5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-slate-300 group-hover:bg-indigo-500/15 group-hover:text-indigo-300"><Icon size={19} /></span><span><span className="block text-sm font-medium text-slate-200">{title}</span><span className="block text-xs text-slate-500">{text}</span></span><ArrowRight className="ml-auto text-slate-700 group-hover:text-indigo-300" size={17} /></Link>; }
function StatusBadge({ status }) { const confirmed = ["confirmed", "active"].includes(status); return <span className={`rounded-full px-3 py-1 text-xs font-medium ${confirmed ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300"}`}>{status.replaceAll("_", " ")}</span>; }
