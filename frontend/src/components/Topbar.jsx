import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

export default function Topbar({ setActivePage }) {
  const {
    user, logout, theme, toggleTheme,
    mode, params, safetyStatus, sessionTime,
    musicOn, toggleMusic, volume, setVolume,
  } = useApp();

  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0") + ":" +
        String(now.getSeconds()).padStart(2, "0")
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const formatSession = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const badgeStyle = {
    ok:     "bg-green-900/30 text-green-400 border border-green-800",
    warn:   "bg-yellow-900/30 text-yellow-400 border border-yellow-800 animate-pulse",
    danger: "bg-red-900/30 text-red-400 border border-red-800 animate-pulse",
  }[safetyStatus];

  const badgeText = { ok: "NOMINAL", warn: "WARNING", danger: "ALERT" }[safetyStatus];
  const dark = theme === "dark";

  return (
    <div
      className={`h-13 flex items-center justify-between px-5 border-b z-50 relative overflow-hidden ${dark ? "bg-[#040f18] border-[#0e3a50]" : "bg-white border-[#d0e4ef]"}`}
      style={{ height: 52, minHeight: 52 }}>

      {/* Animated scan line */}
      {dark && (
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,#00e5ff,transparent)", animation: "scan 4s linear infinite" }} />
      )}

      {/* Logo */}
      <div>
        <div className="font-display text-[15px] font-black tracking-[3px]" style={{ color: "var(--accent)" }}>
          SYNAPSE
        </div>
        <div className="text-[9px] tracking-[4px]" style={{ color: dark ? "#4a7a90" : "#7aabb8" }}>
          NEURAL RESPIRATORY PLATFORM
        </div>
      </div>

      {/* Center info */}
      <div className="font-mono text-[11px] tracking-[2px]" style={{ color: dark ? "#4a7a90" : "#7aabb8" }}>
        MODE: {mode.toUpperCase()} · {params.freq}Hz · {params.pw}µs · {params.amp}mA · SESSION: {formatSession(sessionTime)}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="font-mono text-[14px] text-green-400">{clock}</div>
        <div className={`font-mono text-[10px] px-3 py-1 rounded ${badgeStyle}`}>{badgeText}</div>

        {/* ── MUSIC CONTROLS ── */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMusic}
            className="px-3 py-1 rounded text-[11px] font-bold tracking-[1px] border transition-all"
            style={{
              borderColor: musicOn ? "#00e5ff" : dark ? "#0e3a50" : "#d0e4ef",
              color: musicOn ? "#00e5ff" : dark ? "#4a7a90" : "#7aabb8",
              background: musicOn ? "rgba(0,229,255,0.07)" : "transparent",
            }}>
            {musicOn ? "🎵 ON" : "🎵 OFF"}
          </button>

          {/* Volume slider — only when music is on */}
          {musicOn && (
            <input
              type="range"
              min="0" max="1" step="0.05"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              style={{ width: 55, accentColor: "#00e5ff", cursor: "pointer" }}
            />
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`px-3 py-1 rounded text-[13px] border transition-all ${dark ? "bg-[#040f18] border-[#0e3a50] text-[#c8e8f5]" : "bg-white border-[#d0e4ef] text-[#1a3a4a]"}`}>
          {dark ? "☀️" : "🌙"}
        </button>

        {/* Profile */}
        <div
          onClick={() => setActivePage("profile")}
          className="px-3 py-1 rounded text-[12px] font-black tracking-[1px] cursor-pointer"
          style={{ background: "var(--accent)", color: "#020c12" }}>
          {user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
        </div>
      </div>

      <style>{`
        @keyframes scan { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
      `}</style>
    </div>
  );
}