import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const HISTORY = 800;
const PAD_L = 52;
const PAD_B = 30;
const PAD_T = 14;
const PAD_R = 12;

// ─── CONDITION CONFIGS ────────────────────────────────────────────────────────
const CONDITION = {
  normal: {
    stim:    { amp: 4.5,  freq: 25, color: "#ff3366" },
    cap:     { amp: 1.2,  absent: false, irregular: false, color: "#00e5ff" },
    resp:    { tidalVol: 0.52, br: 15, shape: "smooth", color: "#00ff88" },
    emg:     { amp: 300,  pattern: "burst", color: "#f59e0b" },
    label:   "EUPNEA — NORMAL",
  },
  injured: {
    stim:    { amp: 6.5,  freq: 25, color: "#ff3366" },
    cap:     { amp: 0.08, absent: true,  irregular: true,  color: "#00e5ff" },
    resp:    { tidalVol: 0.08, br: 3,  shape: "flat",   color: "#00ff88" },
    emg:     { amp: 0,    pattern: "flat",  color: "#f59e0b" },
    label:   "C3–C5 SCI — PHRENIC IMPAIRMENT",
  },
  recovery: {
    stim:    { amp: 5.5,  freq: 22, color: "#ff3366" },
    cap:     { amp: 0.65, absent: false, irregular: true,  color: "#00e5ff" },
    resp:    { tidalVol: 0.34, br: 10, shape: "shallow", color: "#00ff88" },
    emg:     { amp: 90,   pattern: "weak",  color: "#f59e0b" },
    label:   "RECOVERY — REINNERVATION / PACING",
  },
};

// ─── WAVEFORM GENERATORS ──────────────────────────────────────────────────────

// Respiratory waveform — shape varies by condition
function getRespSample(t, cfg) {
  const { br, tidalVol, shape } = cfg;
  const period = 60 / br;
  const tMod = ((t % period) + period) % period;
  const inhale = period * 0.38;
  const exhale  = period * 0.62;
  const frc = 0.05;

  if (shape === "flat") {
    // SCI: near zero with tiny noise
    return frc + 0.02 * Math.sin(t * 0.8) + 0.01 * (Math.random() - 0.5);
  }

  if (tMod < inhale) {
    const phase = tMod / inhale;
    return frc + tidalVol * Math.sin(Math.PI * phase);
  } else {
    const phase = (tMod - inhale) / exhale;
    const expDip = shape === "shallow" ? tidalVol * 0.18 : tidalVol * 0.12;
    return frc - expDip * Math.sin(Math.PI * phase);
  }
}

// Phrenic CAP — spike after each stim pulse
function getPhrenicSample(t, cfg, stimCfg) {
  const { amp, absent, irregular } = cfg;
  const { freq } = stimCfg;
  const period = 1 / freq;
  const tMod   = ((t % period) + period) % period;
  // Latency: 2–5 ms after stim rising edge
  const latency   = 0.003;
  const spikeW    = absent ? 0.001 : 0.006;
  const spikeAmp  = absent
    ? amp * (Math.random() < 0.05 ? 0.5 : 0)  // mostly absent, rare ghost
    : irregular
    ? amp * (0.4 + 0.6 * Math.random())         // variable amplitude
    : amp;

  const dt = tMod - latency;
  if (dt >= 0 && dt < spikeW) {
    const ph = dt / spikeW;
    if (ph < 0.25) return spikeAmp * (ph / 0.25);
    if (ph < 0.45) return spikeAmp * (1 - (ph - 0.25) / 0.2);
    if (ph < 0.65) return -spikeAmp * 0.45 * ((ph - 0.45) / 0.2);
    return -spikeAmp * 0.45 * (1 - (ph - 0.65) / 0.35);
  }
  return 0;
}

// EMG — diaphragm burst noise synced to inspiration
function getEMGSample(t, cfg, respCfg) {
  const { amp, pattern } = cfg;
  const { br } = respCfg;
  if (pattern === "flat") return 0;

  const period   = 60 / br;
  const tMod     = ((t % period) + period) % period;
  const inhaleDur = period * 0.38;
  const inInhale  = tMod < inhaleDur;

  if (!inInhale) return 0;

  const burstAmp = pattern === "burst"
    ? amp * (0.7 + 0.3 * Math.random())
    : amp * (Math.random() < 0.5 ? 0.2 + 0.5 * Math.random() : 0); // weak + irregular

  // High-frequency noise burst (50–150 Hz envelope)
  const noise = (Math.random() * 2 - 1) * burstAmp;
  const envelope = Math.sin(Math.PI * (tMod / inhaleDur));
  return noise * envelope;
}

// ─── GRID + AXES ──────────────────────────────────────────────────────────────

function drawGrid(ctx, w, h, dark, rows, cols) {
  const plotW = w - PAD_L - PAD_R;
  const plotH = h - PAD_B - PAD_T;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = dark ? "#010810" : "#f0f6fa";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = dark ? "#020d16" : "#ffffff";
  ctx.fillRect(PAD_L, PAD_T, plotW, plotH);

  ctx.strokeStyle = dark ? "rgba(14,58,80,0.9)" : "rgba(160,200,220,0.6)";
  ctx.lineWidth = 0.7;
  for (let i = 0; i <= rows; i++) {
    const y = PAD_T + (i / rows) * plotH;
    ctx.beginPath(); ctx.moveTo(PAD_L, y); ctx.lineTo(PAD_L + plotW, y); ctx.stroke();
  }
  for (let i = 0; i <= cols; i++) {
    const x = PAD_L + (i / cols) * plotW;
    ctx.beginPath(); ctx.moveTo(x, PAD_T); ctx.lineTo(x, PAD_T + plotH); ctx.stroke();
  }
  // Border
  ctx.strokeStyle = dark ? "#0e3a50" : "#90bcd0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD_L, PAD_T);
  ctx.lineTo(PAD_L, PAD_T + plotH);
  ctx.lineTo(PAD_L + plotW, PAD_T + plotH);
  ctx.stroke();
}

function drawYAxis(ctx, w, h, dark, minV, maxV, unit, rows, decimals = 1) {
  const plotH = h - PAD_B - PAD_T;
  ctx.font = "10px monospace";
  ctx.fillStyle = dark ? "#4a7a90" : "#7aabb8";
  ctx.textAlign = "right";
  for (let i = 0; i <= rows; i++) {
    const val = maxV - (i / rows) * (maxV - minV);
    const y   = PAD_T + (i / rows) * plotH;
    ctx.fillText(val.toFixed(decimals), PAD_L - 5, y + 3);
    ctx.strokeStyle = dark ? "#0e3a50" : "#90bcd0";
    ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(PAD_L - 3, y); ctx.lineTo(PAD_L, y); ctx.stroke();
  }
  ctx.save();
  ctx.translate(13, PAD_T + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = dark ? "#4a7a90" : "#7aabb8";
  ctx.fillText(unit, 0, 0);
  ctx.restore();
}

function drawXAxis(ctx, w, h, dark, timeWindowSec, unit, cols) {
  const plotW = w - PAD_L - PAD_R;
  const plotH = h - PAD_B - PAD_T;
  ctx.font = "10px monospace";
  ctx.fillStyle = dark ? "#4a7a90" : "#7aabb8";
  ctx.textAlign = "center";
  for (let i = 0; i <= cols; i++) {
    const x    = PAD_L + (i / cols) * plotW;
    const tVal = (i / cols) * timeWindowSec;
    const label = timeWindowSec < 1
      ? `${(tVal * 1000).toFixed(0)}`
      : tVal.toFixed(1);
    ctx.fillText(label, x, PAD_T + plotH + 17);
    ctx.strokeStyle = dark ? "#0e3a50" : "#90bcd0";
    ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(x, PAD_T + plotH); ctx.lineTo(x, PAD_T + plotH + 3); ctx.stroke();
  }
  ctx.textAlign = "right";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = dark ? "#4a7a90" : "#7aabb8";
  ctx.fillText(unit, PAD_L + plotW, PAD_T + plotH + 27);
}

function drawZeroLine(ctx, w, h, dark, minV, maxV) {
  const plotW = w - PAD_L - PAD_R;
  const plotH = h - PAD_B - PAD_T;
  const zFrac = (0 - minV) / (maxV - minV);
  const zY = PAD_T + plotH * (1 - zFrac);
  if (zY <= PAD_T || zY >= PAD_T + plotH) return;
  ctx.strokeStyle = dark ? "rgba(0,229,255,0.18)" : "rgba(0,140,180,0.2)";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.moveTo(PAD_L, zY); ctx.lineTo(PAD_L + plotW, zY); ctx.stroke();
  ctx.setLineDash([]);
}

// ─── DRAW BIPHASIC SQUARE (stim chart) ───────────────────────────────────────

function drawBiphasicSquare(ctx, w, h, dark, mode, params, cond) {
  const plotW = w - PAD_L - PAD_R;
  const plotH = h - PAD_B - PAD_T;
  const rows = 4, cols = 4;
  drawGrid(ctx, w, h, dark, rows, cols);

  const { amp, freq } = cond.stim;
  const pw = params.pw || 200;

  const zeroY = PAD_T + plotH / 2;

  // Dashed zero
  ctx.strokeStyle = dark ? "rgba(0,229,255,0.2)" : "rgba(0,140,180,0.22)";
  ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.moveTo(PAD_L, zeroY); ctx.lineTo(PAD_L + plotW, zeroY); ctx.stroke();
  ctx.setLineDash([]);

  const numPulses = 3;
  const pulseSpacing = plotW / numPulses;
  const periodSec = 1 / freq;
  const pwSec = pw / 1e6;
  let phaseFrac = Math.min((pwSec / periodSec) * 1.6, 0.22);
  if (mode === "injured") phaseFrac *= 1.5;   // wider pulses for injured
  const gapFrac = phaseFrac * 0.35;
  const negFrac = phaseFrac;
  const posH = (plotH / 2) * 0.76;

  const color = mode === "injured" ? "#ff3366"
    : mode === "recovery" ? "#f59e0b"
    : "#ff3366";

  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = dark ? 10 : 4;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "miter";
  ctx.lineCap = "square";
  ctx.beginPath();

  for (let p = 0; p < numPulses; p++) {
    const sx    = PAD_L + p * pulseSpacing;
    const posW  = phaseFrac * pulseSpacing;
    const gapW  = gapFrac * pulseSpacing;
    const negW  = negFrac * pulseSpacing;
    const restE = sx + pulseSpacing;

    if (p === 0) ctx.moveTo(sx, zeroY); else ctx.lineTo(sx, zeroY);
    ctx.lineTo(sx, zeroY - posH);
    ctx.lineTo(sx + posW, zeroY - posH);
    ctx.lineTo(sx + posW, zeroY);
    ctx.lineTo(sx + posW + gapW, zeroY);
    ctx.lineTo(sx + posW + gapW, zeroY + posH);
    ctx.lineTo(sx + posW + gapW + negW, zeroY + posH);
    ctx.lineTo(sx + posW + gapW + negW, zeroY);
    ctx.lineTo(restE, zeroY);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // PW annotation
  const p0End = PAD_L + phaseFrac * pulseSpacing;
  const annotY = PAD_T + 8;
  ctx.strokeStyle = dark ? "rgba(255,214,0,0.5)" : "rgba(180,150,0,0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD_L, annotY + 4); ctx.lineTo(PAD_L, annotY);
  ctx.moveTo(PAD_L, annotY + 2); ctx.lineTo(p0End, annotY + 2);
  ctx.moveTo(p0End, annotY + 4); ctx.lineTo(p0End, annotY);
  ctx.stroke();
  ctx.font = "9px monospace";
  ctx.fillStyle = dark ? "rgba(255,214,0,0.75)" : "rgba(160,130,0,0.85)";
  ctx.textAlign = "center";
  ctx.fillText(`PW: ${pw}µs`, (PAD_L + p0End) / 2, annotY - 1);

  // Amp annotation
  ctx.font = "9px monospace";
  ctx.fillStyle = dark ? "rgba(255,51,102,0.7)" : "rgba(200,0,60,0.7)";
  ctx.textAlign = "left";
  ctx.fillText(`${amp.toFixed(1)} mA`, PAD_L + 4, zeroY - posH - 4);
  ctx.fillText(`−${amp.toFixed(1)} mA`, PAD_L + 4, zeroY + posH + 11);

  // Y axis
  const yVals = [amp, amp / 2, 0, -amp / 2, -amp];
  ctx.font = "10px monospace";
  ctx.fillStyle = dark ? "#4a7a90" : "#7aabb8";
  ctx.textAlign = "right";
  yVals.forEach((v, i) => {
    const y = PAD_T + (i / (yVals.length - 1)) * plotH;
    ctx.fillText(`${v > 0 ? "+" : ""}${v.toFixed(1)}`, PAD_L - 5, y + 3);
    ctx.strokeStyle = dark ? "#0e3a50" : "#90bcd0";
    ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(PAD_L - 3, y); ctx.lineTo(PAD_L, y); ctx.stroke();
  });
  ctx.save();
  ctx.translate(13, PAD_T + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = dark ? "#4a7a90" : "#7aabb8";
  ctx.fillText("mA", 0, 0);
  ctx.restore();

  // X axis — time in ms for 3 pulses
  const totalMs = (numPulses / freq) * 1000;
  ctx.font = "10px monospace"; ctx.fillStyle = dark ? "#4a7a90" : "#7aabb8";
  ctx.textAlign = "center";
  for (let i = 0; i <= cols; i++) {
    const x = PAD_L + (i / cols) * plotW;
    const tMs = ((i / cols) * totalMs).toFixed(1);
    ctx.fillText(tMs, x, PAD_T + plotH + 17);
    ctx.strokeStyle = dark ? "#0e3a50" : "#90bcd0";
    ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(x, PAD_T + plotH); ctx.lineTo(x, PAD_T + plotH + 3); ctx.stroke();
  }
  ctx.textAlign = "right"; ctx.font = "bold 9px monospace";
  ctx.fillStyle = dark ? "#4a7a90" : "#7aabb8";
  ctx.fillText("ms", PAD_L + plotW, PAD_T + plotH + 27);
}

// ─── DRAW SCROLLING LINE ──────────────────────────────────────────────────────

function drawScrolling(ctx, buf, w, h, dark, cfg) {
  const { color, minV, maxV, yUnit, xUnit, timeWindowSec, rows, decimals, showVolLabels } = cfg;
  const plotW = w - PAD_L - PAD_R;
  const plotH = h - PAD_B - PAD_T;

  // Square-ish cells
  const cellH = plotH / rows;
  const cols  = Math.max(4, Math.round(plotW / cellH));

  drawGrid(ctx, w, h, dark, rows, cols);
  drawZeroLine(ctx, w, h, dark, minV, maxV);

  // Waveform — outline only
  ctx.save();
  ctx.beginPath(); ctx.rect(PAD_L, PAD_T, plotW, plotH); ctx.clip();
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur  = dark ? 9 : 3;
  ctx.lineWidth   = 2;
  ctx.lineJoin    = "round";
  ctx.lineCap     = "round";
  ctx.beginPath();

  const N = buf.length;
  let started = false;
  for (let i = 0; i < N; i++) {
    const x = PAD_L + (i / N) * plotW;
    const y = PAD_T + plotH * (1 - (buf[i] - minV) / (maxV - minV));
    const cy = Math.max(PAD_T + 1, Math.min(PAD_T + plotH - 1, y));
    if (!started) { ctx.moveTo(x, cy); started = true; } else ctx.lineTo(x, cy);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Volume labels for respiratory chart
  if (showVolLabels) {
    const ls = dark ? "rgba(0,229,255,0.5)" : "rgba(0,100,160,0.55)";
    ctx.font = "bold 9px monospace";
    const yPos = (v) => PAD_T + plotH * (1 - (v - minV) / (maxV - minV));

    // TV bracket
    const tvTop = yPos(0.05 + 0.52);
    const tvBot = yPos(0.05);
    const bx = PAD_L + plotW * 0.1;
    ctx.strokeStyle = ls; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bx - 5, tvTop); ctx.lineTo(bx, tvTop);
    ctx.moveTo(bx - 2, tvTop); ctx.lineTo(bx - 2, tvBot);
    ctx.moveTo(bx - 5, tvBot); ctx.lineTo(bx, tvBot);
    ctx.stroke();
    ctx.fillStyle = ls; ctx.textAlign = "left";
    ctx.fillText("TV", bx + 3, (tvTop + tvBot) / 2 + 3);

    ctx.fillStyle = dark ? "rgba(0,255,136,0.55)" : "rgba(0,140,70,0.6)";
    ctx.fillText("IRV", PAD_L + plotW * 0.55, yPos(0.95) + 12);
    ctx.fillStyle = dark ? "rgba(255,214,0,0.55)" : "rgba(180,130,0,0.6)";
    ctx.fillText("ERV", PAD_L + plotW * 0.55, yPos(-0.1) - 4);

    // VC bracket
    const vcX = PAD_L + plotW - 18;
    ctx.strokeStyle = dark ? "rgba(255,51,102,0.35)" : "rgba(200,30,60,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(vcX, yPos(0.95)); ctx.lineTo(vcX + 5, yPos(0.95));
    ctx.moveTo(vcX + 2, yPos(0.95)); ctx.lineTo(vcX + 2, yPos(-0.1));
    ctx.moveTo(vcX, yPos(-0.1)); ctx.lineTo(vcX + 5, yPos(-0.1));
    ctx.stroke();
    ctx.fillStyle = dark ? "rgba(255,51,102,0.5)" : "rgba(200,30,60,0.5)";
    ctx.fillText("VC", vcX - 14, (yPos(0.95) + yPos(-0.1)) / 2 + 3);
  }

  ctx.restore();

  // Live dot
  const lastY = PAD_T + plotH * (1 - (buf[N - 1] - minV) / (maxV - minV));
  if (lastY > PAD_T && lastY < PAD_T + plotH) {
    ctx.beginPath();
    ctx.arc(PAD_L + plotW - 2, Math.max(PAD_T + 4, Math.min(PAD_T + plotH - 4, lastY)), 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color; ctx.shadowBlur = 12;
    ctx.fill(); ctx.shadowBlur = 0;
  }

  drawYAxis(ctx, w, h, dark, minV, maxV, yUnit, rows, decimals ?? 1);
  drawXAxis(ctx, w, h, dark, timeWindowSec, xUnit, cols);
}

// ─── FFT ──────────────────────────────────────────────────────────────────────

function drawFFT(ctx, buf, w, h, dark, freq) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = dark ? "#010810" : "#f0f6fa";
  ctx.fillRect(0, 0, w, h);

  const N = Math.min(128, buf.length);
  const re = new Float32Array(N);
  for (let i = 0; i < N; i++) re[i] = buf[(buf.length - N + i) % buf.length];
  const maxBins = 50;
  const mags = new Float32Array(maxBins);
  for (let k = 1; k < maxBins; k++) {
    let r = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const a = (2 * Math.PI * k * n) / N;
      r += re[n] * Math.cos(a); im -= re[n] * Math.sin(a);
    }
    mags[k] = Math.sqrt(r * r + im * im) / N;
  }
  const maxMag = Math.max(...mags, 0.001);
  const barW = (w - 44) / maxBins;
  const pH = h - 18;
  let domIdx = 1;
  for (let k = 2; k < maxBins; k++) if (mags[k] > mags[domIdx]) domIdx = k;

  for (let k = 1; k < maxBins; k++) {
    const x = 36 + k * barW;
    const bh = (mags[k] / maxMag) * pH * 0.82;
    const isDom = k === domIdx;
    ctx.fillStyle = isDom ? "#ff3366" : dark ? "rgba(0,229,255,0.28)" : "rgba(0,153,187,0.28)";
    ctx.shadowColor = isDom ? "#ff3366" : "transparent";
    ctx.shadowBlur = isDom ? 8 : 0;
    ctx.fillRect(x, pH - bh + 2, Math.max(barW - 1, 1), bh);
    ctx.shadowBlur = 0;
  }
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = dark ? "#ff3366" : "#cc1144";
  ctx.textAlign = "left"; ctx.fillText(`DOM: ${freq}Hz`, 38, h - 4);
  ctx.fillStyle = dark ? "#4a7a90" : "#7aabb8";
  ctx.textAlign = "right"; ctx.fillText("Hz →", w - 4, h - 4);
  ctx.strokeStyle = dark ? "#0e3a50" : "#90bcd0"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(34, 2); ctx.lineTo(34, pH + 2); ctx.stroke();
}

// ─── APNEA ────────────────────────────────────────────────────────────────────
let _lastBreath = Date.now(), _apneaCount = 0, _lastPhr = 0;
function checkApnea(val, cb) {
  if (Math.abs(val) > 0.15 && Math.abs(_lastPhr) <= 0.15) _lastBreath = Date.now();
  _lastPhr = val;
  const elapsed = (Date.now() - _lastBreath) / 1000;
  if (elapsed > 10) { _apneaCount++; cb({ detected: true, duration: elapsed.toFixed(0), count: _apneaCount }); }
  else cb({ detected: false, duration: 0, count: _apneaCount });
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function WaveformChart({ type = "neural", height = 280 }) {
  const canvasRef = useRef(null);
  const fftRef    = useRef(null);
  const apneaRef  = useRef(null);
  const rafRef    = useRef(null);

  // Live refs — no stale closures
  const runningRef = useRef(false);
  const pausedRef  = useRef(false);
  const modeRef    = useRef("normal");
  const paramsRef  = useRef({});
  const darkRef    = useRef(true);
  const viewRef    = useRef("basic"); // "basic" | "advanced"

  const {
    running, paused, mode, params, theme,
    setMetrics,
    neuralBuf, phrenicBuf, tidalBuf,
    bufIdx, simTime,
  } = useApp();

  runningRef.current = running;
  pausedRef.current  = paused;
  modeRef.current    = mode;
  paramsRef.current  = params;
  darkRef.current    = theme === "dark";

  const setApnea = (val) => {
    const el = apneaRef.current;
    if (!el) return;
    el.style.display = val.detected ? "flex" : "none";
    if (val.detected) {
      const info = el.querySelector(".apnea-info");
      if (info) info.textContent = `${val.duration}s — ${val.count} episode(s)`;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Allocate buffers once
    const nBuf  = new Float32Array(HISTORY); // stim / neural
    const pBuf  = new Float32Array(HISTORY); // phrenic CAP
    const tBuf  = new Float32Array(HISTORY); // respiratory
    const eBuf  = new Float32Array(HISTORY); // EMG
    let bIdx    = 0;
    let tSim    = 0;

    neuralBuf.current  = nBuf;
    phrenicBuf.current = pBuf;
    tidalBuf.current   = tBuf;
    bufIdx.current     = 0;
    simTime.current    = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      if (fftRef.current) fftRef.current.width = fftRef.current.offsetWidth;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // dt controls scrolling speed — one breath cycle feels ~4–5 real seconds
    const DT = 0.014;

    const tick = () => {
      const running = runningRef.current;
      const paused  = pausedRef.current;
      const mode    = modeRef.current;
      const params  = paramsRef.current;
      const dark    = darkRef.current;
      const cond    = CONDITION[mode] || CONDITION.normal;

      if (running && !paused) {
        tSim += DT;

        const resp    = getRespSample(tSim, cond.resp);
        const phrenic = getPhrenicSample(tSim, cond.cap, cond.stim);
        const emg     = getEMGSample(tSim, cond.emg, cond.resp);

        nBuf[bIdx] = 0; // stim is drawn statically, not buffered
        pBuf[bIdx] = phrenic;
        tBuf[bIdx] = resp;
        eBuf[bIdx] = emg;
        bIdx = (bIdx + 1) % HISTORY;
        bufIdx.current  = bIdx;
        simTime.current = tSim;

        if (type === "phrenic") checkApnea(phrenic, setApnea);

        // Push metrics
        const irms     = cond.stim.amp * Math.sqrt((params.pw / 1e6) * cond.stim.freq);
        const neuralOut = mode === "normal"
          ? cond.stim.amp * ((params.pw / 1e6) * cond.stim.freq)
          : cond.stim.amp * ((params.pw / 1e6) * cond.stim.freq) * (cond.cap.amp / 1.2);
        const stimEff  = Math.min(100, Math.round((cond.cap.amp / 2.0) * 100));

        setMetrics({
          tidalVol:       Math.round(cond.resp.tidalVol * 1000), // mL
          neuralOutput:   parseFloat(neuralOut.toFixed(3)),
          rms:            parseFloat(irms.toFixed(3)),
          breathRate:     cond.resp.br,
          fatigueIndex:   Math.min(100, Math.floor((tSim / 60) * 12)),
          charge:         parseFloat((cond.stim.amp * params.pw / 1e6 * 1e9).toFixed(2)),
          stimEfficiency: stimEff,
        });
      }

      // ── DRAW ──────────────────────────────────────────────────
      const ctx  = canvas.getContext("2d");
      const w    = canvas.width;
      const h    = canvas.height;
      const mode2 = modeRef.current;
      const dark2 = darkRef.current;
      const cond2 = CONDITION[mode2] || CONDITION.normal;
      const par2  = paramsRef.current;

      if (type === "neural") {
        // Normal: no biphasic chart needed — show placeholder
        if (mode2 === "normal") {
          ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = dark2 ? "#010810" : "#f0f6fa";
          ctx.fillRect(0, 0, w, h);
          ctx.font = "12px monospace";
          ctx.fillStyle = dark2 ? "#1e4a60" : "#90bcd0";
          ctx.textAlign = "center";
          ctx.fillText("Biphasic stimulation not required in Normal (Eupnea) mode", w / 2, h / 2 - 10);
          ctx.font = "10px monospace";
          ctx.fillStyle = dark2 ? "#0e3050" : "#a8ccd8";
          ctx.fillText("Phrenic nerve drives respiration autonomously", w / 2, h / 2 + 10);
        } else {
          drawBiphasicSquare(ctx, w, h, dark2, mode2, par2, cond2);
        }

        // FFT under stim chart
        const fc = fftRef.current;
        if (fc && mode2 !== "normal") {
          const fctx = fc.getContext("2d");
          const rotated = new Float32Array(HISTORY);
          for (let i = 0; i < HISTORY; i++) rotated[i] = nBuf[(bIdx + i) % HISTORY];
          drawFFT(fctx, rotated, fc.width, fc.height, dark2, cond2.stim.freq);
        }

      } else if (type === "phrenic") {
        const rotated = new Float32Array(HISTORY);
        for (let i = 0; i < HISTORY; i++) rotated[i] = pBuf[(bIdx + i) % HISTORY];

        // CAP range varies by condition
        const capMax = mode2 === "normal" ? 2.0 : mode2 === "recovery" ? 1.2 : 0.4;
        drawScrolling(ctx, rotated, w, h, dark2, {
          color: "#00e5ff",
          minV: -capMax, maxV: capMax,
          yUnit: "mV", xUnit: "ms",
          timeWindowSec: 0.15,
          rows: 4, decimals: 2,
          showVolLabels: false,
        });

      } else if (type === "tidal") {
        const rotated = new Float32Array(HISTORY);
        for (let i = 0; i < HISTORY; i++) rotated[i] = tBuf[(bIdx + i) % HISTORY];
        drawScrolling(ctx, rotated, w, h, dark2, {
          color: "#00ff88",
          minV: -0.15, maxV: 0.85,
          yUnit: "L", xUnit: "s",
          timeWindowSec: 10,
          rows: 4, decimals: 1,
          showVolLabels: true,
        });

      } else if (type === "emg") {
        const rotated = new Float32Array(HISTORY);
        for (let i = 0; i < HISTORY; i++) rotated[i] = eBuf[(bIdx + i) % HISTORY];
        const emgMax = mode2 === "normal" ? 500 : mode2 === "recovery" ? 150 : 30;
        drawScrolling(ctx, rotated, w, h, dark2, {
          color: "#f59e0b",
          minV: -emgMax, maxV: emgMax,
          yUnit: "µV", xUnit: "s",
          timeWindowSec: 6,
          rows: 4, decimals: 0,
          showVolLabels: false,
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []); // single loop, reads live refs

  return (
    <div style={{ width: "100%" }}>
      <canvas
        ref={canvasRef}
        height={height}
        style={{ width: "100%", height, display: "block" }}
      />

      {type === "neural" && (
        <div style={{ borderTop: "1px solid #0a2535" }}>
          <div style={{ padding: "3px 10px", fontSize: 9, letterSpacing: 2, fontFamily: "monospace", color: "#4a7a90" }}>
            FFT SPECTRUM — DOMINANT FREQUENCY ANALYSIS
          </div>
          <canvas ref={fftRef} height={55} style={{ width: "100%", height: 55, display: "block" }} />
        </div>
      )}

      {type === "phrenic" && (
        <div ref={apneaRef} style={{
          display: "none", alignItems: "center", gap: 10,
          padding: "8px 14px",
          background: "rgba(255,34,68,0.1)",
          border: "1px solid rgba(255,34,68,0.35)", borderTop: "none",
          fontFamily: "monospace", fontSize: 12, color: "#ff2244",
        }}>
          <span style={{ animation: "apnea-pulse 0.8s step-end infinite" }}>🚨 APNEA DETECTED</span>
          <span className="apnea-info" style={{ fontSize: 11 }} />
          <style>{`@keyframes apnea-pulse { 50% { opacity: 0.3 } }`}</style>
        </div>
      )}
    </div>
  );
}