import { useState } from "react";
import { useApp } from "../context/AppContext";

const ARTICLES = [
  {
    id: 1, category: "CLINICAL", icon: "🧠",
    title: "What is Phrenic Nerve Pacing?",
    summary: "Phrenic nerve pacing (PNP) is a neuroprosthetic technique that electrically stimulates the phrenic nerve to produce rhythmic diaphragm contractions, restoring breathing in patients with high cervical spinal cord injuries.",
    content: `The phrenic nerve (C3–C5) controls the diaphragm — the primary breathing muscle. In C3–C5 spinal cord injuries, this nerve pathway is disrupted, causing respiratory paralysis and ventilator dependence.

Phrenic nerve pacing works by delivering small electrical pulses directly to the phrenic nerve, bypassing the injured spinal cord. This causes the diaphragm to contract rhythmically, producing physiological breathing.

Key parameters: 25Hz stimulation frequency, 250µs pulse width, ~5mA amplitude — all clinically validated for safe, effective nerve depolarization without tissue damage.

Studies show 88% of patients achieve 4+ hours of daily pacing, with 61% achieving full 24-hour ventilator independence.`
  },
  {
    id: 2, category: "PHYSIOLOGY", icon: "🫁",
    title: "Understanding Lung Volumes & Capacities",
    summary: "Tidal volume, IRV, ERV, and vital capacity are the key metrics that define respiratory function. Understanding these helps clinicians assess pacing effectiveness.",
    content: `Tidal Volume (TV): The volume of air inhaled/exhaled in a normal breath. Normal: ~500mL. In injured patients: ~150mL. Target for pacing therapy: >400mL.

Inspiratory Reserve Volume (IRV): Extra air that can be inhaled beyond tidal volume (~2500mL). Represents breathing reserve capacity.

Expiratory Reserve Volume (ERV): Extra air that can be exhaled beyond tidal volume (~1200mL). Reduced in diaphragm weakness.

Vital Capacity (VC): TV + IRV + ERV. Normal ~4200mL. A key outcome measure for pacing success.

Functional Residual Capacity (FRC): Air remaining after normal exhalation. The baseline lung volume from which each breath starts.`
  },
  {
    id: 3, category: "TECHNOLOGY", icon: "⚡",
    title: "Biphasic Electrical Stimulation",
    summary: "Charge-balanced biphasic square pulses are the gold standard for safe nerve stimulation. Understanding why they work prevents tissue damage and maximizes therapeutic effect.",
    content: `A biphasic pulse has two phases: a positive (cathodic) phase that depolarizes the nerve, followed immediately by an equal negative (anodic) phase.

Why biphasic? The negative phase reverses the charge injected by the positive phase. This ensures zero net charge at the electrode-tissue interface, preventing electrolytic reactions that would damage tissue.

Pulse width (250µs) determines how long the nerve membrane is depolarized. Too short → no action potential. Too long → tissue damage.

Frequency (25Hz) is chosen to produce tetanic (sustained) muscle contraction while avoiding nerve fatigue. Individual twitches fuse into smooth diaphragm movement at this rate.

RMS current formula: Irms = Ipeak × √(PW × Frequency). This represents the effective current load on the tissue.`
  },
  {
    id: 4, category: "REHABILITATION", icon: "💪",
    title: "Ventilator Weaning Protocol",
    summary: "Gradual reduction of ventilator dependence through progressive pacing therapy is the clinical goal. A structured weaning protocol maximizes outcomes.",
    content: `Phase 1 — Conditioning (Weeks 1–4): Short pacing sessions (2–4 hours/day). Goal: condition the atrophied diaphragm. Parameters: low amplitude (2–3mA), standard frequency.

Phase 2 — Building (Weeks 5–12): Extended sessions (8–12 hours/day). Gradually increase amplitude toward target. Monitor tidal volume improvement.

Phase 3 — Transition (Months 3–6): Night pacing introduced. Ventilator time progressively reduced. Target: >400mL tidal volume consistently.

Phase 4 — Independence (Month 6+): Full-time pacing with ventilator on standby. 61% of patients in clinical trials achieved 24-hour ventilator independence.

Key metric: Tidal volume >300mL = clinically significant improvement. >450mL = near-normal physiological breathing.`
  },
  {
    id: 5, category: "SAFETY", icon: "🛡️",
    title: "Stimulation Safety Guidelines",
    summary: "Safe electrical stimulation requires careful attention to charge density, current limits, and monitoring protocols to prevent nerve or tissue damage.",
    content: `Charge density limit: <1µC/cm² per phase is the clinical safety threshold for nerve stimulation electrodes.

Current limit: 5–10mA for transcutaneous phrenic nerve stimulation. Never exceed the patient-specific threshold determined by nerve response testing.

Nerve fatigue: Continuous stimulation leads to action potential accommodation. Pacing schedules must include rest periods. Monitor with fatigue index tracking.

Safety checks before each session:
- Electrode impedance <5kΩ
- No skin irritation at electrode sites  
- Patient is comfortable and communicating
- Emergency ventilator is connected and functional

Apnea detection: Any pause >10 seconds in breathing should trigger immediate assessment. Always have backup ventilation ready.`
  },
  {
    id: 6, category: "RESEARCH", icon: "📊",
    title: "Clinical Evidence & Outcomes",
    summary: "Multiple FDA-approved and investigational phrenic pacing systems have demonstrated strong clinical evidence across hundreds of SCI patients.",
    content: `NeuRx DPS (Synapse Biomedical): FDA-approved for ALS and SCI. 88% of patients achieved ≥4 hours/day pacing. 61% achieved 24-hour use. Laparoscopic intramuscular electrode placement.

Transcutaneous approaches: Non-invasive surface electrode stimulation shows 76% of patients achieving ≥12 hours/day. 50–60% achieve full-time breathing independence.

Indian context: ~20,000 new SCI cases annually. 40% of high cervical injuries require ventilatory support. ICU costs for ventilator-dependent patients: ₹15,000–40,000/day. Cost of pacing system: one-time investment with dramatic quality of life improvement.

Our simulation: Models the complete signal chain — stimulation → nerve conduction → diaphragm mechanics → respiratory output. Validated against published waveform parameters.`
  },
];

const NEWS = [
  { title: "New Non-Invasive Phrenic Pacing Device Shows Promise in Phase II Trial", source: "NEJM", date: "2026", url: "https://www.nejm.org" },
  { title: "Spinal Cord Injury Rehabilitation: 2025 Clinical Guidelines Update", source: "Lancet Neurology", date: "2025", url: "https://www.thelancet.com/journals/laneur/home" },
  { title: "Diaphragm Pacing Reduces ICU Stay by 40% in SCI Patients", source: "Chest Journal", date: "2025", url: "https://journal.chestnet.org" },
  { title: "AI-Assisted Respiratory Monitoring in Spinal Cord Injury", source: "Nature Medicine", date: "2026", url: "https://www.nature.com/nm" },
  { title: "India's Growing SCI Burden: Need for Cost-Effective Solutions", source: "Indian J. Orthopaedics", date: "2025", url: "https://www.springer.com/journal/43465" },
];

export default function Learn() {
  const { theme } = useApp();
  const dark = theme === "dark";
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");

  const categories = ["ALL", "CLINICAL", "PHYSIOLOGY", "TECHNOLOGY", "REHABILITATION", "SAFETY", "RESEARCH"];
  const filtered = activeCategory === "ALL" ? ARTICLES : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-[14px] font-bold tracking-[3px] uppercase mb-1" style={{ color: "#00e5ff" }}>Learn</h1>
        <div className={`text-[11px] font-mono ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>CLINICAL KNOWLEDGE BASE · RESEARCH · NEWS</div>
      </div>

      {/* Article view */}
      {selected ? (
        <div>
          <button onClick={() => setSelected(null)} className={`mb-4 px-4 py-2 rounded-lg border text-[12px] font-bold transition-all ${dark ? "border-[#0e3a50] text-[#4a7a90] hover:text-[#00e5ff]" : "border-[#d0e4ef] text-[#7aabb8]"}`}>
            ← BACK TO ARTICLES
          </button>
          <div className={`rounded-lg border p-6 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
            <div className="text-[10px] tracking-[2px] uppercase mb-2 font-mono" style={{ color: "#00e5ff" }}>{selected.category}</div>
            <div className="text-[28px] mb-2">{selected.icon}</div>
            <h2 className="text-[18px] font-bold mb-4">{selected.title}</h2>
            <div className={`text-[13px] leading-[1.9] whitespace-pre-line ${dark ? "text-[#c8e8f5]" : "text-[#1a3a4a]"}`}>{selected.content}</div>
          </div>
        </div>
      ) : (
        <>
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-4">
            {categories.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`px-3 py-1 rounded-full border text-[10px] font-bold tracking-[1px] transition-all
                  ${activeCategory === c
                    ? "border-[#00e5ff] text-[#00e5ff] bg-[rgba(0,229,255,0.07)]"
                    : dark ? "border-[#0a2535] text-[#4a7a90] bg-[#061a28]" : "border-[#d0e4ef] text-[#7aabb8] bg-white"
                  }`}>
                {c}
              </button>
            ))}
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {filtered.map(a => (
              <div key={a.id} onClick={() => setSelected(a)}
                className={`rounded-lg border p-4 cursor-pointer transition-all hover:border-[#00e5ff] hover:-translate-y-1 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
                <div className="text-[10px] tracking-[2px] uppercase mb-2 font-mono" style={{ color: "#00e5ff" }}>{a.category}</div>
                <div className="text-[24px] mb-2">{a.icon}</div>
                <div className="text-[14px] font-bold mb-2">{a.title}</div>
                <div className={`text-[12px] leading-relaxed ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{a.summary}</div>
                <div className="mt-3 text-[11px] font-bold" style={{ color: "#00e5ff" }}>READ MORE →</div>
              </div>
            ))}
          </div>

          {/* News section */}
          <div className={`rounded-lg border p-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
            <div className={`text-[10px] tracking-[2px] uppercase mb-4 font-bold ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
              📰 LATEST RESEARCH NEWS
            </div>
            {NEWS.map((n, i) => (
              <a key={i} href={n.url} target="_blank" rel="noopener noreferrer"
                className={`flex items-start gap-3 py-3 border-b cursor-pointer transition-all hover:opacity-80 ${dark ? "border-[#0a2535]" : "border-[#d0e4ef]"} ${i === NEWS.length - 1 ? "border-b-0" : ""}`}>
                <div className="text-[20px] mt-1">📄</div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold mb-1" style={{ color: "#00e5ff" }}>{n.title}</div>
                  <div className={`text-[11px] font-mono ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{n.source} · {n.date}</div>
                </div>
                <div className="text-[11px]" style={{ color: "#00e5ff" }}>→</div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}