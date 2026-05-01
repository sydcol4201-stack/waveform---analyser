import { useState } from "react";
import { useApp } from "../context/AppContext";

const questions = [
  { id: "feel", title: "How do you feel today?", opts: ["😊 Great", "🙂 Good", "😐 OK", "😓 Tired", "😣 Poor"] },
  { id: "fatigue", title: "Fatigue level today?", opts: ["⚡ None", "🌤 Mild", "⛅ Moderate", "🌧 Severe"] },
  { id: "breath", title: "Breathing difficulty?", opts: ["✅ None", "😮‍💨 Mild", "😤 Moderate", "🆘 Severe"] },
];

export default function Checkin() {
  const { theme, checkins, addCheckin } = useApp();
  const dark = theme === "dark";
  const [answers, setAnswers] = useState({});
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const select = (id, val) => setAnswers(a => ({ ...a, [id]: val }));

  const submit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    addCheckin({ ...answers, notes });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setAnswers({}); setNotes(""); }, 2500);
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-[14px] font-bold tracking-[3px] uppercase mb-1" style={{ color: "#00e5ff" }}>Daily Check-in</h1>
        <div className={`text-[11px] tracking-[1px] font-mono ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{new Date().toDateString().toUpperCase()}</div>
      </div>

      {submitted && (
        <div className="rounded-lg px-4 py-3 mb-4 font-mono text-[13px]" style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.25)", color: "#00ff88" }}>
          ✓ Check-in submitted successfully! Your data has been recorded.
        </div>
      )}

      {questions.map(q => (
        <div key={q.id} className={`rounded-lg border p-4 mb-3 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
          <div className="text-[14px] font-bold mb-3">{q.title}</div>
          <div className="flex gap-2 flex-wrap">
            {q.opts.map(opt => (
              <button key={opt} onClick={() => select(q.id, opt)}
                className={`px-4 py-2 rounded-full border text-[12px] font-semibold transition-all
                  ${answers[q.id] === opt
                    ? "border-[#00e5ff] text-[#00e5ff] bg-[rgba(0,229,255,0.08)]"
                    : `${dark ? "border-[#0a2535] text-[#4a7a90] bg-[#020c12]" : "border-[#d0e4ef] text-[#7aabb8] bg-white"} hover:border-[#0e3a50]`
                  }`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className={`rounded-lg border p-4 mb-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className="text-[14px] font-bold mb-3">Any additional notes?</div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Describe how you feel, any changes you noticed..."
          className={`w-full px-3 py-2 rounded-lg border text-[13px] outline-none resize-y min-h-[70px] ${dark ? "bg-[#020c12] border-[#0e3a50] text-[#c8e8f5]" : "bg-[#f0f6fa] border-[#d0e4ef] text-[#1a3a4a]"}`} />
      </div>

      <button onClick={submit}
        className="px-6 py-2 rounded-lg font-bold text-[13px] tracking-[1px] uppercase mb-6"
        style={{ background: "#00e5ff", color: "#020c12" }}>
        ✓ SUBMIT CHECK-IN
      </button>

      {/* History */}
      {checkins.length > 0 && (
        <div className={`rounded-lg border p-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
          <div className={`text-[10px] tracking-[2px] uppercase mb-3 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>RECENT CHECK-INS</div>
          {checkins.slice(0, 5).map((c, i) => (
            <div key={i} className={`py-2 border-b text-[12px] ${dark ? "border-[#0a2535]" : "border-[#d0e4ef]"}`}>
              <div className="flex justify-between mb-1">
                <span className="font-bold">{c.date} · {c.time}</span>
                <span style={{ color: "#00e5ff" }}>{c.feel}</span>
              </div>
              <div className={dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}>Fatigue: {c.fatigue} · Breathing: {c.breath}</div>
              {c.notes && <div className="mt-1 italic" style={{ color: dark ? "#4a7a90" : "#7aabb8" }}>{c.notes}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}