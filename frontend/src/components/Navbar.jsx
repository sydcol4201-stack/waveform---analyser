import { useApp } from "../context/AppContext";

const navItems = [
  { section: "MAIN" },
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "therapy", icon: "⚡", label: "Therapy" },
  { id: "game", icon: "🎮", label: "Breath Game" },
  { id: "assistant", icon: "🧠", label: "AI Assistant" },
  { section: "TRACKING" },
  { id: "progress", icon: "📊", label: "Progress" },
  { id: "checkin", icon: "❤️", label: "Daily Check-in" },
  { id: "patients", icon: "👤", label: "Patients" },
  { section: "RESOURCES" },
  { id: "learn", icon: "📚", label: "Learn" },
  { id: "lifestyle", icon: "🍎", label: "Lifestyle" },
  { id: "report", icon: "📄", label: "Report" },
  { section: "" },
  { id: "settings", icon: "⚙️", label: "Settings" },
  { id: "profile", icon: "🔐", label: "Profile" },
];

export default function Navbar({ activePage, setActivePage }) {
  const { user, theme } = useApp();
  const dark = theme === "dark";

  return (
    <div className={`flex flex-col overflow-y-auto border-r ${dark ? "bg-[#040f18] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}
      style={{ width: 210, minWidth: 210 }}>

      {navItems.map((item, i) => {
        if (item.section !== undefined) {
          return item.section ? (
            <div key={i} className="text-[9px] tracking-[3px] px-4 pt-3 pb-1 font-bold"
              style={{ color: dark ? "#4a7a90" : "#7aabb8" }}>
              {item.section}
            </div>
          ) : (
            <div key={i} className={`mx-3 my-1 h-px ${dark ? "bg-[#0a2535]" : "bg-[#d0e4ef]"}`} />
          );
        }

        const isActive = activePage === item.id;

        return (
          <div
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center gap-3 px-4 py-[10px] cursor-pointer text-[13px] font-semibold tracking-[1px] uppercase border-l-2 transition-all
              ${isActive
                ? "border-l-[var(--accent)] text-[var(--accent)] bg-[rgba(0,229,255,0.07)]"
                : `border-l-transparent ${dark ? "text-[#4a7a90] hover:text-[#c8e8f5]" : "text-[#7aabb8] hover:text-[#1a3a4a]"} hover:bg-[rgba(0,229,255,0.04)]`
              }`}>
            <span className="text-[15px] w-5 text-center">{item.icon}</span>
            {item.label}
          </div>
        );
      })}

      {/* Bottom user info */}
      <div className={`mt-auto p-4 border-t ${dark ? "border-[#0a2535]" : "border-[#d0e4ef]"}`}>
        <div className="font-mono text-[10px]" style={{ color: dark ? "#4a7a90" : "#7aabb8" }}>
          <div className="text-[13px] font-bold mb-[2px]" style={{ color: "var(--accent)" }}>
            {user?.name?.toUpperCase()}
          </div>
          {user?.role?.toUpperCase()}
        </div>
      </div>
    </div>
  );
}