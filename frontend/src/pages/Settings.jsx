import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Settings() {
  const { theme, toggleTheme, updateParam, params } = useApp();
  const dark = theme === "dark";
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState(true);
  const [sound, setSound] = useState(true);
  const [autoStop, setAutoStop] = useState(true);
  const [lang, setLang] = useState("English");

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} className="w-10 h-6 rounded-full cursor-pointer relative transition-all"
      style={{ background: on ? "#00e5ff" : (dark ? "#0a2535" : "#d0e4ef") }}>
      <div className="absolute w-4 h-4 bg-white rounded-full top-1 transition-all"
        style={{ left: on ? "22px" : "4px" }} />
    </div>
  );

  const sections = [
    {
      title: "APPEARANCE",
      rows: [
        { label: "Theme", desc: "Switch between dark (clinician) and light (patient) mode", right: <Toggle on={dark} onToggle={toggleTheme} /> },
        { label: "Language", desc: "Interface language", right: (
          <select value={lang} onChange={e => setLang(e.target.value)}
            className={`px-3 py-1 rounded-lg border text-[13px] outline-none ${dark ? "bg-[#020c12] border-[#0e3a50] text-[#c8e8f5]" : "bg-white border-[#d0e4ef] text-[#1a3a4a]"}`}>
            <option>English</option><option>Tamil</option><option>Hindi</option>
          </select>
        )},
      ]
    },
    {
      title: "NOTIFICATIONS & SOUND",
      rows: [
        { label: "Safety Alerts", desc: "Show alerts when parameters exceed safety threshold", right: <Toggle on={notifs} onToggle={() => setNotifs(p => !p)} /> },
        { label: "Voice Feedback", desc: "AI assistant speaks responses aloud", right: <Toggle on={sound} onToggle={() => setSound(p => !p)} /> },
        { label: "Auto-Stop on Threshold", desc: "Automatically pause session when safety limit exceeded", right: <Toggle on={autoStop} onToggle={() => setAutoStop(p => !p)} /> },
      ]
    },
    {
      title: "DEFAULT PARAMETERS",
      rows: [
        { label: "Default Frequency", desc: `Current: ${params.freq} Hz`, right: (
          <input type="number" min="5" max="50" value={params.freq} onChange={e => updateParam("freq", e.target.value)}
            className={`w-20 px-3 py-1 rounded-lg border text-[13px] outline-none font-mono ${dark ? "bg-[#020c12] border-[#0e3a50] text-[#c8e8f5]" : "bg-white border-[#d0e4ef] text-[#1a3a4a]"}`} />
        )},
        { label: "Default Amplitude", desc: `Current: ${params.amp} mA`, right: (
          <input type="number" min="1" max="10" step="0.5" value={params.amp} onChange={e => updateParam("amp", e.target.value)}
            className={`w-20 px-3 py-1 rounded-lg border text-[13px] outline-none font-mono ${dark ? "bg-[#020c12] border-[#0e3a50] text-[#c8e8f5]" : "bg-white border-[#d0e4ef] text-[#1a3a4a]"}`} />
        )},
        { label: "Safety Threshold", desc: `Current: ${params.thresh} mA`, right: (
          <input type="number" min="5" max="10" step="0.5" value={params.thresh} onChange={e => updateParam("thresh", e.target.value)}
            className={`w-20 px-3 py-1 rounded-lg border text-[13px] outline-none font-mono ${dark ? "bg-[#020c12] border-[#0e3a50] text-[#c8e8f5]" : "bg-white border-[#d0e4ef] text-[#1a3a4a]"}`} />
        )},
      ]
    },
    {
      title: "ABOUT",
      rows: [
        { label: "Project", desc: "Non-Invasive Phrenic Nerve Diaphragm Pacing System", right: null },
        { label: "Team", desc: "Akshhatha S G, Nilofar Fathima R", right: null },
        { label: "Guide", desc: "Dinesh A", right: null },
        { label: "Version", desc: "Prototype v1.0", right: <span className="text-[11px] font-mono" style={{ color: "#00e5ff" }}>v1.0.0</span> },
      ]
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-[14px] font-bold tracking-[3px] uppercase mb-1" style={{ color: "#00e5ff" }}>Settings</h1>
        <div className={`text-[11px] font-mono ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>PREFERENCES & CONFIGURATION</div>
      </div>

      {saved && (
        <div className="rounded-lg px-4 py-3 mb-4 font-mono text-[12px]"
          style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.25)", color: "#00ff88" }}>
          ✓ Settings saved successfully
        </div>
      )}

      {sections.map((s, si) => (
        <div key={si} className={`rounded-lg border mb-4 overflow-hidden ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
          <div className={`px-4 py-3 border-b text-[10px] tracking-[2px] font-bold uppercase ${dark ? "border-[#0a2535] text-[#4a7a90] bg-black/20" : "border-[#d0e4ef] text-[#7aabb8]"}`}>
            {s.title}
          </div>
          {s.rows.map((r, ri) => (
            <div key={ri} className={`flex items-center justify-between px-4 py-4 border-b last:border-b-0 ${dark ? "border-[#0a2535]" : "border-[#d0e4ef]"}`}>
              <div>
                <div className="font-semibold text-[14px]">{r.label}</div>
                <div className={`text-[11px] mt-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{r.desc}</div>
              </div>
              {r.right && <div className="ml-4 flex-shrink-0">{r.right}</div>}
            </div>
          ))}
        </div>
      ))}

      <button onClick={saveSettings}
        className="px-6 py-2 rounded-lg font-bold text-[13px] tracking-[1px] uppercase"
        style={{ background: "#00e5ff", color: "#020c12" }}>
        ✓ SAVE SETTINGS
      </button>
    </div>
  );
}