import { useEffect, useState } from "react";
import axios from "axios";
import { Armchair, CalendarDays, Clock3, MapPin, Plus, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import PageWrapper from "../components/PageWrapper.jsx";

const API = import.meta.env.VITE_API_URL;
const statusStyles = {
  confirmed: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  active: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  held: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  payment_pending: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  expired: "bg-slate-400/10 text-slate-400 border-slate-400/20",
  cancelled: "bg-rose-400/10 text-rose-300 border-rose-400/20",
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get(`${API}/api/bookings/my`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(({ data }) => setBookings(data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper><Navbar /><main className="app-shell min-h-screen px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-indigo-300">Your study history</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Reservations</h1><p className="mt-2 text-slate-400">Review active, pending, and previous seat reservations.</p></div><Link to="/bookings" className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold hover:bg-indigo-500"><Plus size={17} /> Book a seat</Link></header>
      <section className="mt-8 space-y-4">
        {loading ? <Loading /> : bookings.length === 0 ? <Empty /> : bookings.map((booking) => <BookingCard key={booking._id} booking={booking} />)}
      </section>
    </div></main></PageWrapper>
  );
}

function BookingCard({ booking }) {
  const canRenew = ["confirmed", "active"].includes(booking.status);
  return <article className="surface-card p-5 transition hover:border-white/15 sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center">
    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-300"><Armchair size={25} /></div>
    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-semibold">Seat {booking.seatNumber || "Legacy"}</h2><span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusStyles[booking.status] || statusStyles.expired}`}>{booking.status.replaceAll("_", " ")}</span></div><div className="mt-3 grid gap-2 text-sm text-slate-400 sm:grid-cols-3"><Info icon={MapPin}>{booking.section || "Main Library"}</Info><Info icon={CalendarDays}>{new Date(booking.joiningDate).toLocaleDateString()}</Info><Info icon={Clock3}>Until {new Date(booking.expiryDate).toLocaleDateString()}</Info></div></div>
    {canRenew && <Link to="/renew" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"><RefreshCw size={15} /> Renew</Link>}
  </div></article>;
}
function Info({ icon: Icon, children }) { return <span className="flex items-center gap-2"><Icon size={15} className="text-slate-600" />{children}</span>; }
function Loading() { return <div className="surface-card grid min-h-52 place-items-center"><div className="text-center"><span className="mx-auto block h-9 w-9 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" /><p className="mt-4 text-sm text-slate-500">Loading reservations…</p></div></div>; }
function Empty() { return <div className="surface-card border-dashed py-16 text-center"><Armchair className="mx-auto text-slate-700" size={38} /><h2 className="mt-4 font-semibold">No reservations yet</h2><p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">Your confirmed and previous bookings will appear here.</p><Link to="/bookings" className="mt-5 inline-flex text-sm font-semibold text-indigo-300">Find your first seat →</Link></div>; }
