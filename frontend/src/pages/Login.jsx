import { useState } from "react";
import { useApp } from "../context/AppContext";

// ─── Neuron Icon ───────────────────────────────────────────────
const NeuronIcon = () => (
  <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
    <div style={{
      width: 90, height: 90, borderRadius: 22,
      background: "#070f18", border: "1px solid #0e3a50",
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
    }}>
      <svg width="82" height="82" viewBox="0 0 82 82" fill="none">
        <path d="M47 54 Q52 60 56 68 Q58 72 62 76" stroke="#e879f9" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <ellipse cx="50.5" cy="57.5" rx="4" ry="2" transform="rotate(52 50.5 57.5)" fill="none" stroke="#f0abfc" strokeWidth="1.2"/>
        <ellipse cx="54" cy="63" rx="4" ry="2" transform="rotate(52 54 63)" fill="none" stroke="#c084fc" strokeWidth="1.2"/>
        <ellipse cx="58" cy="69.5" rx="4" ry="2" transform="rotate(52 58 69.5)" fill="none" stroke="#f0abfc" strokeWidth="1.2"/>
        <circle cx="62" cy="75" r="2.5" fill="#f472b6"/>
        <circle cx="65" cy="72" r="1.5" fill="#e879f9" opacity="0.7"/>
        <circle cx="60" cy="78" r="1.2" fill="#c084fc" opacity="0.8"/>
        <path d="M36 32 Q28 24 22 16" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M28 24 Q20 22 13 18" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M20 21 Q15 17 10 13" stroke="#f97316" strokeWidth="1" strokeLinecap="round" fill="none"/>
        <path d="M13 18 Q9 15 7 10" stroke="#fb923c" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
        <path d="M22 16 Q20 10 18 5" stroke="#ef4444" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M20 11 Q16 8 12 6" stroke="#dc2626" strokeWidth="1" strokeLinecap="round" fill="none"/>
        <path d="M18 5 Q22 3 26 4" stroke="#f87171" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
        <path d="M46 30 Q54 22 60 14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M54 22 Q62 20 68 16" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M62 19 Q68 14 72 10" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" fill="none"/>
        <path d="M68 16 Q72 20 74 14" stroke="#3b82f6" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
        <path d="M60 14 Q62 8 60 4" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M60 9 Q66 6 70 5" stroke="#60a5fa" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
        <path d="M60 4 Q55 2 52 5" stroke="#93c5fd" strokeWidth="0.8" strokeLinecap="round" fill="none"/>
        <path d="M50 40 Q60 38 70 34" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <path d="M60 37 Q68 32 74 26" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M68 32 Q74 30 78 26" stroke="#6ee7b7" strokeWidth="1" strokeLinecap="round" fill="none"/>
        <path d="M70 34 Q76 36 78 42" stroke="#10b981" strokeWidth="1" strokeLinecap="round" fill="none"/>
        <path d="M32 42 Q22 40 12 36" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <path d="M20 39 Q12 34 6 28" stroke="#fbbf24" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M12 34 Q6 34 4 40" stroke="#fcd34d" strokeWidth="1" strokeLinecap="round" fill="none"/>
        <path d="M6 28 Q4 22 6 16" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" fill="none"/>
        <path d="M34 52 Q26 58 18 66" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <path d="M24 60 Q16 62 10 58" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M18 66 Q14 70 10 74" stroke="#67e8f9" strokeWidth="1" strokeLinecap="round" fill="none"/>
        <path d="M10 74 Q8 78 12 80" stroke="#06b6d4" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
        <circle cx="8" cy="6" r="3" fill="#facc15"/>
        <circle cx="74" cy="6" r="2" fill="#60a5fa"/>
        <circle cx="76" cy="48" r="2.5" fill="#f472b6"/>
        <circle cx="5" cy="50" r="2" fill="#34d399"/>
        <circle cx="14" cy="76" r="3" fill="#fb923c"/>
        <circle cx="70" cy="78" r="1.8" fill="#a78bfa"/>
        <circle cx="40" cy="3" r="1.5" fill="#f87171"/>
        <circle cx="30" cy="76" r="1.5" fill="#fcd34d" opacity="0.8"/>
        <circle cx="78" cy="60" r="1.2" fill="#34d399" opacity="0.7"/>
        <circle cx="4" cy="64" r="1.5" fill="#e879f9" opacity="0.8"/>
        <circle cx="41" cy="41" r="14" fill="#1e1040" opacity="0.9"/>
        <circle cx="38" cy="38" r="9" fill="#7c3aed" opacity="0.7"/>
        <circle cx="44" cy="39" r="8" fill="#dc2626" opacity="0.5"/>
        <circle cx="40" cy="44" r="7" fill="#0891b2" opacity="0.5"/>
        <circle cx="43" cy="36" r="5" fill="#059669" opacity="0.5"/>
        <circle cx="41" cy="41" r="6" fill="#0f172a"/>
        <circle cx="41" cy="41" r="4.5" fill="#1e3a5f"/>
        <circle cx="41" cy="41" r="3" fill="#00e5ff" opacity="0.85"/>
        <circle cx="39.5" cy="39.5" r="1.2" fill="#7dd3fc" opacity="0.9"/>
      </svg>
    </div>
  </div>
);

const EyeOpen = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosed = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const BackArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);

// ─── Styles ────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", background: "#020c12", border: "1px solid #0e3a50",
  borderRadius: 10, color: "#c8e8f5", fontSize: 13, padding: "10px 14px",
  outline: "none", fontFamily: "inherit", display: "block", boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const primaryBtn = {
  width: "100%", padding: 11, background: "#00e5ff", color: "#020c12",
  border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700,
  letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
  fontFamily: "inherit",
};

const labelStyle = {
  display: "block", fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
  color: "#2a5a72", marginBottom: 7, marginTop: 14,
};

const backBtnStyle = {
  background: "none", border: "none", color: "#2a5a72", fontSize: 11,
  letterSpacing: 1, cursor: "pointer", padding: 0, marginBottom: 16,
  fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
};

const otpBoxStyle = {
  width: 46, height: 50, background: "#020c12", border: "1px solid #0e3a50",
  borderRadius: 8, color: "#c8e8f5", fontSize: 22, fontWeight: 700,
  textAlign: "center", outline: "none", fontFamily: "inherit",
};

// ─── Main ──────────────────────────────────────────────────────
export default function Login() {
  const { login } = useApp();

  const [step, setStep]           = useState("login");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [role, setRole]           = useState("clinician");
  const [otp, setOtp]             = useState(["", "", "", ""]);
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [msg, setMsg]             = useState({ text: "", error: false });

  // transition state
  const [phase, setPhase] = useState("idle"); // idle | authenticating | success | entering

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setMsg({ text: "Please fill in all fields.", error: true });
      return;
    }

    // Phase 1 — show authenticating
    setPhase("authenticating");
    setMsg({ text: "", error: false });

    setTimeout(() => {
      // Phase 2 — show success flash
      setPhase("success");

      setTimeout(() => {
        // Phase 3 — fade out the whole screen, then enter app
        setPhase("entering");

        setTimeout(() => {
          login(email.trim(), role);
        }, 700); // matches the CSS fade-out duration
      }, 900);
    }, 1000);
  };

  const handleOtp = (val, idx) => {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 3) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleSetPassword = () => {
    if (!newPw.trim() || newPw !== confirmPw) {
      setMsg({
        text: newPw !== confirmPw ? "Passwords don't match." : "Enter a password.",
        error: true,
      });
      return;
    }
    setStep("done");
    setMsg({ text: "", error: false });
  };

  const roleBtn = (r) => ({
    flex: 1, padding: "9px 6px", borderRadius: 10,
    border: `1px solid ${role === r ? "#00e5ff" : "#0e3a50"}`,
    background: role === r ? "rgba(0,229,255,0.07)" : "#020c12",
    color: role === r ? "#00e5ff" : "#4a7a90",
    fontSize: 12, fontWeight: 700, letterSpacing: 1,
    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
  });

  // ── Overlay shown during transition ──────────────────────────
  const TransitionOverlay = () => (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "#020c12",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 28,
      animation: phase === "entering" ? "fadeOutOverlay 0.7s ease forwards" : "fadeInOverlay 0.4s ease forwards",
    }}>
      {/* Neuron pulse ring */}
      <div style={{ position: "relative", width: 90, height: 90 }}>
        <div style={{
          position: "absolute", inset: -12, borderRadius: "50%",
          border: "1.5px solid rgba(0,229,255,0.25)",
          animation: "pingRing 1.2s ease-out infinite",
        }}/>
        <div style={{
          position: "absolute", inset: -24, borderRadius: "50%",
          border: "1px solid rgba(0,229,255,0.12)",
          animation: "pingRing 1.2s ease-out infinite 0.3s",
        }}/>
        <div style={{
          width: 90, height: 90, borderRadius: 22,
          background: "#070f18", border: "1px solid #0e3a50",
          display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}>
          <svg width="82" height="82" viewBox="0 0 82 82" fill="none">
            <path d="M47 54 Q52 60 56 68 Q58 72 62 76" stroke="#e879f9" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <ellipse cx="50.5" cy="57.5" rx="4" ry="2" transform="rotate(52 50.5 57.5)" fill="none" stroke="#f0abfc" strokeWidth="1.2"/>
            <ellipse cx="54" cy="63" rx="4" ry="2" transform="rotate(52 54 63)" fill="none" stroke="#c084fc" strokeWidth="1.2"/>
            <ellipse cx="58" cy="69.5" rx="4" ry="2" transform="rotate(52 58 69.5)" fill="none" stroke="#f0abfc" strokeWidth="1.2"/>
            <circle cx="62" cy="75" r="2.5" fill="#f472b6"/>
            <circle cx="65" cy="72" r="1.5" fill="#e879f9" opacity="0.7"/>
            <circle cx="60" cy="78" r="1.2" fill="#c084fc" opacity="0.8"/>
            <path d="M36 32 Q28 24 22 16" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M28 24 Q20 22 13 18" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M20 21 Q15 17 10 13" stroke="#f97316" strokeWidth="1" strokeLinecap="round" fill="none"/>
            <path d="M22 16 Q20 10 18 5" stroke="#ef4444" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
            <path d="M20 11 Q16 8 12 6" stroke="#dc2626" strokeWidth="1" strokeLinecap="round" fill="none"/>
            <path d="M46 30 Q54 22 60 14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M54 22 Q62 20 68 16" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M60 14 Q62 8 60 4" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <path d="M50 40 Q60 38 70 34" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <path d="M60 37 Q68 32 74 26" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
            <path d="M32 42 Q22 40 12 36" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <path d="M20 39 Q12 34 6 28" stroke="#fbbf24" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
            <path d="M34 52 Q26 58 18 66" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <path d="M24 60 Q16 62 10 58" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <circle cx="8" cy="6" r="3" fill="#facc15"/>
            <circle cx="74" cy="6" r="2" fill="#60a5fa"/>
            <circle cx="76" cy="48" r="2.5" fill="#f472b6"/>
            <circle cx="14" cy="76" r="3" fill="#fb923c"/>
            <circle cx="41" cy="41" r="14" fill="#1e1040" opacity="0.9"/>
            <circle cx="38" cy="38" r="9" fill="#7c3aed" opacity="0.7"/>
            <circle cx="44" cy="39" r="8" fill="#dc2626" opacity="0.5"/>
            <circle cx="40" cy="44" r="7" fill="#0891b2" opacity="0.5"/>
            <circle cx="43" cy="36" r="5" fill="#059669" opacity="0.5"/>
            <circle cx="41" cy="41" r="6" fill="#0f172a"/>
            <circle cx="41" cy="41" r="4.5" fill="#1e3a5f"/>
            <circle cx="41" cy="41" r="3" fill="#00e5ff" opacity="0.85"/>
            <circle cx="39.5" cy="39.5" r="1.2" fill="#7dd3fc" opacity="0.9"/>
          </svg>
        </div>
      </div>

      {/* Status text */}
      <div style={{ textAlign: "center" }}>
        {phase === "authenticating" && (
          <>
            <div style={{ color: "#00e5ff", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
              Authenticating
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#00e5ff",
                  animation: `dotPulse 1s ease-in-out infinite ${i * 0.2}s`,
                }}/>
              ))}
            </div>
          </>
        )}
        {(phase === "success" || phase === "entering") && (
          <>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              border: "2px solid #00e5ff",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px",
              animation: "scaleIn 0.3s ease forwards",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div style={{ color: "#00e5ff", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
              Access Granted
            </div>
            <div style={{ color: "#2a5a72", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>
              Opening Dashboard…
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeInOverlay  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeOutOverlay { from { opacity: 1 } to { opacity: 0 } }
        @keyframes pingRing { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.5); opacity: 0; } }
        @keyframes dotPulse { 0%,80%,100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes scaleIn  { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Transition overlay — shown when authenticating/success/entering */}
      {phase !== "idle" && <TransitionOverlay />}

      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#020c12",
        fontFamily: "'Inter', system-ui, sans-serif",
        // fade out the login card itself as overlay takes over
        transition: "opacity 0.4s ease",
        opacity: phase === "entering" ? 0 : 1,
      }}>
        <div style={{
          width: 360, background: "#040f18", border: "1px solid #0e3a50",
          borderRadius: 18, padding: "36px 32px 28px",
        }}>
          <NeuronIcon />

          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 5, textAlign: "center", color: "#00e5ff", marginBottom: 2 }}>
            SYNAPSE
          </div>
          <div style={{ fontSize: 10, letterSpacing: 4, textAlign: "center", color: "#1e4a60", marginBottom: 10 }}>
            NEURAL RESPIRATORY PLATFORM
          </div>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <span style={{ fontSize: 12, color: "#4a7a90" }}>Welcome back!</span><br />
            <span style={{ fontSize: 12, color: "#4a7a90" }}>Login to your account.</span>
          </div>

          {/* ══ LOGIN ══ */}
          {step === "login" && (
            <>
              <label style={{ ...labelStyle, marginTop: 0 }}>Email</label>
              <input
                style={inputStyle}
                type="email"
                placeholder="you@hospital.org"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />

              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...inputStyle, paddingRight: 40 }}
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
                <span
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%",
                    transform: "translateY(-50%)", cursor: "pointer",
                    color: "#2a5a72", lineHeight: 0, userSelect: "none",
                  }}
                >
                  {showPw ? <EyeClosed /> : <EyeOpen />}
                </span>
              </div>

              <label style={labelStyle}>I am a</label>
              <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                <button style={roleBtn("clinician")} onClick={() => setRole("clinician")}>
                  👩‍⚕️ Clinician
                </button>
                <button style={roleBtn("patient")} onClick={() => setRole("patient")}>
                  🧑 Patient
                </button>
              </div>

              <div style={{ textAlign: "right", marginTop: 10, marginBottom: 18 }}>
                <span
                  onClick={() => { setMsg({ text: "", error: false }); setStep("fp1"); }}
                  style={{ color: "#00e5ff", fontSize: 11, letterSpacing: 1, cursor: "pointer", opacity: 0.85 }}
                >
                  Forgot password?
                </span>
              </div>

              <button style={primaryBtn} onClick={handleLogin}>LOGIN</button>

              {msg.text && (
                <div style={{
                  textAlign: "center", fontSize: 11, marginTop: 12,
                  letterSpacing: 0.5, color: msg.error ? "#f87171" : "#00e5ff",
                }}>
                  {msg.text}
                </div>
              )}
            </>
          )}

          {/* ══ FORGOT — enter email ══ */}
          {step === "fp1" && (
            <>
              <button style={backBtnStyle} onClick={() => setStep("login")}>
                <BackArrow /> Back to login
              </button>
              <div style={{ color: "#c8e8f5", fontSize: 14, fontWeight: 600, marginBottom: 5 }}>
                Reset your password
              </div>
              <div style={{ color: "#4a7a90", fontSize: 11, marginBottom: 16, lineHeight: 1.7 }}>
                Enter the email address linked to your account and we'll send a verification code.
              </div>
              <label style={{ ...labelStyle, marginTop: 0 }}>Email address</label>
              <input style={inputStyle} type="email" placeholder="you@hospital.org" />
              <button style={{ ...primaryBtn, marginTop: 18 }} onClick={() => setStep("otp")}>
                SEND CODE
              </button>
            </>
          )}

          {/* ══ OTP ══ */}
          {step === "otp" && (
            <>
              <button style={backBtnStyle} onClick={() => setStep("fp1")}>
                <BackArrow /> Back
              </button>
              <div style={{ color: "#c8e8f5", fontSize: 14, fontWeight: 600, marginBottom: 5 }}>
                Check your email
              </div>
              <div style={{ color: "#4a7a90", fontSize: 11, lineHeight: 1.7 }}>
                We sent a 4-digit code. It expires in 10 minutes.
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "18px 0" }}>
                {otp.map((val, i) => (
                  <input
                    key={i} id={`otp-${i}`} maxLength={1} value={val}
                    onChange={e => handleOtp(e.target.value, i)}
                    style={otpBoxStyle}
                  />
                ))}
              </div>
              <div style={{ textAlign: "center", fontSize: 11, color: "#2a5a72", marginBottom: 16 }}>
                Didn't get it?{" "}
                <span style={{ color: "#00e5ff", cursor: "pointer" }} onClick={() => setOtp(["", "", "", ""])}>
                  Resend code
                </span>
              </div>
              <button style={primaryBtn} onClick={() => setStep("newpw")}>VERIFY</button>
            </>
          )}

          {/* ══ NEW PASSWORD ══ */}
          {step === "newpw" && (
            <>
              <button style={backBtnStyle} onClick={() => setStep("otp")}>
                <BackArrow /> Back
              </button>
              <div style={{ color: "#c8e8f5", fontSize: 14, fontWeight: 600, marginBottom: 5 }}>
                Create new password
              </div>
              <div style={{ color: "#4a7a90", fontSize: 11, lineHeight: 1.7, marginBottom: 4 }}>
                Must be at least 8 characters.
              </div>
              <label style={labelStyle}>New password</label>
              <input
                style={inputStyle} type="password" placeholder="New password"
                value={newPw} onChange={e => setNewPw(e.target.value)}
              />
              <label style={labelStyle}>Confirm password</label>
              <input
                style={inputStyle} type="password" placeholder="Confirm password"
                value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
              />
              {msg.text && (
                <div style={{ color: "#f87171", fontSize: 11, marginTop: 8, textAlign: "center" }}>
                  {msg.text}
                </div>
              )}
              <button style={{ ...primaryBtn, marginTop: 18 }} onClick={handleSetPassword}>
                SET PASSWORD
              </button>
            </>
          )}

          {/* ══ DONE ══ */}
          {step === "done" && (
            <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                border: "2px solid #00e5ff",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="#00e5ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div style={{ color: "#c8e8f5", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                Password updated!
              </div>
              <div style={{ color: "#4a7a90", fontSize: 11, marginBottom: 22, lineHeight: 1.7 }}>
                Your password has been reset. Log in with your new credentials.
              </div>
              <button style={primaryBtn} onClick={() => {
                setStep("login");
                setNewPw(""); setConfirmPw("");
                setOtp(["", "", "", ""]);
              }}>
                BACK TO LOGIN
              </button>
            </div>
          )}

          <div style={{ textAlign: "center", fontSize: 10, letterSpacing: 2, color: "#142030", marginTop: 20 }}>
            Prototype v1.0
          </div>
        </div>
      </div>
    </>
  );
}