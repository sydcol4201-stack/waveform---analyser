import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

const LEVELS = [
  { name: "Beginner", speed: 0.008, targetWidth: 120, points: 10 },
  { name: "Intermediate", speed: 0.012, targetWidth: 90, points: 20 },
  { name: "Advanced", speed: 0.016, targetWidth: 60, points: 30 },
  { name: "Expert", speed: 0.022, targetWidth: 40, points: 50 },
];

const ACHIEVEMENTS = [
  { id: "first", label: "First Breath", desc: "Complete first round", icon: "🌱", req: (s) => s >= 10 },
  { id: "streak5", label: "On a Roll", desc: "5 streak", icon: "🔥", req: (s, st) => st >= 5 },
  { id: "score100", label: "Century", desc: "Score 100+", icon: "💯", req: (s) => s >= 100 },
  { id: "score500", label: "Lung Master", desc: "Score 500+", icon: "🏆", req: (s) => s >= 500 },
  { id: "perfect", label: "Perfect Timing", desc: "10 streak", icon: "⭐", req: (s, st) => st >= 10 },
];

export default function Game() {
  const { theme } = useApp();
  const dark = theme === "dark";
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [level, setLevel] = useState(0);
  const [accuracy, setAccuracy] = useState(null);
  const [feedback, setFeedback] = useState("Press START to begin your breathing exercise!");
  const [feedbackColor, setFeedbackColor] = useState("#00e5ff");
  const [inhaling, setInhaling] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);
  const [totalHits, setTotalHits] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const gameState = useRef({
    ballX: 0, ballY: 0,
    targetX: 0,
    phase: 0,
    inhaling: false,
    score: 0, streak: 0, level: 0,
    hits: 0, attempts: 0,
  });

  const checkAchievements = (s, st) => {
    ACHIEVEMENTS.forEach(a => {
      if (!unlockedAchievements.includes(a.id) && a.req(s, st)) {
        setUnlockedAchievements(p => [...p, a.id]);
        setShowAchievement(a);
        setTimeout(() => setShowAchievement(null), 3000);
      }
    });
  };

  const startGame = () => {
    const gs = gameState.current;
    gs.phase = 0; gs.score = 0; gs.streak = 0;
    gs.hits = 0; gs.attempts = 0;
    setScore(0); setStreak(0); setAccuracy(null);
    setFeedback("🫁 Match the breathing rhythm!");
    setGameRunning(true);
  };

  const resetGame = () => {
    cancelAnimationFrame(animRef.current);
    setGameRunning(false);
    setScore(0); setStreak(0); setAccuracy(null);
    setFeedback("Press START to begin your breathing exercise!");
    gameState.current.phase = 0;
  };

  const handleInhale = (active) => {
    setInhaling(active);
    gameState.current.inhaling = active;
  };

  useEffect(() => {
    if (!gameRunning) return;
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const gs = gameState.current;
    const lvl = LEVELS[gs.level];

    gs.ballX = 60;
    gs.targetX = w * 0.6 + Math.random() * (w * 0.3);

    const tick = () => {
      gs.phase += lvl.speed;
      const breathY = h * 0.5 - Math.sin(gs.phase) * (h * 0.35);
      gs.ballX = 60;
      gs.ballY = breathY;

      // Draw
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = dark ? "#020c12" : "#f0f6fa";
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = dark ? "rgba(14,58,80,0.5)" : "rgba(180,210,230,0.4)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 8; i++) {
        const x = (i / 8) * w;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let i = 0; i <= 4; i++) {
        const y = (i / 4) * h;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Target wave (guide)
      ctx.strokeStyle = dark ? "rgba(0,229,255,0.2)" : "rgba(0,150,180,0.2)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const phase = gs.phase + (x - 60) * lvl.speed * 0.5;
        const y = h * 0.5 - Math.sin(phase) * (h * 0.35);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Inhale/Exhale zone labels
      ctx.font = "bold 11px 'Share Tech Mono'";
      ctx.fillStyle = dark ? "rgba(0,255,136,0.5)" : "rgba(0,150,80,0.5)";
      ctx.textAlign = "right";
      ctx.fillText("INHALE", w - 10, h * 0.18);
      ctx.fillStyle = dark ? "rgba(255,214,0,0.5)" : "rgba(180,130,0,0.5)";
      ctx.fillText("EXHALE", w - 10, h * 0.88);

      // Target zone
      const targetY = h * 0.5 - Math.sin(gs.phase + (gs.targetX - 60) * lvl.speed * 0.5) * (h * 0.35);
      ctx.beginPath();
      ctx.arc(gs.targetX, targetY, lvl.targetWidth / 2, 0, Math.PI * 2);
      ctx.strokeStyle = dark ? "rgba(0,255,136,0.6)" : "rgba(0,180,100,0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = dark ? "rgba(0,255,136,0.08)" : "rgba(0,180,100,0.08)";
      ctx.fill();
      ctx.font = "9px 'Share Tech Mono'";
      ctx.fillStyle = dark ? "rgba(0,255,136,0.7)" : "rgba(0,150,80,0.7)";
      ctx.textAlign = "center";
      ctx.fillText("TARGET", gs.targetX, targetY - lvl.targetWidth / 2 - 6);

      // Ball trail
      for (let i = 5; i > 0; i--) {
        const trailPhase = gs.phase - i * lvl.speed * 3;
        const trailY = h * 0.5 - Math.sin(trailPhase) * (h * 0.35);
        ctx.beginPath();
        ctx.arc(60, trailY, 8 - i, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,51,102,${0.08 * i})`;
        ctx.fill();
      }

      // Ball
      const ballColor = gs.inhaling ? "#00ff88" : "#ff3366";
      ctx.beginPath();
      ctx.arc(gs.ballX, gs.ballY, 12, 0, Math.PI * 2);
      ctx.fillStyle = ballColor;
      ctx.shadowColor = ballColor;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Ball label
      ctx.font = "bold 8px 'Share Tech Mono'";
      ctx.fillStyle = "#020c12";
      ctx.textAlign = "center";
      ctx.fillText(gs.inhaling ? "IN" : "OUT", gs.ballX, gs.ballY + 3);

      // Score display on canvas
      ctx.font = "bold 14px 'Orbitron'";
      ctx.fillStyle = dark ? "#00e5ff" : "#0099bb";
      ctx.textAlign = "left";
      ctx.fillText(`SCORE: ${gs.score}`, 10, 24);
      ctx.fillStyle = dark ? "#ffd600" : "#cc9900";
      ctx.fillText(`STREAK: ${gs.streak}`, 10, 44);
      ctx.fillStyle = dark ? "#4a7a90" : "#7aabb8";
      ctx.font = "10px 'Share Tech Mono'";
      ctx.fillText(`LEVEL: ${LEVELS[gs.level].name.toUpperCase()}`, 10, 62);

      // Move target and check hit
      gs.targetX -= lvl.speed * w * 0.4;
      if (gs.targetX < 60) {
        gs.attempts++;
        setTotalAttempts(gs.attempts);
        const dist = Math.abs(gs.ballY - targetY);
        if (dist < lvl.targetWidth / 2) {
          // HIT
          gs.hits++;
          gs.score += lvl.points + gs.streak * 2;
          gs.streak++;
          setScore(gs.score);
          setStreak(gs.streak);
          setBestStreak(b => Math.max(b, gs.streak));
          setTotalHits(gs.hits);
          setFeedback(["Perfect! 🎯", "Great timing! ✨", "Excellent! 💪", "Keep it up! 🔥"][Math.floor(Math.random() * 4)]);
          setFeedbackColor("#00ff88");
          checkAchievements(gs.score, gs.streak);
          // Level up
          if (gs.score > 100 && gs.level < 1) gs.level = 1;
          if (gs.score > 250 && gs.level < 2) gs.level = 2;
          if (gs.score > 500 && gs.level < 3) gs.level = 3;
          setLevel(gs.level);
        } else {
          // MISS
          gs.streak = 0;
          setStreak(0);
          setFeedback(["Try to match the rhythm 🫁", "Keep breathing steadily...", "Focus on the target zone!"][Math.floor(Math.random() * 3)]);
          setFeedbackColor("#ffd600");
        }
        gs.targetX = w * 0.7 + Math.random() * (w * 0.25);
        setAccuracy(gs.attempts > 0 ? Math.round((gs.hits / gs.attempts) * 100) : 0);
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [gameRunning, dark]);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-[14px] font-bold tracking-[3px] uppercase mb-1" style={{ color: "#00e5ff" }}>
          Breath Sync Game
        </h1>
        <div className={`text-[11px] tracking-[1px] font-mono ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
          MATCH THE RHYTHM · TRAIN YOUR BREATHING
        </div>
      </div>

      {/* Achievement popup */}
      {showAchievement && (
        <div className="fixed top-16 right-4 z-50 rounded-xl border px-5 py-3 flex items-center gap-3 animate-bounce"
          style={{ background: dark ? "#061a28" : "#fff", border: "1px solid #00ff88", boxShadow: "0 0 20px rgba(0,255,136,0.3)" }}>
          <span className="text-[28px]">{showAchievement.icon}</span>
          <div>
            <div className="font-bold text-[13px]" style={{ color: "#00ff88" }}>🏆 UNLOCKED: {showAchievement.label}</div>
            <div className={`text-[11px] ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{showAchievement.desc}</div>
          </div>
        </div>
      )}

      {/* Score row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Score", val: score, color: "#00e5ff" },
          { label: "Accuracy", val: accuracy !== null ? `${accuracy}%` : "--", color: "#00ff88" },
          { label: "Streak", val: streak, color: "#ffd600" },
          { label: "Level", val: LEVELS[level].name, color: "#ff3366" },
        ].map((m, i) => (
          <div key={i} className={`rounded-lg border p-3 text-center ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
            <div className={`text-[9px] tracking-[2px] uppercase mb-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{m.label}</div>
            <div className="font-mono text-[20px] font-bold" style={{ color: m.color }}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Game canvas */}
      <div className={`rounded-lg border mb-3 overflow-hidden ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`px-4 py-2 border-b flex justify-between items-center ${dark ? "border-[#0a2535]" : "border-[#d0e4ef]"}`}>
          <span className={`font-mono text-[11px] tracking-[2px] ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
            BREATHING SYNC ARENA · BEST STREAK: {bestStreak}
          </span>
          <span className="text-[10px] px-2 py-1 rounded font-mono"
            style={{ background: "rgba(0,255,136,0.1)", color: "#00ff88", border: "1px solid rgba(0,255,136,0.25)" }}>
            {gameRunning ? "● LIVE" : "○ IDLE"}
          </span>
        </div>
        <canvas ref={canvasRef} height={280} style={{ width: "100%", height: 280, display: "block" }} />
      </div>

      {/* Feedback */}
      <div className={`rounded-lg border p-3 mb-4 text-center ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className="font-bold text-[15px]" style={{ color: feedbackColor }}>{feedback}</div>
        {accuracy !== null && (
          <div className={`text-[11px] mt-1 font-mono ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>
            Hits: {totalHits} / {totalAttempts} attempts
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <button onClick={gameRunning ? resetGame : startGame}
          className="px-6 py-2 rounded-lg font-bold text-[13px] tracking-[1px] uppercase"
          style={{ background: gameRunning ? "transparent" : "#00e5ff", color: gameRunning ? "#ff2244" : "#020c12", border: gameRunning ? "1px solid #ff2244" : "none" }}>
          {gameRunning ? "⏹ STOP" : "▶ START GAME"}
        </button>
        <button onClick={resetGame}
          className={`px-5 py-2 rounded-lg font-bold text-[13px] tracking-[1px] uppercase border ${dark ? "border-[#0e3a50] text-[#4a7a90]" : "border-[#d0e4ef] text-[#7aabb8]"}`}>
          ↺ RESET
        </button>
        <button
          onMouseDown={() => handleInhale(true)}
          onMouseUp={() => handleInhale(false)}
          onTouchStart={() => handleInhale(true)}
          onTouchEnd={() => handleInhale(false)}
          className="flex-1 py-2 rounded-lg font-bold text-[14px] tracking-[1px] uppercase transition-all"
          style={{
            background: inhaling ? "#00ff88" : "transparent",
            color: inhaling ? "#020c12" : "#00ff88",
            border: "2px solid #00ff88",
            boxShadow: inhaling ? "0 0 20px rgba(0,255,136,0.5)" : "none"
          }}>
          🫁 {inhaling ? "INHALING..." : "HOLD TO INHALE"}
        </button>
      </div>

      {/* How to play */}
      <div className={`rounded-lg border p-4 mb-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`text-[10px] tracking-[2px] uppercase mb-3 font-bold ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>HOW TO PLAY</div>
        <div className={`text-[13px] leading-relaxed ${dark ? "text-[#c8e8f5]" : "text-[#1a3a4a]"}`}>
          🔴 <strong>Red ball</strong> = your breathing. It moves up and down following the wave.<br />
          🟢 <strong>Green circle</strong> = target zone. Try to be inside it when it reaches the left.<br />
          🫁 <strong>Hold INHALE</strong> when the ball is going UP. Release when going DOWN.<br />
          ⭐ <strong>Score more</strong> by building streaks — each hit in a row multiplies points!
        </div>
      </div>

      {/* Achievements */}
      <div className={`rounded-lg border p-4 ${dark ? "bg-[#061a28] border-[#0a2535]" : "bg-white border-[#d0e4ef]"}`}>
        <div className={`text-[10px] tracking-[2px] uppercase mb-3 font-bold ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>ACHIEVEMENTS</div>
        <div className="grid grid-cols-5 gap-2">
          {ACHIEVEMENTS.map(a => (
            <div key={a.id} className={`rounded-lg border p-2 text-center transition-all ${unlockedAchievements.includes(a.id) ? "border-[#00ff88]/40 bg-[rgba(0,255,136,0.05)]" : dark ? "border-[#0a2535] opacity-40" : "border-[#d0e4ef] opacity-40"}`}>
              <div className="text-[20px] mb-1">{a.icon}</div>
              <div className="text-[10px] font-bold">{a.label}</div>
              <div className={`text-[9px] mt-1 ${dark ? "text-[#4a7a90]" : "text-[#7aabb8]"}`}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}