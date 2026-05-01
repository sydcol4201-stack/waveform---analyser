import { useState } from "react";
import { useApp } from "../context/AppContext";
import WaveformChart from "../components/WaveformChart";
import MetricCard from "../components/MetricCard";
import AlertStrip from "../components/AlertStrip";
import ModeSelector from "../components/ModeSelector";

export default function Dashboard() {
  const {
    theme, running, paused, params, metrics,
    updateParam, toggleSession, pauseSession,
    resetSession, sessionTime, mode
  } = useApp();
  const dark = theme === "dark";

  const [advancedView, setAdvancedView] = useState(false);

  const formatSession = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const triggerSOS = () => {
    alert("🚨 SOS ALERT TRIGGERED\nSession snapshot saved.\nAttend to patient immediately.");
  };

  // ── COMPUTED CLINICAL METRICS ──
  const minuteVent = running
    ? ((metrics.tidalVol / 1000) * metrics.breathRate).toFixed(2)
    : "0.00";
  const breathsDelivered = running
    ? Math.floor(sessionTime / (60 / (metrics.breathRate || 12)))
    : 0;
  const totalCharge = running
    ? (metrics.charge * breathsDelivered).toFixed(1)
    : "0.0";

  const stimEfficiency = running ? (metrics.stimEfficiency ?? 0) : 0;

  const sliders = [
    { key: "freq", label: "Frequency", min: 5, max: 50, unit: "Hz" },
    { key: "amp", label: "Amplitude", min: 1, max: 10, step: 0.5, unit: "mA" },
    { key: "pw", label: "Pulse Width", min: 100, max: 500, unit: "µs" },
    { key: "br", label: "Breath Rate", min: 6, max: 25, unit: "/min" },
    { key: "thresh", label: "Safety Limit", min: 5, max: 10, step: 0.5, unit: "mA" },
  ];

  return (
    <div>

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="font-display text-[14px] font-bold tracking-[3px] uppercase"
            style={{ color: "#00e5ff" }}>
            Dashboard
          </h1>
          <div className={`text-[11px] tracking-[1px] font-mono mt-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
            SESSION: {formatSession(sessionTime)}
          </div>
        </div>
        <button
          onClick={triggerSOS}
          className="px-4 py-2 rounded-lg font-display text-[12px] font-bold tracking-[2px] text-white cursor-pointer border-none"
          style={{
            background: "#ff2244",
            boxShadow: "0 0 16px rgba(255,34,68,0.5)",
            animation: "pulse-sos 2s infinite"
          }}>
          🚨 SOS
        </button>
      </div>

      {/* ── STATUS PILLS ── */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {[
          { dot: running ? "bg-green-400" : "bg-yellow-400", label: running ? "System Active" : "System Ready" },
          { dot: running ? "bg-[#00e5ff]" : "bg-yellow-400", label: running ? "Nerve: Active" : "Nerve: Standby" },
          { dot: "bg-green-400", label: "Safety: OK" },
          { dot: running ? "bg-green-400" : "bg-gray-500", label: running ? "Session: Live" : "Session: Idle" },
        ].map((s, i) => (
          <div key={i}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[12px] font-semibold
              ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
            <div className={`w-2 h-2 rounded-full ${s.dot}`} />
            {s.label}
          </div>
        ))}
      </div>

      <AlertStrip />
      <ModeSelector />

      {/* ── MAIN METRICS ── */}
      <div className="grid grid-cols-4 gap-3 mb-3">
        <MetricCard label="Tidal Volume" value={running ? metrics.tidalVol : 0} unit="mL" color="cyan" />
        <MetricCard label="Breath Rate" value={running ? metrics.breathRate : 0} unit="/min" color="green" />
        <MetricCard label="Neural Output" value={running ? metrics.neuralOutput.toFixed(2) : "0.00"} unit="mA" color="neural" />
        <MetricCard label="Fatigue Index" value={running ? metrics.fatigueIndex : 0} unit="%" color="yellow" />
      </div>

      {/* ── EXTRA CLINICAL METRICS ── */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[
          { label: "Minute Vent.", val: minuteVent, unit: "L/min", color: "#00e5ff" },
          { label: "I:E Ratio", val: "1 : 2", unit: "", color: "#00ff88" },
          { label: "Breaths Delivered", val: breathsDelivered, unit: "", color: "#ffd600" },
          { label: "Total Charge", val: totalCharge, unit: "µC", color: "#ff3366" },
          { label: "Stim Efficiency", val: `${stimEfficiency}%`, unit: "", color: "#00e5ff" },
        ].map((m, i) => (
          <div key={i}
            className={`rounded-lg border p-3 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
            <div className={`text-[9px] tracking-[1.5px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
              {m.label}
            </div>
            <div className="font-mono text-[18px] font-bold" style={{ color: m.color }}>
              {m.val}
              {m.unit && (
                <span className={`text-[10px] ml-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
                  {m.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── BIPHASIC STIM CHART — injured/recovery only ── */}
      {mode !== "normal" && (
        <div className={`rounded-lg border mb-3 overflow-hidden ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
          <div className={`flex items-center justify-between px-4 py-2 border-b ${dark ? "border-[#0a2535] bg-black/20" : "border-[#d0e4ef]"}`}>
            <span className={`font-mono text-[11px] tracking-[2px] ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
              BIPHASIC SQUARE WAVEFORM · CURRENT (mA) · X: Time (ms) · Y: Current (mA)
            </span>
            <span className="text-[10px] px-2 py-1 rounded font-mono"
              style={{ background: "rgba(255,51,102,0.15)", color: "#ff3366", border: "1px solid rgba(255,51,102,0.3)" }}>
              {mode === "injured" ? "C3–C5 SCI" : "RECOVERY"}
            </span>
          </div>
          <WaveformChart type="neural" height={280} />
        </div>
      )}

      {/* ── PHRENIC NERVE CHART ── */}
      <div className={`rounded-lg border mb-3 overflow-hidden ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`flex items-center justify-between px-4 py-2 border-b ${dark ? "border-[#0a2535] bg-black/20" : "border-[#d0e4ef]"}`}>
          <span className={`font-mono text-[11px] tracking-[2px] ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
            PHRENIC NERVE COMPOUND ACTION POTENTIAL · AMPLITUDE (mV)
          </span>
          <span className="text-[10px] px-2 py-1 rounded font-mono"
            style={{ background: "rgba(0,229,255,0.1)", color: "#00e5ff", border: "1px solid rgba(0,229,255,0.25)" }}>
            NERVE CAP
          </span>
        </div>
        <WaveformChart type="phrenic" height={280} />
      </div>

      {/* ── RESPIRATORY CHART ── */}
      <div className={`rounded-lg border mb-4 overflow-hidden ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`flex items-center justify-between px-4 py-2 border-b ${dark ? "border-[#0a2535] bg-black/20" : "border-[#d0e4ef]"}`}>
          <span className={`font-mono text-[11px] tracking-[2px] ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
            RESPIRATORY WAVEFORM · VOLUME (L) — TV · IRV · ERV · VC
          </span>
          <span className="text-[10px] px-2 py-1 rounded font-mono"
            style={{ background: "rgba(0,255,136,0.1)", color: "#00ff88", border: "1px solid rgba(0,255,136,0.25)" }}>
            SPIROMETRY
          </span>
        </div>
        <WaveformChart type="tidal" height={280} />
      </div>

      {/* ── EMG CHART — advanced view only ── */}
      {advancedView && (
        <div className={`rounded-lg border mb-3 overflow-hidden ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
          <div className={`flex items-center justify-between px-4 py-2 border-b ${dark ? "border-[#0a2535] bg-black/20" : "border-[#d0e4ef]"}`}>
            <span className={`font-mono text-[11px] tracking-[2px] ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
              DIAPHRAGM EMG · X: Time (s) · Y: Amplitude (µV)
            </span>
            <span className="text-[10px] px-2 py-1 rounded font-mono"
              style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }}>
              EMG
            </span>
          </div>
          <WaveformChart type="emg" height={280} />
        </div>
      )}

      {/* ── STIMULATION EFFICIENCY BAR ── */}
      <div className={`rounded-lg border p-4 mb-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className="flex justify-between items-center mb-2">
          <span className={`text-[10px] tracking-[2px] uppercase font-bold ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
            STIMULATION EFFICIENCY
          </span>
          <span className="font-mono text-[13px]" style={{ color: "#00e5ff" }}>
            {stimEfficiency}%
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-[#0a2535]" : "bg-[#d0e4ef]"}`}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${stimEfficiency}%`,
              background: stimEfficiency > 70
                ? "#00ff88"
                : stimEfficiency > 40
                ? "#ffd600"
                : "#ff2244"
            }} />
        </div>
      </div>

      {/* ── PARAMETER CONTROLS ── */}
      <div className={`rounded-lg border p-4 mb-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`text-[10px] tracking-[2px] uppercase mb-3 font-bold ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
          PARAMETER CONTROLS
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {sliders.map(s => (
            <div key={s.key}>
              <div className="flex justify-between text-[11px] mb-1">
                <span className={dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}>{s.label}</span>
                <span className="font-mono" style={{ color: "#00e5ff" }}>
                  {params[s.key]} {s.unit}
                </span>
              </div>
              <input
                type="range"
                min={s.min} max={s.max} step={s.step || 1}
                value={params[s.key]}
                onChange={e => updateParam(s.key, e.target.value)}
                className="w-full h-[3px] rounded-full outline-none cursor-pointer"
                style={{ accentColor: "#00e5ff" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── SESSION BUTTONS ── */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={toggleSession}
          className="px-6 py-2 rounded-lg font-bold text-[13px] tracking-[1px] uppercase transition-all"
          style={{
            background: running ? "transparent" : "#00e5ff",
            color: running ? "#ff2244" : "#020c12",
            border: running ? "1px solid #ff2244" : "none"
          }}>
          {running ? "⏹ STOP SESSION" : "▶ START SESSION"}
        </button>
        <button onClick={pauseSession}
          className={`px-5 py-2 rounded-lg font-bold text-[13px] tracking-[1px] uppercase border transition-all
            ${dark
              ? "border-[#0e3a50] text-[#4a7a90] hover:border-[#00e5ff] hover:text-[#00e5ff]"
              : "border-[#d0e4ef] text-[#7aabb8]"}`}>
          {paused ? "▶ RESUME" : "⏸ PAUSE"}
        </button>
        <button onClick={resetSession}
          className="px-5 py-2 rounded-lg font-bold text-[13px] tracking-[1px] uppercase border transition-all"
          style={{ borderColor: "#ff2244", color: "#ff2244" }}>
          ↺ RESET
        </button>

        {/* ── VIEW TOGGLE ── */}
        <button
          onClick={() => setAdvancedView(v => !v)}
          className="px-5 py-2 rounded-lg font-bold text-[13px] tracking-[1px] uppercase border transition-all"
          style={{ borderColor: "#f59e0b", color: "#f59e0b" }}>
          {advancedView ? "⬆ BASIC VIEW" : "⬇ ADVANCED VIEW"}
        </button>
      </div>

      <style>{`
        @keyframes pulse-sos {
          0%, 100% { box-shadow: 0 0 16px rgba(255,34,68,0.4); }
          50% { box-shadow: 0 0 28px rgba(255,34,68,0.9); }
        }
      `}</style>
    </div>
  );
}