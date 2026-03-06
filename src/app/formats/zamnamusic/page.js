'use client';

import { useState, useEffect, useRef } from "react";

const TICKET_LINK   = "https://www.ticketsms.it/event/Zamna-In-The-Club-Milano-The-Mall-07-03-2026"; // ← sostituisci
const WHATSAPP_NUM  = "393513895086";
const WHATSAPP_MSG  = encodeURIComponent("Ciao! Vorrei richiedere informazioni per un tavolo all'evento Zamna In The Club — Milano, 07.03.");
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUM}?text=${WHATSAPP_MSG}`;
const MAPS_LINK     = "https://www.google.com/maps/search/?api=1&query=Piazza+Lina+Bo+Bardi+Piazza+Alvar+Alto+1+20121+Milano+MI";

export default function ZamnaLanding() {
  const canvasRef = useRef(null);
  const [loaded, setLoaded]   = useState(false);
  const [imgSrc, setImgSrc]   = useState("https://rzplxudcblduqqcwfdyw.supabase.co/storage/v1/object/public/materials/zamna.PNG");

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

  // Drifting ember particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let raf;

    const pts = Array.from({ length: 70 }, () => ({
      x:   Math.random() * W,
      y:   Math.random() * H,
      r:   Math.random() * 1.8 + 0.3,
      dx:  (Math.random() - 0.5) * 0.3,
      dy:  -(Math.random() * 0.4 + 0.1),   // float upward like embers
      o:   Math.random() * 0.55 + 0.08,
      hue: Math.random() * 30 + 15,         // deep orange-amber
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 62%, ${p.o})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <>
      <style>{CSS}</style>

      <canvas ref={canvasRef} className="z-canvas" />

      {/* Deep warm atmosphere */}
      <div className="z-atmo" />
      <div className="z-grain" />

      <div className="z-page">
        <div className="z-wrap">

          {/* ── Brand header ── */}

          <div className={`top-header ${loaded ? "in" : ""}`}>
            <span className="collab-text">ZAMNA IN THE CLUB</span>
            <span className="collab-x">×</span>
            <span className="collab-text">CLEOPE SOUND</span>
          </div>

          {/* ── Gold separator ── */}
          <div className={`z-rule ${loaded ? "in" : ""}`} />

          {/* ── Flyer ── */}
          <div className={`z-flyer-wrap ${loaded ? "in" : ""}`}>
            {/* Corner ticks */}
            {["tl","tr","bl","br"].map(p => <span key={p} className={`z-corner z-corner--${p}`} />)}

            <img
              src={imgSrc}
              alt="Zamna In The Club — Milan 07.03"
              className="z-flyer-img"
              onError={() => setImgSrc("")}
            />

            {/* fallback if no img */}
            {!imgSrc && (
              <div className="z-flyer-fallback">
                <div className="zf-title">ZAMNA<br/><span>IN THE CLUB</span></div>
                <div className="zf-city">MILAN</div>
                <div className="zf-djs">
                  {["ANDRO","ASAL","AÜRA","GIULIO DOMI B2B ZINNESCO","HU","NAARLY","ZAKES BANTWINI"].map(d=>(
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Event info strip ── */}
          <div className={`z-infostrip ${loaded ? "in" : ""}`}>
            <div className="z-info-col">
              <span className="z-info-lbl">Data</span>
              <span className="z-info-val">SAB 07.03.25</span>
            </div>
            <div className="z-vdivider" />
            <div className="z-info-col">
              <span className="z-info-lbl">Venue</span>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="z-info-val z-info-link">
                The Mall, Milano
                <svg className="z-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </a>
            </div>
            <div className="z-vdivider" />
            <div className="z-info-col">
              <span className="z-info-lbl">Accesso</span>
              <span className="z-info-val">Limitato</span>
            </div>
          </div>

          {/* ── CTA Buttons ── */}
          <div className={`z-btns ${loaded ? "in" : ""}`}>
            <a href={TICKET_LINK} target="_blank" rel="noopener noreferrer" className="z-btn-tickets">
              <span>COMPRA TICKETS</span>
              <span className="z-arrow">→</span>
            </a>

            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="z-btn-tavoli">
              <WaIcon />
              PRENOTA UN TAVOLO
            </a>
          </div>

        </div>

        {/* ── Scrolling marquee ── */}
        <div className={`z-marquee ${loaded ? "in" : ""}`}>
          <div className="z-marquee-track">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="z-marquee-inner">
                {["ZAMNA IN THE CLUB","·","MILAN","·","07.03.25","·","THE MALL","·","WAREHOUSE","·","RADIO M2O","·","LIMITED ACCESS","·"].map((w,j)=>(
                  <span key={j} className="z-marquee-word">{w}</span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <footer className={`z-foot ${loaded ? "in" : ""}`}>
          piazza lina bo bardi · piazza alvar alto 1 · 20121 milano mi
        </footer>
      </div>
    </>
  );
}

function WaIcon() {
  return (
    <svg className="z-wa-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;1,300;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:      #0C0704;
  --rust:    #B8390E;
  --amber:   #D4660A;
  --gold:    #E89A1C;
  --glow:    #F5B830;
  --sky:     #E8500A;
  --cream:   #F2E4C8;
  --sand:    #C8A878;
  --muted:   rgba(200,168,120,0.45);
  --wa:      #25D366;
}

html, body { background: var(--bg); overflow-x: hidden; }

/* ── Top header ── */
        .top-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 32px 0 28px;
          opacity: 0;
          transform: translateY(-12px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .top-header.in { opacity: 1; transform: translateY(0); }

        .collab-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(13px, 3.5vw, 17px);
          letter-spacing: 0.35em;
          color: var(--sand);
          padding-top: 0.5rem;
        }
        .collab-x {
          font-family: 'Crimson Pro', serif;
          font-style: italic;
          font-size: clamp(18px, 5vw, 24px);
          color: var(--amber);
          line-height: 1;
        }

/* ── Canvas + overlays ── */
.z-canvas {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
}
.z-atmo {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 100% 55% at 50% 100%, rgba(180,60,10,0.35) 0%, transparent 65%),
    radial-gradient(ellipse 70% 45% at 15% 5%,  rgba(210,100,10,0.18) 0%, transparent 60%),
    radial-gradient(ellipse 60% 35% at 85% 20%, rgba(140,30,5,0.14)  0%, transparent 55%),
    linear-gradient(180deg, #0a0503 0%, #120805 40%, #0e0503 100%);
}
.z-grain {
  position: fixed; inset: 0; z-index: 1; pointer-events: none;
  opacity: 0.04; mix-blend-mode: screen;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ── Page shell ── */
.z-page {
  position: relative; z-index: 10;
  min-height: 100vh;
  display: flex; flex-direction: column; align-items: center;
}
.z-wrap {
  width: 100%; max-width: 500px;
  padding: 0 20px 20px;
  display: flex; flex-direction: column; align-items: center;
}

/* ── Reveal util ── */
.z-header, .z-rule, .z-flyer-wrap, .z-infostrip, .z-btns, .z-lineup, .z-marquee, .z-foot {
  opacity: 0; transform: translateY(14px);
  transition: opacity 0.85s ease, transform 0.85s ease;
}
.z-header.in  { opacity:1; transform:none; transition-delay: 0s; }
.z-rule.in    { opacity:1; transform:none; transition-delay:.12s; }
.z-flyer-wrap.in { opacity:1; transform:none; transition-delay:.22s; }
.z-infostrip.in  { opacity:1; transform:none; transition-delay:.42s; }
.z-btns.in    { opacity:1; transform:none; transition-delay:.55s; }
.z-lineup.in  { opacity:1; transform:none; transition-delay:.68s; }
.z-marquee.in { opacity:1; transform:none; transition-delay:.85s; }
.z-foot.in    { opacity:1; transform:none; transition-delay:.95s; }

/* ── Header ── */
.z-header {
  width: 100%; display: flex; align-items: center; justify-content: center;
  padding: 30px 0 20px;
}
.z-brand-tag {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 11px; letter-spacing: 0.45em; text-transform: uppercase;
  color: var(--amber);
  border: 1px solid rgba(212,102,10,0.35);
  padding: 5px 16px;
  position: relative;
}
.z-brand-tag::before, .z-brand-tag::after {
  content: ''; position: absolute;
  width: 5px; height: 5px; background: var(--gold);
  top: 50%; transform: translateY(-50%);
}
.z-brand-tag::before { left: -2.5px; }
.z-brand-tag::after  { right: -2.5px; }

/* ── Rule ── */
.z-rule {
  width: 100%; height: 1px; margin-bottom: 24px;
  background: linear-gradient(90deg, transparent, var(--amber), var(--glow), var(--amber), transparent);
  opacity: 0.4;
}
.z-rule.in { opacity: 0.4; }

/* ── Flyer ── */
.z-flyer-wrap {
  width: 100%; max-width: 420px;
  position: relative;
}
/* Atmospheric glow behind flyer */
.z-flyer-wrap::before {
  content: '';
  position: absolute; inset: -40px;
  background: radial-gradient(ellipse at center, rgba(210,90,10,0.28) 0%, transparent 68%);
  z-index: -1;
  animation: zpulse 5s ease-in-out infinite;
}
@keyframes zpulse {
  0%,100% { opacity:.7; transform:scale(1); }
  50%      { opacity:1;  transform:scale(1.05); }
}
/* Border frame */
.z-flyer-wrap::after {
  content: '';
  position: absolute; inset: -3px;
  border: 1px solid rgba(232,154,28,0.2);
  pointer-events: none; z-index: 2;
}
/* Corner ticks */
.z-corner {
  position: absolute; width: 18px; height: 18px; z-index: 3; pointer-events: none;
}
.z-corner::before, .z-corner::after {
  content: ''; position: absolute; background: var(--glow);
}
.z-corner::before { width: 100%; height: 1.5px; top: 0; left: 0; }
.z-corner::after  { width: 1.5px; height: 100%; top: 0; left: 0; }
.z-corner--tl { top: -5px;    left: -5px; }
.z-corner--tr { top: -5px;    right: -5px;   transform: scaleX(-1); }
.z-corner--bl { bottom: -5px; left: -5px;    transform: scaleY(-1); }
.z-corner--br { bottom: -5px; right: -5px;   transform: scale(-1); }

.z-flyer-img {
  width: 100%; display: block;
  aspect-ratio: 9/16; object-fit: cover;
  position: relative; z-index: 1;
}

/* Fallback */
.z-flyer-fallback {
  width: 100%; aspect-ratio: 9/16;
  background: linear-gradient(160deg, #1a0a03 0%, #0d0603 60%);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
}
.zf-title {
  font-family: 'Bebas Neue', sans-serif; font-size: clamp(32px,10vw,54px);
  letter-spacing: 0.15em; color: var(--cream); text-align: center; line-height: 1;
}
.zf-title span { display: block; font-size: 0.4em; letter-spacing: 0.5em; color: var(--gold); }
.zf-city { font-family: 'Crimson Pro', serif; font-style: italic; font-size: 18px; color: var(--gold); }
.zf-djs { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.zf-djs span { font-family: 'Bebas Neue', sans-serif; font-size: clamp(14px,4vw,20px); letter-spacing: 0.2em; color: var(--cream); }

/* ── Info strip ── */
.z-infostrip {
  width: 100%; max-width: 420px;
  margin-top: 20px;
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 0;
  border-top: 1px solid rgba(232,154,28,0.15);
  border-bottom: 1px solid rgba(232,154,28,0.15);
}
.z-info-col { display: flex; flex-direction: column; gap: 3px; align-items: center; }
.z-info-lbl {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 9px; letter-spacing: 0.35em; color: var(--muted);
}
.z-info-val {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(12px, 3.5vw, 15px); letter-spacing: 0.12em;
  color: var(--cream); text-decoration: none;
  display: flex; align-items: center; gap: 5px;
}
.z-info-link { transition: color .25s ease; }
.z-info-link:hover { color: var(--gold); }
.z-pin { width: 11px; height: 11px; flex-shrink: 0; color: var(--amber); }
.z-vdivider { width: 1px; height: 36px; background: rgba(232,154,28,0.18); }

/* ── Buttons ── */
.z-btns {
  width: 100%; max-width: 420px;
  margin-top: 20px;
  display: flex; flex-direction: column; gap: 8px;
}
.z-btn-tickets {
  width: 100%;
  background: linear-gradient(135deg, var(--rust) 0%, var(--amber) 50%, var(--sky) 100%);
  color: #fff;
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(18px, 5vw, 23px); letter-spacing: 0.3em;
  border: none; padding: 18px 24px; cursor: pointer;
  text-decoration: none;
  display: flex; align-items: center; justify-content: center; gap: 12px;
  position: relative; overflow: hidden;
  transition: letter-spacing .35s ease, filter .35s ease;
  text-shadow: 0 1px 8px rgba(0,0,0,0.4);
}
.z-btn-tickets::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
  transform: translateX(-100%);
  transition: transform .6s ease;
}
.z-btn-tickets:hover::before { transform: translateX(100%); }
.z-btn-tickets:hover { letter-spacing: 0.42em; filter: brightness(1.12); }
.z-arrow { font-size: 1.15em; transition: transform .3s ease; }
.z-btn-tickets:hover .z-arrow { transform: translateX(6px); }

.z-btn-tavoli {
  width: 100%; background: transparent;
  color: var(--sand);
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(13px, 3.8vw, 16px); letter-spacing: 0.25em;
  border: 1px solid rgba(37,211,102,0.28);
  padding: 14px 24px; cursor: pointer;
  text-decoration: none;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  transition: all .3s ease; position: relative; overflow: hidden;
}
.z-btn-tavoli::before {
  content: ''; position: absolute; inset: 0;
  background: rgba(37,211,102,0.05); opacity: 0; transition: opacity .3s ease;
}
.z-btn-tavoli:hover::before { opacity: 1; }
.z-btn-tavoli:hover { border-color: rgba(37,211,102,.65); color: var(--wa); }
.z-wa-icon { width: 14px; height: 14px; flex-shrink: 0; }

/* ── Lineup ── */
.z-lineup {
  width: 100%; max-width: 420px; margin-top: 28px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.z-lineup-label {
  font-family: 'Crimson Pro', serif; font-style: italic;
  font-size: 12px; letter-spacing: 0.3em; color: var(--muted);
}
.z-lineup-names {
  display: flex; flex-direction: column; align-items: center; gap: 2px; width: 100%;
}
.z-dj {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(15px, 4.5vw, 20px);
  letter-spacing: 0.25em; color: var(--cream);
  text-align: center; width: 100%;
  padding: 4px 0;
  border-bottom: 1px solid rgba(232,154,28,0.07);
  opacity: 0;
  animation: djfadein 0.5s ease forwards;
}
@keyframes djfadein {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
.z-dj:last-child { border-bottom: none; }
.z-dj:hover { color: var(--gold); }

/* ── Marquee ── */
.z-marquee {
  width: 100%; overflow: hidden;
  border-top: 1px solid rgba(232,154,28,0.1);
  border-bottom: 1px solid rgba(232,154,28,0.1);
  padding: 9px 0; margin-top: 36px;
}
.z-marquee-track { display: flex; animation: zmarquee 22s linear infinite; white-space: nowrap; }
.z-marquee-inner { display: flex; }
.z-marquee-word {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 10px; letter-spacing: 0.3em;
  color: rgba(200,160,90,0.35); padding: 0 20px;
}
@keyframes zmarquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* ── Footer ── */
.z-foot {
  font-family: 'Crimson Pro', serif; font-style: italic;
  font-size: 14px; letter-spacing: 0.18em;
  color: rgba(200,168,120,0.8); text-align: center;
  padding: 20px 24px 40px;
}

/* ── Responsive ── */
@media (max-width: 400px) {
  .z-infostrip { gap: 0; }
  .z-info-val { font-size: 12px; }
  .z-vdivider { height: 28px; }
}

@media (max-width: 768px) {
  .z-wrap { padding: 0 2rem 2rem !important; }
}
`;