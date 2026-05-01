import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

export default function Assistant() {
  const { theme, metrics, params, mode, running } = useApp();
  const dark = theme === "dark";

  const [input, setInput] = useState("");
  const [chat, setChat] = useState([
    {
      role: "bot",
      text: "👋 Hello! I'm your AI clinical assistant powered by Gemini. Start a therapy session and I'll monitor your data in real-time. You can also ask me anything about the session.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef(null);
  const prevFatigue = useRef(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const stopSpeaking = () => speechSynthesis.cancel();

  const speak = (text) => {
    stopSpeaking();
    const u = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ""));
    u.rate = 1.05;
    speechSynthesis.speak(u);
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported in this browser"); return; }
    const rec = new SR();
    rec.lang = "en-US";
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      sendMessage(text);
    };
    rec.start();
  };

  const streamText = async (text, callback) => {
    let out = "";
    for (let i = 0; i < text.length; i++) {
      out += text[i];
      callback(out);
      await new Promise(r => setTimeout(r, 8));
    }
  };

  // ── CALL GEMINI DIRECTLY FROM FRONTEND ──
  const callGemini = async (query) => {
    try {
      setLoading(true);
      const API_KEY = "AIzaSyAOhyzRu1zW6eiRDoGGSdeUlvg61rqvx88";

      const prompt = `You are a clinical AI assistant for a Non-Invasive Phrenic Nerve Diaphragm Pacing System used in spinal cord injury (C3-C5) rehabilitation.

Current live session data:
- Mode: ${mode}
- Tidal Volume: ${metrics.tidalVol} mL (target: 500 mL)
- Breath Rate: ${metrics.breathRate} /min
- RMS Current: ${metrics.rms?.toFixed(2)} mA
- Fatigue Index: ${metrics.fatigueIndex}%
- Amplitude: ${params.amp} mA
- Safety Threshold: ${params.thresh} mA
- Pulse Width: ${params.pw} µs
- Frequency: ${params.freq} Hz

Clinical rules:
- If fatigue > 70%: warn about nerve overstimulation risk
- If tidal volume < 300 mL: suggest increasing amplitude
- If amplitude > threshold: urgent safety warning
- If breath rate < 8: check phrenic nerve response

Be concise, clinical and helpful. Max 3 sentences. No markdown formatting.

User question: ${query}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 200,
            },
          }),
        }
      );

      const data = await res.json();

      if (data.error) {
        return `⚠️ Gemini error: ${data.error.message}`;
      }

      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    } catch (e) {
      return `⚠️ Could not reach Gemini: ${e.message}`;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (override) => {
    const text = (override || input).trim();
    if (!text) return;
    setInput("");
    setChat(c => [...c, { role: "user", text }]);

    const aiText = await callGemini(text);
    setChat(c => [...c, { role: "bot", text: "" }]);
    await streamText(aiText, (val) => {
      setChat(c => {
        const copy = [...c];
        copy[copy.length - 1] = { role: "bot", text: val };
        return copy;
      });
    });
    speak(aiText);
  };

  // ── AUTO MONITOR every 10s ──
  useEffect(() => {
    if (!running) return;
    const id = setInterval(async () => {
      const alerts = [];
      if (params.amp > params.thresh) alerts.push("amplitude exceeds safety threshold");
      if (metrics.fatigueIndex > 70) alerts.push("high nerve fatigue detected");
      if (metrics.tidalVol < 300 && metrics.tidalVol > 0) alerts.push("low tidal volume");
      if (metrics.fatigueIndex > prevFatigue.current + 10) alerts.push("fatigue rising rapidly");
      prevFatigue.current = metrics.fatigueIndex;

      if (alerts.length > 0) {
        const query = `Auto-monitor detected: ${alerts.join(", ")}. Give one brief clinical recommendation.`;
        const aiText = await callGemini(query);
        setChat(c => [...c, { role: "bot", text: `🤖 Auto-monitor: ${aiText}` }]);
        speak(aiText);
      }
    }, 10000);
    return () => clearInterval(id);
  }, [running, metrics, params]);

  const quickPrompts = [
    "Is this session going well?",
    "Should I increase amplitude?",
    "What does fatigue index mean?",
    "Explain tidal volume target",
    "Any safety concerns?",
    "What is phrenic nerve pacing?",
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-[14px] font-bold tracking-[3px] uppercase mb-1" style={{ color: "#00e5ff" }}>
          AI Assistant
        </h1>
        <div className={`text-[11px] tracking-[1px] font-mono ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
          POWERED BY GEMINI 2.0 FLASH · CLINICAL MONITORING MODE
        </div>
      </div>

      {/* Live metrics strip */}
      <div className={`rounded-lg border p-3 mb-4 grid grid-cols-4 gap-3 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        {[
          { label: "Tidal Vol", val: `${running ? metrics.tidalVol : "--"} mL`, color: "#00e5ff" },
          { label: "Fatigue", val: `${running ? metrics.fatigueIndex : "--"}%`, color: metrics.fatigueIndex > 70 ? "#ff2244" : "#ffd600" },
          { label: "Breath Rate", val: `${running ? metrics.breathRate : "--"}/min`, color: "#00ff88" },
          { label: "Mode", val: mode.toUpperCase(), color: "#ff3366" },
        ].map((m, i) => (
          <div key={i} className="text-center">
            <div className={`text-[9px] tracking-[2px] uppercase ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{m.label}</div>
            <div className="font-mono text-[14px] font-bold" style={{ color: m.color }}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div className={`rounded-lg border mb-3 overflow-hidden ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`px-4 py-2 border-b text-[10px] tracking-[2px] font-mono ${dark ? "border-[#0a2535] text-[#4a7a90]" : "border-[#d0e4ef] text-[#7aabb8]"}`}>
          CONVERSATION LOG
        </div>
        <div className="h-[340px] overflow-y-auto p-4 flex flex-col gap-3">
          {chat.map((c, i) => (
            <div key={i} className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[82%] rounded-xl px-4 py-2 text-[13px] leading-relaxed
                ${c.role === "user" ? "rounded-br-none" : "rounded-bl-none"}
                ${c.role === "user"
                  ? dark ? "bg-[#0e3a50] text-[#c8e8f5]" : "bg-[#d0e4ef] text-[#1a3a4a]"
                  : dark ? "bg-[#020c12] border border-[#0a2535] text-[#c8e8f5]" : "bg-[#f0f6fa] border border-[#d0e4ef] text-[#1a3a4a]"
                }`}>
                {c.role === "bot" && (
                  <div className="text-[9px] tracking-[2px] mb-1 font-mono" style={{ color: "#00e5ff" }}>
                    🧠 SYNAPSE AI
                  </div>
                )}
                {c.text
                  ? c.text
                  : loading && i === chat.length - 1 && c.role === "bot"
                  ? <span className="animate-pulse text-[#4a7a90]">Analyzing session data...</span>
                  : ""}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Quick prompts */}
      <div className="flex gap-2 flex-wrap mb-3">
        {quickPrompts.map((p, i) => (
          <button key={i} onClick={() => sendMessage(p)}
            className={`px-3 py-1 rounded-full border text-[11px] font-semibold transition-all
              ${dark
                ? "border-[#0a2535] text-[#4a7a90] hover:border-[#00e5ff] hover:text-[#00e5ff] bg-[#061a28]"
                : "border-[#d0e4ef] text-[#7aabb8] hover:border-[#0099bb] bg-white"
              }`}>
            {p}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <button onClick={startListening}
          className={`px-3 py-2 rounded-lg font-bold text-[12px] border transition-all
            ${listening
              ? "bg-red-500 text-white border-red-500"
              : dark ? "border-[#0e3a50] text-[#4a7a90] hover:border-[#00e5ff] hover:text-[#00e5ff]" : "border-[#d0e4ef] text-[#7aabb8]"
            }`}>
          {listening ? "🎤 Listening..." : "🎤"}
        </button>

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask about your session, parameters, or therapy..."
          className={`flex-1 px-4 py-2 rounded-lg border text-[13px] outline-none transition-all
            ${dark
              ? "bg-[#020c12] border-[#0e3a50] text-[#c8e8f5] focus:border-[#00e5ff]"
              : "bg-white border-[#d0e4ef] text-[#1a3a4a] focus:border-[#0099bb]"
            }`}
        />

        <button onClick={() => sendMessage()}
          disabled={loading}
          className="px-5 py-2 rounded-lg font-bold text-[13px] tracking-[1px] uppercase transition-all"
          style={{ background: "#00e5ff", color: "#020c12", opacity: loading ? 0.7 : 1 }}>
          {loading ? "..." : "SEND"}
        </button>

        <button onClick={stopSpeaking}
          className={`px-3 py-2 rounded-lg border text-[12px] transition-all
            ${dark
              ? "border-[#0e3a50] text-[#4a7a90] hover:border-red-500 hover:text-red-400"
              : "border-[#d0e4ef] text-[#7aabb8]"
            }`}>
          🔇
        </button>
      </div>
    </div>
  );
}