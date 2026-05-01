import { useApp } from "../context/AppContext";

const VIDEOS = [
  { title: "Diaphragmatic Breathing Exercises for SCI", channel: "Rehab Science", id: "bzB9JFs0XKs" },
  { title: "Phrenic Nerve Stimulation Explained", channel: "Medical Education", id: "4N6pjBEZ4OQ" },
  { title: "Breathing Techniques for Spinal Cord Injury", channel: "SCI Recovery", id: "DbLJIaEFIag" },
  { title: "Respiratory Rehabilitation After SCI", channel: "PhysioTutor", id: "MEl3noNXFYg" },
];

const DIET = [
  { icon: "🥗", title: "Anti-Inflammatory Diet", desc: "Reduce systemic inflammation that impairs nerve healing. Focus on omega-3 rich foods, leafy greens, berries, and turmeric." },
  { icon: "💧", title: "Hydration", desc: "Proper hydration maintains mucociliary clearance in the airways. Target 2.5–3L/day to support respiratory function." },
  { icon: "🫘", title: "Protein for Muscle Recovery", desc: "Diaphragm conditioning requires adequate protein. Target 1.2–1.5g/kg body weight. Include lean meats, legumes, dairy." },
  { icon: "🍊", title: "Vitamin C & Antioxidants", desc: "Support nerve repair and reduce oxidative stress in injured spinal tissue. Citrus fruits, bell peppers, spinach." },
  { icon: "🥜", title: "Magnesium", desc: "Supports muscle function and nerve conduction. Found in nuts, seeds, dark chocolate, whole grains." },
  { icon: "🚫", title: "Avoid", desc: "Processed foods, excessive sodium (worsens edema), alcohol (impairs nerve signaling), and smoking (reduces lung capacity)." },
];

const EXERCISES = [
  { icon: "🫁", title: "Pursed Lip Breathing", duration: "5 min", desc: "Inhale through nose for 2 counts, exhale through pursed lips for 4 counts. Reduces breathing effort and improves oxygen exchange." },
  { icon: "🤸", title: "Chest Expansion", duration: "10 min", desc: "Place hands on chest, take deep breath expanding chest laterally. Hold 3 seconds, exhale fully. Prevents atelectasis." },
  { icon: "💆", title: "Diaphragm Strengthening", duration: "15 min", desc: "Belly breathing with light hand resistance. Breathe in expanding abdomen, not chest. Core respiratory conditioning." },
  { icon: "🧘", title: "Pranayama (Yogic Breathing)", duration: "20 min", desc: "Alternate nostril breathing and box breathing (4-4-4-4). Improves respiratory control and reduces anxiety." },
  { icon: "🔄", title: "Incentive Spirometry", duration: "10 min", desc: "Slow maximal inhalation targeting 500mL tidal volume. Prevents post-injury lung complications and maintains capacity." },
  { icon: "🌊", title: "Breath Pacing", duration: "10 min", desc: "Use the Breath Sync Game to practice timed breathing. Match target rhythm for 10 minutes daily for best results." },
];

const ROUTINES = [
  { time: "Morning", icon: "🌅", items: ["Check SpO2 if available", "5 min pursed lip breathing", "Incentive spirometry 10 reps", "Light breakfast — high protein"] },
  { time: "Therapy", icon: "⚡", items: ["Pacing session (prescribed duration)", "Monitor tidal volume progress", "Use Breath Sync Game 10 min", "Record session in app"] },
  { time: "Evening", icon: "🌙", items: ["Diaphragm strengthening exercises", "Anti-inflammatory meal", "Check-in on app", "20 min pranayama before sleep"] },
];

export default function Lifestyle() {
  const { theme } = useApp();
  const dark = theme === "dark";

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-[14px] font-bold tracking-[3px] uppercase mb-1" style={{ color: "#00e5ff" }}>Lifestyle</h1>
        <div className={`text-[11px] font-mono ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>DIET · EXERCISES · ROUTINES · VIDEOS</div>
      </div>

      {/* YouTube Videos */}
      <div className={`rounded-lg border p-4 mb-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`text-[10px] tracking-[2px] uppercase mb-4 font-bold ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
          📹 RELATED VIDEOS
        </div>
        <div className="grid grid-cols-2 gap-4">
          {VIDEOS.map((v, i) => (
            <div key={i} className={`rounded-lg border overflow-hidden ${dark ? "border-[#0a2535]" : "border-[#d0e4ef]"}`}>
              <div className="relative" style={{ paddingBottom: "56.25%", height: 0 }}>
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full border-0"
                />
              </div>
              <div className="p-3">
                <div className="text-[12px] font-bold mb-1">{v.title}</div>
                <div className={`text-[10px] font-mono ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{v.channel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Routine */}
      <div className={`rounded-lg border p-4 mb-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`text-[10px] tracking-[2px] uppercase mb-4 font-bold ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
          📅 DAILY ROUTINE
        </div>
        <div className="grid grid-cols-3 gap-4">
          {ROUTINES.map((r, i) => (
            <div key={i} className={`rounded-lg border p-3 ${dark ? "border-[#0a2535] bg-[#020c12]" : "border-[#d0e4ef] bg-gray-50"}`}>
              <div className="text-[20px] mb-2">{r.icon}</div>
              <div className="font-bold text-[13px] mb-3" style={{ color: "#00e5ff" }}>{r.time}</div>
              {r.items.map((item, j) => (
                <div key={j} className={`flex items-start gap-2 text-[12px] mb-2 ${dark ? "text-[#c8e8f5]" : "text-[#1a3a4a]"}`}>
                  <span style={{ color: "#00e5ff" }}>·</span> {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Breathing Exercises */}
      <div className={`rounded-lg border p-4 mb-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`text-[10px] tracking-[2px] uppercase mb-4 font-bold ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
          🫁 BREATHING EXERCISES
        </div>
        <div className="grid grid-cols-2 gap-3">
          {EXERCISES.map((e, i) => (
            <div key={i} className={`rounded-lg border p-3 ${dark ? "border-[#0a2535] bg-[#020c12]" : "border-[#d0e4ef] bg-gray-50"}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[20px]">{e.icon}</span>
                <div>
                  <div className="font-bold text-[13px]">{e.title}</div>
                  <div className="text-[10px] font-mono" style={{ color: "#00e5ff" }}>{e.duration}</div>
                </div>
              </div>
              <div className={`text-[12px] leading-relaxed ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{e.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Diet */}
      <div className={`rounded-lg border p-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`text-[10px] tracking-[2px] uppercase mb-4 font-bold ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
          🍎 NUTRITION GUIDELINES
        </div>
        <div className="grid grid-cols-3 gap-3">
          {DIET.map((d, i) => (
            <div key={i} className={`rounded-lg border p-3 ${dark ? "border-[#0a2535] bg-[#020c12]" : "border-[#d0e4ef] bg-gray-50"}`}>
              <div className="text-[24px] mb-2">{d.icon}</div>
              <div className="font-bold text-[13px] mb-2">{d.title}</div>
              <div className={`text-[12px] leading-relaxed ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{d.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}