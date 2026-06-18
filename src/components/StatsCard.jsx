export default function StatsCard({ label, value, accent }) {
  return (
    <div className="glass-card rounded-3xl border border-white/10 p-5 shadow-glow">
      <div className="text-sm uppercase tracking-[0.24em] text-secondary">{label}</div>
      <div className={`mt-4 text-3xl font-semibold ${accent}`}>{value}</div>
    </div>
  );
}
