import { useApp } from "../context/AppContext";

const modes = [
  { id: "normal", label: "🟢 Normal", activeClass: "border-green-500 text-green-400 bg-green-900/10" },
  { id: "injured", label: "🔴 Injured", activeClass: "border-red-500 text-red-400 bg-red-900/10" },
  { id: "recovery", label: "🔵 Recovery", activeClass: "border-[#00e5ff] text-[#00e5ff] bg-[rgba(0,229,255,0.07)]" },
];

export default function ModeSelector() {
  const { mode, setMode, theme } = useApp();
  const dark = theme === "dark";

  return (
    <div className="flex gap-2 mb-4">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`flex-1 py-2 rounded-lg border text-[12px] font-bold tracking-[1px] uppercase transition-all
            ${mode === m.id
              ? m.activeClass
              : `${dark ? "border-[#0a2535] text-[#4a7a90] bg-[#061a28]" : "border-[#d0e4ef] text-[#7aabb8] bg-white"} hover:border-[#0e3a50]`
            }`}>
          {m.label}
        </button>
      ))}
    </div>
  );
}