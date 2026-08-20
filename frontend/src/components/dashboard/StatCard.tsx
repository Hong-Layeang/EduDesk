interface StatCardProps {
  label: string;
  value: string;
  helper: string;
}

export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
      <p className="text-xs font-semibold tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{helper}</p>
    </div>
  );
}