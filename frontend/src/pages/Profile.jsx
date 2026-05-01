import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Profile() {
  const { theme, user, logout, sessionCount, checkins } = useApp();
  const dark = theme === "dark";
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [condition, setCondition] = useState("C4 Spinal Cord Injury");
  const [therapyStart, setTherapyStart] = useState("2025-01-15");
  const [notes, setNotes] = useState("Patient responding well to phrenic nerve pacing therapy.");

  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "??";

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-[14px] font-bold tracking-[3px] uppercase mb-1" style={{ color: "#00e5ff" }}>Profile</h1>
        <div className={`text-[11px] font-mono ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>USER ACCOUNT & MEDICAL HISTORY</div>
      </div>

      {/* Profile card */}
      <div className={`rounded-lg border p-6 mb-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center font-display text-[22px] font-black"
            style={{ background: "rgba(0,229,255,0.15)", border: "2px solid #00e5ff", color: "#00e5ff" }}>
            {initials}
          </div>
          <div>
            <div className="text-[20px] font-bold">{user?.name}</div>
            <div className="text-[12px] font-mono mt-1" style={{ color: "#00e5ff" }}>{user?.role?.toUpperCase()}</div>
            <div className={`text-[11px] mt-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>SYNAPSE Neural Respiratory Platform</div>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={() => setEditing(e => !e)}
              className={`px-4 py-2 rounded-lg border font-bold text-[12px] transition-all ${dark ? "border-[#0e3a50] text-[#4a7a90] hover:border-[#00e5ff] hover:text-[#00e5ff]" : "border-[#d0e4ef] text-[#7aabb8]"}`}>
              {editing ? "✓ DONE" : "✏ EDIT"}
            </button>
            <button onClick={logout}
              className="px-4 py-2 rounded-lg border font-bold text-[12px] transition-all"
              style={{ borderColor: "#ff2244", color: "#ff2244" }}>
              LOGOUT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Full Name", val: name, set: setName, editable: true },
            { label: "Role", val: user?.role || "", set: null, editable: false },
            { label: "Medical Condition", val: condition, set: setCondition, editable: true },
            { label: "Therapy Start Date", val: therapyStart, set: setTherapyStart, editable: true, type: "date" },
          ].map((f, i) => (
            <div key={i}>
              <label className={`block text-[10px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{f.label}</label>
              {editing && f.editable ? (
                <input type={f.type || "text"} value={f.val} onChange={e => f.set(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-[13px] outline-none ${dark ? "bg-[#020c12] border-[#0e3a50] text-[#c8e8f5] focus:border-[#00e5ff]" : "bg-white border-[#d0e4ef] text-[#1a3a4a]"}`} />
              ) : (
                <div className="font-semibold text-[14px]">{f.val}</div>
              )}
            </div>
          ))}
          <div className="col-span-2">
            <label className={`block text-[10px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>Clinical Notes</label>
            {editing ? (
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-[13px] outline-none resize-y min-h-[60px] ${dark ? "bg-[#020c12] border-[#0e3a50] text-[#c8e8f5] focus:border-[#00e5ff]" : "bg-white border-[#d0e4ef] text-[#1a3a4a]"}`} />
            ) : (
              <div className={`text-[13px] leading-relaxed ${dark ? "text-[#c8e8f5]" : "text-[#1a3a4a]"}`}>{notes}</div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total Sessions", val: sessionCount, color: "#00e5ff" },
          { label: "Check-ins Done", val: checkins.length, color: "#00ff88" },
          { label: "Days Active", val: Math.max(1, Math.floor(sessionCount * 1.4)), color: "#ffd600" },
        ].map((m, i) => (
          <div key={i} className={`rounded-lg border p-4 text-center ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
            <div className={`text-[9px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{m.label}</div>
            <div className="font-mono text-[28px] font-bold" style={{ color: m.color }}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Recovery timeline */}
      <div className={`rounded-lg border p-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`text-[10px] tracking-[2px] uppercase mb-4 font-bold ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>RECOVERY TIMELINE</div>
        {[
          { phase: "Phase 1 — Conditioning", period: "Weeks 1–4", status: "COMPLETED", color: "#00ff88", desc: "Initial diaphragm conditioning at low amplitude" },
          { phase: "Phase 2 — Building", period: "Weeks 5–12", status: "IN PROGRESS", color: "#ffd600", desc: "Extended sessions, tidal volume improvement" },
          { phase: "Phase 3 — Transition", period: "Months 3–6", status: "UPCOMING", color: "#4a7a90", desc: "Night pacing, progressive ventilator reduction" },
          { phase: "Phase 4 — Independence", period: "Month 6+", status: "UPCOMING", color: "#4a7a90", desc: "Full-time pacing, ventilator on standby" },
        ].map((p, i) => (
          <div key={i} className={`flex gap-4 pb-4 ${i < 3 ? "border-b mb-4" : ""} ${dark ? "border-[#0a2535]" : "border-[#d0e4ef]"}`}>
            <div className="w-2 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full mt-1" style={{ background: p.color, boxShadow: `0 0 6px ${p.color}` }} />
              {i < 3 && <div className="w-px flex-1 mt-1" style={{ background: dark ? "#0a2535" : "#d0e4ef" }} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="font-bold text-[13px]">{p.phase}</div>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: `${p.color}20`, color: p.color }}>{p.status}</span>
              </div>
              <div className={`text-[11px] font-mono mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{p.period}</div>
              <div className={`text-[12px] ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}