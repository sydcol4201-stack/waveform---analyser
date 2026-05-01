import { useApp } from "../context/AppContext";

export default function MetricCard({ label, value, unit, color = "cyan" }) {
  const { theme } = useApp();
  const dark = theme === "dark";

  const colors = {
    cyan: "text-[#00e5ff]",
    green: "text-[#00ff88]",
    red: "text-[#ff2244]",
    yellow: "text-[#ffd600]",
    neural: "text-[#ff3366]",
  };

  return (
    <div className={`rounded-lg border p-3 transition-all ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef] shadow-sm"}`}>
      <div className={`text-[10px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
        {label}
      </div>
      <div className={`font-mono text-[24px] font-bold ${colors[color] || colors.cyan}`}>
        {value}
        {unit && <span className={`text-[11px] ml-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{unit}</span>}
      </div>
    </div>
  );
}