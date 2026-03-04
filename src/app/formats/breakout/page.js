'use client';

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

const EVENT_DATE = new Date("2026-03-20T23:00:00");
const WHATSAPP_NUMBER = "393513895086";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Ciao! Vorrei richiedere informazioni per la prenotazione di un tavolo al BREAKOUT — 20.03.26 Milano."
);
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --red: #E8000A;
    --red-dark: #9c0008;
    --black: #080808;
    --off-white: #F0EDE6;
    --gray: #3a3a3a;
  }

  body { background: var(--black); overflow-x: hidden; }

  .breakout-root {
    font-family: 'Space Mono', monospace;
    background: var(--black);
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    color: var(--off-white);
  }

  .breakout-root::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.035;
    mix-blend-mode: overlay;
  }

  .breakout-root::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px);
  }

  .bg-word {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Anton', sans-serif;
    font-size: clamp(100px, 22vw, 320px);
    letter-spacing: -0.03em;
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px rgba(232, 0, 10, 0.12);
    white-space: nowrap;
    user-select: none;
    animation: breathe 6s ease-in-out infinite;
  }

  @keyframes breathe {
    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.015); }
  }

  .glow-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
  }
  .glow-blob-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(232,0,10,0.25) 0%, transparent 70%);
    top: -100px; left: -150px;
    animation: driftA 12s ease-in-out infinite;
  }
  .glow-blob-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(232,0,10,0.15) 0%, transparent 70%);
    bottom: -80px; right: -100px;
    animation: driftB 9s ease-in-out infinite;
  }

  @keyframes driftA {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(60px, 40px); }
  }
  @keyframes driftB {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-40px, -30px); }
  }

  .content {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
  }

  .top-badge {
    font-size: 10px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--red);
    border: 1px solid rgba(232,0,10,0.4);
    padding: 6px 16px;
    margin-bottom: 32px;
    position: relative;
    animation: fadeSlideDown 0.8s ease both;
  }
  .top-badge::before, .top-badge::after {
    content: '';
    position: absolute;
    width: 6px; height: 6px;
    background: var(--red);
    top: 50%; transform: translateY(-50%);
  }
  .top-badge::before { left: -3px; }
  .top-badge::after { right: -3px; }

  .title-img {
    width: clamp(220px, 55vw, 420px);
    filter: brightness(0) invert(1);
    animation: fadeSlideDown 0.9s 0.1s ease both;
    margin-bottom: 8px;
  }

  .date-line {
    font-size: 11px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: rgba(240,237,230,0.4);
    margin-bottom: 40px;
    animation: fadeSlideDown 0.9s 0.2s ease both;
  }
  .date-line span { color: var(--red); font-weight: 700; }

  .countdown {
    display: flex;
    gap: 0;
    margin-bottom: 48px;
    animation: fadeSlideDown 0.9s 0.3s ease both;
  }
  .count-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;
    border-right: 1px solid rgba(240,237,230,0.08);
  }
  .count-unit:last-child { border-right: none; }
  .count-num {
    font-family: 'Anton', sans-serif;
    font-size: clamp(36px, 8vw, 64px);
    line-height: 1;
    color: var(--off-white);
    letter-spacing: -0.02em;
    min-width: 2ch;
    text-align: center;
  }
  .count-label {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--red);
    margin-top: 4px;
  }

  .divider {
    width: 100%;
    max-width: 420px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(232,0,10,0.5), transparent);
    margin-bottom: 32px;
    animation: fadeSlideDown 0.9s 0.4s ease both;
  }

  .tagline {
    font-size: 12px;
    line-height: 2;
    text-align: center;
    color: rgba(240,237,230,0.55);
    max-width: 320px;
    margin-bottom: 40px;
    animation: fadeSlideDown 0.9s 0.5s ease both;
  }
  .tagline strong { color: var(--off-white); font-weight: 700; }

  .red-line {
    width: 40px;
    height: 2px;
    background: var(--red);
    margin: 0 auto 32px;
    animation: fadeSlideDown 0.9s 0.45s ease both;
  }

  .rsvp-form {
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    animation: fadeSlideDown 0.9s 0.6s ease both;
  }

  .rsvp-input {
    width: 100%;
    background: rgba(240,237,230,0.04);
    border: 1px solid rgba(240,237,230,0.08);
    border-bottom: 1px solid rgba(232,0,10,0.2);
    color: var(--off-white);
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 14px 16px;
    transition: all 0.2s ease;
    outline: none;
    -webkit-appearance: none;
  }
  .rsvp-input::placeholder { color: rgba(240,237,230,0.2); letter-spacing: 0.15em; }
  .rsvp-input:focus {
    background: rgba(232,0,10,0.06);
    border-color: rgba(232,0,10,0.5);
    border-bottom-color: var(--red);
  }

  .buttons-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    margin-top: 8px;
  }

  .rsvp-btn {
    background: var(--red);
    color: var(--off-white);
    font-family: 'Anton', sans-serif;
    font-size: 15px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border: none;
    padding: 16px 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 1rem;
  }
  .rsvp-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  .rsvp-btn:hover::before { transform: translateX(100%); }
  .rsvp-btn:hover { background: #ff0008; }
  .rsvp-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .table-btn {
    background: transparent;
    color: var(--off-white);
    font-family: 'Anton', sans-serif;
    font-size: 14px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border: 1px solid rgba(37,211,102,0.3);
    padding: 16px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .table-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(37,211,102,0.05);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .table-btn:hover::before { opacity: 1; }
  .table-btn:hover { border-color: rgba(37,211,102,0.65); color: #25D366; }

  .wa-icon { width: 13px; height: 13px; fill: currentColor; flex-shrink: 0; }

  .error-msg {
    font-size: 10px;
    letter-spacing: 0.1em;
    color: #ff6b6b;
    background: rgba(232,0,10,0.08);
    border: 1px solid rgba(232,0,10,0.2);
    padding: 10px 14px;
    margin-bottom: 12px;
    text-align: center;
  }

  .success-box {
    width: 100%;
    max-width: 380px;
    border: 1px solid rgba(232,0,10,0.3);
    background: rgba(232,0,10,0.05);
    padding: 48px 32px;
    text-align: center;
    animation: fadeSlideDown 0.6s ease both;
    position: relative;
  }
  .success-box::before {
    content: '✦';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--black);
    padding: 0 10px;
    color: var(--red);
    font-size: 14px;
  }
  .success-title {
    font-family: 'Anton', sans-serif;
    font-size: clamp(36px, 10vw, 56px);
    letter-spacing: 0.05em;
    color: var(--off-white);
    line-height: 1;
    margin-bottom: 16px;
  }
  .success-title span { color: var(--red); }
  .success-sub { font-size: 11px; line-height: 2; color: rgba(240,237,230,0.5); }
  .success-sub strong { color: var(--off-white); }
  .success-note { margin-top: 24px; font-size: 10px; font-style: italic; color: rgba(240,237,230,0.25); letter-spacing: 0.1em; }

  .success-table-btn {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #25D366;
    text-decoration: none;
    border: 1px solid rgba(37,211,102,0.2);
    padding: 10px 16px;
    transition: all 0.3s ease;
  }
  .success-table-btn:hover { background: rgba(37,211,102,0.06); border-color: rgba(37,211,102,0.45); }

  .foot {
    margin-top: 48px;
    font-size: 9px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: rgba(240,237,230,0.15);
    animation: fadeSlideDown 0.9s 0.7s ease both;
  }

  @keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 480px) {
    .count-unit { padding: 0 12px; }
    .buttons-row { grid-template-columns: 1fr; }
    .success-box { padding: 36px 20px; }
  }
`;

const WhatsAppIcon = () => (
  <svg className="wa-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function BreakLanding() {
  const [fullName, setFullName]       = useState("");
  const [email, setEmail]             = useState("");
  const [phone, setPhone]             = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState("");
  const [timeLeft, setTimeLeft]       = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [pr, setPr]                   = useState("");

  // Extract ?q= from URL → save as PR
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) setPr(q);
    }
  }, []);

  // Inject global CSS once
  useEffect(() => {
    const id = "breakout-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = globalStyles;
      document.head.appendChild(style);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    const tick = () => {
      const diff = EVENT_DATE - new Date();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!fullName || !email) {
      setError("Inserisci nome ed email per continuare.");
      return;
    }
    setSubmitting(true);
    try {
      const { error: sbError } = await supabase
        .from("Lists")
        .insert([{
          full_name:    fullName.trim(),
          email:        email.trim(),
          phone_number: phone.trim() || null,
          event:        "BREAKOUT",
          event_id:     "breakout2",
          pr:           pr || null,
        }]);

      if (sbError) throw sbError;

      setSuccess(true);
      setFullName(""); setEmail(""); setPhone("");
    } catch (err) {
      console.error(err);
      setError("Errore durante la registrazione. Riprova.");
    } finally {
      setSubmitting(false);
    }
  }

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <main className="breakout-root">
      <div className="glow-blob glow-blob-1" />
      <div className="glow-blob glow-blob-2" />
      <div className="bg-word">BREAKOUT</div>

      <div className="content">
        <div className="top-badge">Milano — Accesso Limitato</div>

        <img src="/images/breaktitle.png" alt="BREAKOUT" className="title-img" />

        <p className="date-line">
          <span>20</span> . <span>03</span> . <span>26</span> &nbsp;—&nbsp; Milano
        </p>

        <div className="countdown">
          {[
            { label: "Days",  value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Min",   value: timeLeft.minutes },
            { label: "Sec",   value: timeLeft.seconds },
          ].map(({ label, value }) => (
            <div className="count-unit" key={label}>
              <span className="count-num">{pad(value)}</span>
              <span className="count-label">{label}</span>
            </div>
          ))}
        </div>

        <div className="divider" />

        <p className="tagline">
          Three realities. One movement.<br />
          The first <strong>BREAKOUT</strong> happens in Milan.<br />
          RSVP now — access is strictly limited.
        </p>

        <div className="red-line" />

        {error && <div className="error-msg">{error}</div>}

        {!success ? (
          <form className="rsvp-form" onSubmit={handleSubmit}>
            <input
              className="rsvp-input"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              className="rsvp-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="rsvp-input"
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="">
              <button
                type="submit"
                className="rsvp-btn"
                disabled={submitting}
              >
                {submitting ? "..." : "REQUEST ACCESS"}
              </button>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="table-btn"
              >
                <WhatsAppIcon />
                TAVOLI
              </a>
            </div>
          </form>
        ) : (
          <div className="success-box">
            <div className="success-title">YOU'RE<br /><span>IN.</span></div>
            <p className="success-sub">
              Your spot at <strong>BREAKOUT</strong> is locked.<br />
              Check your inbox — details arrive soon.
            </p>
            <p className="success-note">This isn't just an event. It's an escape.</p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="success-table-btn"
            >
              <WhatsAppIcon />
              Richiedi un tavolo
            </a>
          </div>
        )}

        <p className="foot">Not a format — a movement.</p>
      </div>
    </main>
  );
}