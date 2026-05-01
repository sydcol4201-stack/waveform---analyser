import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import WaveformChart from "../components/WaveformChart";
import MetricCard from "../components/MetricCard";

export default function Therapy() {
  const { theme, metrics, params, running, mode } = useApp();
  const dark = theme === "dark";
  const [countdown, setCountdown] = useState(20 * 60);
  const [duration, setDuration] = useState(20);
  const [counting, setCounting] = useState(false);

  useEffect(() => {
    if (!counting) return;
    if (countdown <= 0) { setCounting(false); return; }
    const id = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(id);
  }, [counting, countdown]);

  const formatCountdown = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const fatigueLevel = metrics.fatigueIndex < 30 ? "LOW" : metrics.fatigueIndex < 60 ? "MODERATE" : "HIGH";
  const fatigueColor = metrics.fatigueIndex < 30 ? "#00ff88" : metrics.fatigueIndex < 60 ? "#ffd600" : "#ff2244";

  const card = (label, val, sub) => (
    <div className={`rounded-lg border p-3 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
      <div className={`text-[10px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{label}</div>
      <div className="font-mono text-[22px]" style={{ color: "#00e5ff" }}>{val}</div>
      {sub && <div className={`text-[11px] mt-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{sub}</div>}
    </div>
  );

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-[14px] font-bold tracking-[3px] uppercase mb-1" style={{ color: "#00e5ff" }}>Therapy Mode</h1>
        <div className={`text-[11px] tracking-[1px] font-mono ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>CLINICAL CONTROL PANEL</div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {card("RMS Current", `${running ? metrics.rms.toFixed(2) : "0.00"} mA`, "Effective applied")}
        {card("Charge / Pulse", `${running ? metrics.charge.toFixed(2) : "0.00"} nC`, "Per biphasic cycle")}
        {card("Nerve Fatigue", fatigueLevel, `${running ? metrics.fatigueIndex : 0}% load`)}
      </div>

      <div className={`rounded-lg border mb-3 overflow-hidden ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`flex items-center justify-between px-4 py-2 border-b ${dark ? "border-[#0a2535] bg-black/20" : "border-[#d0e4ef]"}`}>
          <span className={`font-mono text-[11px] tracking-[2px] ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>STIMULATION WAVEFORM — THERAPY VIEW</span>
          <span className="text-[10px] px-2 py-1 rounded font-mono" style={{ background: "rgba(255,51,102,0.15)", color: "#ff3366", border: "1px solid rgba(255,51,102,0.3)" }}>BIPHASIC</span>
        </div>
        <WaveformChart type="neural" height={180} />
      </div>

      {/* Fatigue bar */}
      <div className={`rounded-lg border p-4 mb-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`text-[10px] tracking-[2px] uppercase mb-2 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>NERVE FATIGUE INDEX</div>
        <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: "linear-gradient(90deg,#00ff88,#ffd600,#ff2244)" }}>
          <div className="h-full rounded-full" style={{ width: `${running ? metrics.fatigueIndex : 0}%`, background: "rgba(0,0,0,0.3)", transition: "width 0.5s" }} />
        </div>
        <div className="font-mono text-[12px]" style={{ color: dark ? "#4a7a90" : "#7aabb8" }}>
          Current fatigue: <span style={{ color: fatigueColor }}>{fatigueLevel} ({running ? metrics.fatigueIndex : 0}%)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Countdown */}
        <div className={`rounded-lg border p-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
          <div className={`text-[10px] tracking-[2px] uppercase mb-3 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>SESSION COUNTDOWN</div>
          <div className="font-mono text-[40px] text-center mb-2" style={{ color: "#00e5ff" }}>{formatCountdown(countdown)}</div>
          <div className="flex gap-2">
            <select value={duration} onChange={e => { setDuration(+e.target.value); setCountdown(+e.target.value * 60); setCounting(false); }}
              className={`flex-1 px-3 py-2 rounded-lg border text-[13px] outline-none ${dark ? "bg-[#020c12] border-[#0e3a50] text-[#c8e8f5]" : "bg-white border-[#d0e4ef] text-[#1a3a4a]"}`}>
              {[10, 20, 30, 45].map(d => <option key={d} value={d}>{d} minutes</option>)}
            </select>
            <button onClick={() => { setCountdown(duration * 60); setCounting(true); }}
              className="px-4 py-2 rounded-lg font-bold text-[13px] tracking-[1px]"
              style={{ background: "#00e5ff", color: "#020c12" }}>START</button>
          </div>
        </div>

        {/* Mode snapshot */}
        <div className={`rounded-lg border p-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
          <div className={`text-[10px] tracking-[2px] uppercase mb-3 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>MODE COMPARISON SNAPSHOT</div>
          <table className="w-full text-[13px]">
            <thead><tr>
              {["Mode","Tidal Vol","Status"].map(h => <th key={h} className={`text-left text-[10px] tracking-[1px] pb-2 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{h}</th>)}
            </tr></thead>
            <tbody>
              {[
                { mode: "Normal", vol: "~500 mL", status: "STABLE", sc: "#00ff88", bc: "rgba(0,255,136,0.1)" },
                { mode: "Injured", vol: "~150 mL", status: "CRITICAL", sc: "#ff2244", bc: "rgba(255,34,68,0.1)" },
                { mode: "Recovery", vol: "~380 mL", status: "IMPROVING", sc: "#00e5ff", bc: "rgba(0,229,255,0.1)" },
              ].map(r => (
                <tr key={r.mode}>
                  <td className="py-1">{r.mode}</td>
                  <td className="py-1 font-mono" style={{ color: r.sc }}>{r.vol}</td>
                  <td className="py-1"><span className="text-[10px] px-2 py-1 rounded font-bold" style={{ background: r.bc, color: r.sc }}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}