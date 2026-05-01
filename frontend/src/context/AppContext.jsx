import { createContext, useContext, useState, useRef, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  // ── AUTH ──────────────────────────────────────────────
  const [user, setUser] = useState(null);

  // ── THEME ─────────────────────────────────────────────
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  // ── SIMULATION STATE ──────────────────────────────────
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState("normal");

  // ── PARAMETERS ────────────────────────────────────────
  const [params, setParams] = useState({
    freq: 25, amp: 5, pw: 250, br: 12, thresh: 8
  });

  // ── METRICS ───────────────────────────────────────────
  const [metrics, setMetrics] = useState({
    tidalVol: 0, neuralOutput: 0, rms: 0,
    breathRate: 0, fatigueIndex: 0, charge: 0
  });

  // ── SESSION ───────────────────────────────────────────
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const sessionRef = useRef(null);

  // ── PATIENTS ──────────────────────────────────────────
  const [patients, setPatients] = useState([
    { id: 1, name: "Ravi Kumar", age: 34, injury: "C4", vent: "Dependent", doctor: "Dr. Akshhatha", date: "2025-01-10", notes: "Post-accident SCI" },
    { id: 2, name: "Meena S", age: 28, injury: "C3", vent: "Partial", doctor: "Dr. Nilofar", date: "2025-03-05", notes: "Improving response" },
  ]);

  // ── CHECK-INS ─────────────────────────────────────────
  const [checkins, setCheckins] = useState([]);

  // ── GAME ──────────────────────────────────────────────
  const [gameScore, setGameScore] = useState(0);
  const [gameAccuracy, setGameAccuracy] = useState(null);
  const [gameStreak, setGameStreak] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);

  // ── ALERTS ────────────────────────────────────────────
  const [alerts, setAlerts] = useState([]);
  const addAlert = (msg) => setAlerts(a => [{ msg, time: new Date().toLocaleTimeString() }, ...a].slice(0, 20));

  // ── MUSIC ─────────────────────────────────────────────
  const audioRef = useRef(null);
  const [musicOn, setMusicOn] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    const audio = new Audio('/bg-music.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setMusicOn(v => !v);
  };

  // ── SESSION TIMER ─────────────────────────────────────
  useEffect(() => {
    if (running && !paused) {
      sessionRef.current = setInterval(() => setSessionTime(t => t + 1), 1000);
    } else {
      clearInterval(sessionRef.current);
    }
    return () => clearInterval(sessionRef.current);
  }, [running, paused]);

  // ── WAVEFORM BUFFERS ──────────────────────────────────
  const neuralBuf = useRef(new Float32Array(500));
  const phrenicBuf = useRef(new Float32Array(500));
  const tidalBuf = useRef(new Float32Array(500));
  const bufIdx = useRef(0);
  const simTime = useRef(0);
  const animRef = useRef(null);

  // ── SAFETY CHECK ──────────────────────────────────────
  const safetyStatus = (() => {
    const { amp, thresh } = params;
    if (amp > thresh) return "danger";
    if (amp > thresh * 0.8) return "warn";
    return "ok";
  })();

  // ── MODE PARAMS ───────────────────────────────────────
  const modeConfig = {
    normal:   { freq: params.freq, amp: params.amp, br: params.br, tidalTarget: 500, bamp: 1.0 },
    injured:  { freq: 10, amp: 2, br: 6,  tidalTarget: 150, bamp: 0.3  },
    recovery: { freq: 20, amp: 4, br: 10, tidalTarget: 380, bamp: 0.75 },
  };

  const login  = (name, role) => setUser({ name, role });
  const logout = () => setUser(null);

  const toggleSession = () => {
    if (!running) {
      setRunning(true);
      setPaused(false);
      setSessionTime(0);
      setSessionCount(c => c + 1);
      addAlert("Session started");
    } else {
      setRunning(false);
      addAlert("Session stopped");
    }
  };

  const pauseSession = () => setPaused(p => !p);

  const resetSession = () => {
    setRunning(false);
    setPaused(false);
    setSessionTime(0);
    simTime.current = 0;
    bufIdx.current = 0;
    neuralBuf.current.fill(0);
    phrenicBuf.current.fill(0);
    tidalBuf.current.fill(0);
  };

  const updateParam  = (key, val) => setParams(p => ({ ...p, [key]: +val }));
  const addPatient   = (p) => setPatients(ps => [...ps, { ...p, id: Date.now() }]);
  const removePatient = (id) => setPatients(ps => ps.filter(p => p.id !== id));
  const addCheckin   = (c) => setCheckins(cs => [{ ...c, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() }, ...cs]);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      theme, toggleTheme,
      running, paused, mode, setMode,
      params, updateParam,
      metrics, setMetrics,
      sessionTime, sessionCount,
      toggleSession, pauseSession, resetSession,
      patients, addPatient, removePatient,
      checkins, addCheckin,
      gameScore, setGameScore,
      gameAccuracy, setGameAccuracy,
      gameStreak, setGameStreak,
      gameLevel, setGameLevel,
      alerts, addAlert,
      safetyStatus, modeConfig,
      neuralBuf, phrenicBuf, tidalBuf,
      bufIdx, simTime, animRef,
      musicOn, toggleMusic, volume, setVolume,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);