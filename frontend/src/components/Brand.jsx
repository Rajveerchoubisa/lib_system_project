import { Armchair } from "lucide-react";

export default function Brand({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
        <Armchair size={19} strokeWidth={2.3} />
      </span>
      {!compact && <span className="text-lg font-bold tracking-tight text-white">Smart<span className="text-indigo-400">Library</span></span>}
    </span>
  );
}
