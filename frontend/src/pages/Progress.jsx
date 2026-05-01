import { useApp } from "../context/AppContext";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekData = [
  { accuracy: 78, strength: 65, stability: 70 },
  { accuracy: 82, strength: 70, stability: 75 },
  { accuracy: 75, strength: 68, stability: 72 },
  { accuracy: 88, strength: 80, stability: 85 },
  { accuracy: 91, strength: 85, stability: 88 },
  { accuracy: 85, strength: 78, stability: 80 },
  { accuracy: 93, strength: 88, stability: 90 },
];

const achievements = [
  { icon: "🏆", label: "First Session", desc: "Completed first therapy session", done: true },
  { icon: "🔥", label: "7-Day Streak", desc: "7 consecutive days of therapy", done: true },
  { icon: "💪", label: "Strong Lungs", desc: "Tidal volume > 450 mL", done: true },
  { icon: "⚡", label: "Power User", desc: "50 sessions completed", done: false },
  { icon: "🌟", label: "Recovery Star", desc: "Reached recovery mode stability", done: false },
  { icon: "🎯", label: "Perfect Score", desc: "100% accuracy in breath game", done: false },
];

export default function Progress() {
  const { theme, sessionCount } = useApp();
  const dark = theme === "dark";

  const heatData = Array.from({ length: 35 }, (_, i) => ({
    intensity: i < 28 ? Math.floor(Math.random() * 4) : 0,
  }));

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-[14px] font-bold tracking-[3px] uppercase mb-1" style={{ color: "#00e5ff" }}>Progress Tracking</h1>
        <div className={`text-[11px] tracking-[1px] font-mono ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>WEEKLY PERFORMANCE</div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Sessions Done", val: sessionCount, color: "#00e5ff" },
          { label: "Avg Accuracy", val: "84%", color: "#00ff88" },
          { label: "Best Tidal Vol", val: "498 mL", color: "#ffd600" },
          { label: "Recovery Level", val: "3", color: "#00e5ff" },
        ].map(m => (
          <div key={m.label} className={`rounded-lg border p-3 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
            <div className={`text-[10px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{m.label}</div>
            <div className="font-mono text-[24px] font-bold" style={{ color: m.color }}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Weekly bars */}
      <div className={`rounded-lg border p-4 mb-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`text-[10px] tracking-[2px] uppercase mb-4 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>WEEKLY SESSION PERFORMANCE</div>
        <div className="flex gap-2 items-end" style={{ height: 100 }}>
          {weekData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-[2px] items-end" style={{ height: 80 }}>
                {[
                  { val: d.accuracy, color: "#00e5ff" },
                  { val: d.strength, color: "#00ff88" },
                  { val: d.stability, color: "#ffd600" },
                ].map((b, j) => (
                  <div key={j} className="flex-1 rounded-t-sm" style={{ height: `${b.val}%`, background: b.color, opacity: 0.8 }} />
                ))}
              </div>
              <div className={`text-[9px] ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{days[i]}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          {[{ label: "Accuracy", color: "#00e5ff" }, { label: "Strength", color: "#00ff88" }, { label: "Stability", color: "#ffd600" }].map(l => (
            <div key={l.label} className="flex items-center gap-2 text-[11px]" style={{ color: dark ? "#4a7a90" : "#7aabb8" }}>
              <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} /> {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className={`rounded-lg border p-4 mb-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`text-[10px] tracking-[2px] uppercase mb-3 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>THERAPY CALENDAR — Session Heatmap</div>
        <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(7,1fr)" }}>
          {heatData.map((d, i) => {
            const opacities = ["0.1", "0.3", "0.6", "1"];
            return (
              <div key={i} className="h-4 rounded-sm cursor-pointer hover:scale-110 transition-transform"
                title={`Intensity: ${d.intensity}`}
                style={{ background: `rgba(0,229,255,${opacities[d.intensity]})` }} />
            );
          })}
        </div>
        <div className="flex gap-3 mt-3 items-center text-[10px]" style={{ color: dark ? "#4a7a90" : "#7aabb8" }}>
          {["None", "Low", "Medium", "High"].map((l, i) => (
            <div key={l} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: `rgba(0,229,255,${["0.1","0.3","0.6","1"][i]})` }} /> {l}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className={`rounded-lg border p-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`text-[10px] tracking-[2px] uppercase mb-3 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>MILESTONES & ACHIEVEMENTS</div>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map(a => (
            <div key={a.label} className={`rounded-lg border p-3 transition-all ${a.done ? dark ? "border-[#00e5ff]/30 bg-[rgba(0,229,255,0.05)]" : "border-[#0099bb]/30 bg-[rgba(0,153,187,0.05)]" : dark ? "border-[#0a2535] opacity-40" : "border-[#d0e4ef] opacity-40"}`}>
              <div className="text-[24px] mb-1">{a.icon}</div>
              <div className="text-[13px] font-bold">{a.label}</div>
              <div className={`text-[11px] mt-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{a.desc}</div>
              {a.done && <div className="text-[10px] mt-2 font-bold" style={{ color: "#00ff88" }}>✓ UNLOCKED</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}