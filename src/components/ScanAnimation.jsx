export default function ScanAnimation({ visible }) {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-slate-950/70 p-6 text-center text-text">
      <div className="space-y-4">
        <div className="mx-auto h-20 w-20 rounded-full border-2 border-primary/50 bg-white/5 p-4 shadow-glow">
          <div className="h-full w-full animate-ping rounded-full bg-primary/50" />
        </div>
        <div>
          <div className="text-lg font-semibold">Scanning your code...</div>
          <div className="text-sm text-secondary">Preparing the AI analysis and saving your problem.</div>
        </div>
      </div>
    </div>
  );
}
