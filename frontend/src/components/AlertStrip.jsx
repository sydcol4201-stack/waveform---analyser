import { useApp } from "../context/AppContext";

export default function AlertStrip() {
  const { safetyStatus, theme } = useApp();
  const dark = theme === "dark";

  const configs = {
    ok: {
      show: true,
      style: dark
        ? "bg-green-900/10 border border-green-900/40 text-green-400"
        : "bg-green-50 border border-green-200 text-green-700",
      msg: "✓ All parameters within safe range — system nominal",
    },
    warn: {
      show: true,
      style: dark
        ? "bg-yellow-900/10 border border-yellow-900/40 text-yellow-400 animate-pulse"
        : "bg-yellow-50 border border-yellow-200 text-yellow-700 animate-pulse",
      msg: "⚠ Amplitude approaching safety threshold — monitor closely",
    },
    danger: {
      show: true,
      style: dark
        ? "bg-red-900/10 border border-red-900/40 text-red-400 animate-pulse"
        : "bg-red-50 border border-red-200 text-red-700 animate-pulse",
      msg: "✕ SAFETY THRESHOLD EXCEEDED — Reduce amplitude immediately",
    },
  };

  const cfg = configs[safetyStatus];
  if (!cfg?.show) return null;

  return (
    <div className={`rounded-lg px-4 py-2 font-mono text-[12px] tracking-[1px] mb-3 ${cfg.style}`}>
      {cfg.msg}
    </div>
  );
}