import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Armchair, Check, Clock3, PlugZap, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import PageWrapper from "../components/PageWrapper.jsx";

const apiBase = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BookingForm() {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().slice(0, 10));
  const [months, setMonths] = useState(1);
  const [hold, setHold] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const fetchSeats = async () => {
    try {
      const { data } = await axios.get(`${apiBase}/api/bookings/seats`);
      setSeats(data.seats || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load seats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
    const refresh = setInterval(fetchSeats, 15000);
    return () => clearInterval(refresh);
  }, []);

  useEffect(() => {
    if (!hold?.holdExpiresAt) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((new Date(hold.holdExpiresAt) - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (!remaining) {
        setHold(null);
        setSelectedSeat(null);
        fetchSeats();
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [hold?.holdExpiresAt]);

  const groupedSeats = useMemo(
    () => Object.groupBy?.(seats, (seat) => seat.section) || seats.reduce((groups, seat) => {
      (groups[seat.section] ||= []).push(seat);
      return groups;
    }, {}),
    [seats]
  );

  const createHold = async () => {
    if (!selectedSeat) return toast.error("Choose an available seat first");
    setProcessing(true);
    try {
      const idempotencyKey = window.crypto?.randomUUID?.() || `${Date.now()}-${selectedSeat._id}`;
      const { data } = await axios.post(
        `${apiBase}/api/bookings/hold`,
        { seatId: selectedSeat._id, joiningDate, months: Number(months) },
        { headers: { ...authHeaders(), "Idempotency-Key": idempotencyKey } }
      );
      setHold(data.booking);
      toast.success(`${selectedSeat.seatNumber} is held for checkout`);
      await fetchSeats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not hold this seat");
      await fetchSeats();
    } finally {
      setProcessing(false);
    }
  };

  const cancelHold = async () => {
    if (!hold?._id) return;
    try {
      await axios.delete(`${apiBase}/api/bookings/${hold._id}/hold`, { headers: authHeaders() });
      setHold(null);
      setSelectedSeat(null);
      await fetchSeats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not release the hold");
    }
  };

  const pay = async () => {
    if (!(await loadRazorpay())) return toast.error("Razorpay checkout could not load");
    setProcessing(true);
    try {
      const { data } = await axios.post(
        `${apiBase}/api/bookings/${hold._id}/order`,
        {},
        { headers: authHeaders() }
      );
      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "SmartLibrary",
        description: `Seat ${selectedSeat.seatNumber} reservation`,
        handler: async (response) => {
          try {
            await axios.post(
              `${apiBase}/api/bookings/${hold._id}/verify`,
              response,
              { headers: authHeaders() }
            );
            toast.success("Reservation confirmed");
            navigate("/success");
          } catch {
            toast.info("Payment received. Confirmation is being synchronized by webhook.");
            navigate("/my-bookings");
          }
        },
        theme: { color: "#4f46e5" },
        modal: { ondismiss: () => setProcessing(false) },
      });
      checkout.on("payment.failed", () => {
        setProcessing(false);
        toast.error("Payment failed. Your seat remains held until the timer ends.");
      });
      checkout.open();
    } catch (error) {
      setProcessing(false);
      toast.error(error.response?.data?.message || "Could not start payment");
    }
  };

  const timerText = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  return (
    <PageWrapper>
      <Navbar />
      <main className="app-shell min-h-screen px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">Live reservation</p>
              <h1 className="text-3xl font-bold sm:text-4xl">Choose your study seat</h1>
              <p className="mt-2 text-slate-400">A selected seat is locked atomically while you complete payment.</p>
            </div>
            <button onClick={fetchSeats} className="flex items-center gap-2 self-start rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
              <RefreshCw size={16} /> Refresh availability
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <section className="surface-card space-y-6 p-4 sm:p-7">
              <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                <Legend color="bg-emerald-500" label="Available" />
                <Legend color="bg-indigo-500" label="Selected" />
                <Legend color="bg-amber-500" label="On hold" />
                <Legend color="bg-slate-600" label="Reserved" />
              </div>
              {loading ? <p className="py-20 text-center text-slate-400">Loading the seat map…</p> : Object.entries(groupedSeats).map(([section, sectionSeats]) => (
                <div key={section}>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-semibold">{section}</h2>
                    <span className="text-xs text-slate-500">Floor {sectionSeats[0]?.floor}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-10">
                    {sectionSeats.map((seat) => {
                      const available = seat.availability === "available";
                      const selected = selectedSeat?._id === seat._id;
                      return (
                        <button
                          key={seat._id}
                          type="button"
                          disabled={!available || Boolean(hold)}
                          onClick={() => setSelectedSeat(seat)}
                          title={`${seat.seatNumber} · ${seat.amenities?.join(", ") || "Standard desk"}`}
                          className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-xs transition ${selected ? "border-indigo-300 bg-indigo-500 text-white" : available ? "border-emerald-800 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/25" : seat.availability === "held" ? "border-amber-800 bg-amber-500/10 text-amber-300" : "cursor-not-allowed border-slate-700 bg-slate-800 text-slate-500"}`}
                        >
                          <Armchair size={18} /><span>{seat.seatNumber}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>

            <aside className="surface-card h-fit p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-semibold">Reservation summary</h2>
              <div className="mt-5 space-y-4">
                <label className="block text-sm text-slate-300">Joining date
                  <input type="date" min={new Date().toISOString().slice(0, 10)} value={joiningDate} disabled={Boolean(hold)} onChange={(event) => setJoiningDate(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3" />
                </label>
                <label className="block text-sm text-slate-300">Duration
                  <select value={months} disabled={Boolean(hold)} onChange={(event) => setMonths(Number(event.target.value))} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3">
                    {[1, 2, 3, 6, 12].map((value) => <option key={value} value={value}>{value} month{value > 1 ? "s" : ""}</option>)}
                  </select>
                </label>
              </div>

              <div className="my-6 space-y-3 border-y border-slate-800 py-5 text-sm">
                <Summary label="Seat" value={selectedSeat?.seatNumber || "Not selected"} />
                <Summary label="Zone" value={selectedSeat?.section || "—"} />
                <Summary label="Total" value={`₹${months * 750}`} strong />
              </div>

              {hold ? (
                <>
                  <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-amber-500/10 p-3 text-amber-300"><Clock3 size={18} /> Hold expires in {timerText}</div>
                  <button disabled={processing || !secondsLeft} onClick={pay} className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50"><ShieldCheck size={18} /> Pay securely</button>
                  <button onClick={cancelHold} className="mt-3 w-full py-2 text-sm text-slate-400 hover:text-white">Release seat</button>
                </>
              ) : (
                <button disabled={!selectedSeat || processing} onClick={createHold} className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-semibold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"><Check size={18} /> {processing ? "Locking seat…" : "Hold seat for payment"}</button>
              )}
              <p className="mt-4 flex gap-2 text-xs leading-5 text-slate-500"><PlugZap size={15} className="shrink-0" /> Price and availability are verified again by the server.</p>
            </aside>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}

function Legend({ color, label }) {
  return <span className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}</span>;
}

function Summary({ label, value, strong }) {
  return <div className="flex justify-between gap-4"><span className="text-slate-500">{label}</span><span className={strong ? "text-lg font-bold text-white" : "text-slate-200"}>{value}</span></div>;
}
