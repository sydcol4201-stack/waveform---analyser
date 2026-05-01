import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Patients() {
  const { theme, patients, addPatient, removePatient } = useApp();
  const dark = theme === "dark";
  const [form, setForm] = useState({ name: "", age: "", injury: "C4", vent: "Dependent", doctor: "", doi: "", notes: "" });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addPatient(form);
    setForm({ name: "", age: "", injury: "C4", vent: "Dependent", doctor: "", doi: "", notes: "" });
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.injury.includes(search) ||
    p.doctor?.toLowerCase().includes(search.toLowerCase())
  );

  const injuryColor = { C3: "#ff2244", C4: "#ffd600", C5: "#00e5ff" };

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-[14px] font-bold tracking-[3px] uppercase mb-1" style={{ color: "#00e5ff" }}>Patient Records</h1>
        <div className={`text-[11px] font-mono ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>SCI REGISTRY — C3/C4/C5 PATIENTS</div>
      </div>

      {/* Add form */}
      <div className={`rounded-lg border p-4 mb-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`text-[10px] tracking-[2px] uppercase mb-3 font-bold ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>ADD NEW PATIENT</div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            { key: "name", label: "Patient Name", type: "text", placeholder: "Full name" },
            { key: "age", label: "Age", type: "number", placeholder: "Years" },
            { key: "doctor", label: "Physician", type: "text", placeholder: "Dr. Name" },
            { key: "doi", label: "Date of Injury", type: "date" },
          ].map(f => (
            <div key={f.key}>
              <label className={`block text-[10px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border text-[13px] outline-none ${dark ? "bg-[#020c12] border-[#0e3a50] text-[#c8e8f5] focus:border-[#00e5ff]" : "bg-white border-[#d0e4ef] text-[#1a3a4a]"}`} />
            </div>
          ))}
          <div>
            <label className={`block text-[10px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>Injury Level</label>
            <select value={form.injury} onChange={e => setForm(p => ({ ...p, injury: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg border text-[13px] outline-none ${dark ? "bg-[#020c12] border-[#0e3a50] text-[#c8e8f5]" : "bg-white border-[#d0e4ef] text-[#1a3a4a]"}`}>
              <option>C3</option><option>C4</option><option>C5</option>
            </select>
          </div>
          <div>
            <label className={`block text-[10px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>Ventilator Status</label>
            <select value={form.vent} onChange={e => setForm(p => ({ ...p, vent: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg border text-[13px] outline-none ${dark ? "bg-[#020c12] border-[#0e3a50] text-[#c8e8f5]" : "bg-white border-[#d0e4ef] text-[#1a3a4a]"}`}>
              <option>Dependent</option><option>Partial</option><option>Independent</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className={`block text-[10px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>Clinical Notes</label>
          <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="Diagnosis, observations, therapy response..."
            className={`w-full px-3 py-2 rounded-lg border text-[13px] outline-none resize-y min-h-[60px] ${dark ? "bg-[#020c12] border-[#0e3a50] text-[#c8e8f5]" : "bg-white border-[#d0e4ef] text-[#1a3a4a]"}`} />
        </div>
        <button onClick={handleAdd} className="px-6 py-2 rounded-lg font-bold text-[13px] tracking-[1px] uppercase" style={{ background: "#00e5ff", color: "#020c12" }}>
          ⊕ ADD PATIENT
        </button>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input placeholder="🔍 Search by name, injury level, or physician..."
          value={search} onChange={e => setSearch(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border text-[13px] outline-none ${dark ? "bg-[#061a28] border-[#0a2535] text-[#c8e8f5] focus:border-[#00e5ff]" : "bg-white border-[#d0e4ef] text-[#1a3a4a]"}`} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total Patients", val: patients.length, color: "#00e5ff" },
          { label: "Vent Dependent", val: patients.filter(p => p.vent === "Dependent").length, color: "#ff2244" },
          { label: "Independent", val: patients.filter(p => p.vent === "Independent").length, color: "#00ff88" },
        ].map((m, i) => (
          <div key={i} className={`rounded-lg border p-3 text-center ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
            <div className={`text-[9px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{m.label}</div>
            <div className="font-mono text-[24px] font-bold" style={{ color: m.color }}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Patient table */}
      <div className={`rounded-lg border overflow-hidden ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <table className="w-full text-[13px]">
          <thead>
            <tr className={dark ? "bg-black/20" : "bg-gray-50"}>
              {["Name", "Age", "Injury", "Ventilator", "Physician", "Added", "Actions"].map(h => (
                <th key={h} className={`text-left px-4 py-3 text-[10px] tracking-[2px] uppercase font-bold border-b ${dark ? "border-[#0a2535] text-[#4a7a90]" : "border-[#d0e4ef] text-[#7aabb8]"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className={`px-4 py-8 text-center text-[13px] ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>No patients found</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id} className={`border-b cursor-pointer transition-all ${dark ? "border-[#0a2535] hover:bg-[rgba(0,229,255,0.03)]" : "border-[#d0e4ef] hover:bg-blue-50"}`}
                onClick={() => setSelected(selected?.id === p.id ? null : p)}>
                <td className="px-4 py-3 font-bold">{p.name}</td>
                <td className="px-4 py-3 font-mono">{p.age}</td>
                <td className="px-4 py-3">
                  <span className="text-[11px] px-2 py-1 rounded font-bold" style={{ background: `${injuryColor[p.injury]}20`, color: injuryColor[p.injury], border: `1px solid ${injuryColor[p.injury]}40` }}>
                    {p.injury}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] px-2 py-1 rounded font-bold ${p.vent === "Dependent" ? "bg-red-900/20 text-red-400" : p.vent === "Independent" ? "bg-green-900/20 text-green-400" : "bg-yellow-900/20 text-yellow-400"}`}>
                    {p.vent}
                  </span>
                </td>
                <td className="px-4 py-3">{p.doctor || "—"}</td>
                <td className={`px-4 py-3 font-mono text-[11px] ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{p.doi || "—"}</td>
                <td className="px-4 py-3">
                  <button onClick={e => { e.stopPropagation(); removePatient(p.id); }}
                    className="text-[11px] px-2 py-1 rounded border transition-all"
                    style={{ borderColor: "#ff2244", color: "#ff2244" }}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded patient detail */}
      {selected && (
        <div className={`mt-4 rounded-lg border p-4 ${dark ? "bg-[#061a28] border-[#00e5ff]/30" : "bg-white border-[#0099bb]/30"}`}>
          <div className="font-display text-[13px] font-bold mb-3" style={{ color: "#00e5ff" }}>PATIENT DETAIL — {selected.name}</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className={`text-[10px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>Injury Level</div>
              <div className="font-mono font-bold" style={{ color: injuryColor[selected.injury] }}>{selected.injury} — Cervical Spinal Cord Injury</div>
            </div>
            <div>
              <div className={`text-[10px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>Ventilator Status</div>
              <div className="font-bold">{selected.vent}</div>
            </div>
            <div className="col-span-2">
              <div className={`text-[10px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>Clinical Notes</div>
              <div className={`text-[13px] leading-relaxed ${dark ? "text-[#c8e8f5]" : "text-[#1a3a4a]"}`}>{selected.notes || "No notes recorded."}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}