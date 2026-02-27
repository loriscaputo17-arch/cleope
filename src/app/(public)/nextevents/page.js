'use client';

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500&display=swap');

    :root {
      --bg: #080808;
      --fg: #f0efeb;
      --dim: rgba(240,239,235,0.08);
      --mid: rgba(240,239,235,0.38);
    }

    .cal { font-family: 'Inter', sans-serif; }
    .f-syne { font-family: 'Syne', sans-serif; }

    .cal-label {
      font-size: 9px; font-weight: 500;
      letter-spacing: 0.28em; text-transform: uppercase;
      color: rgba(240,239,235,0.3);
    }

    /* month pills */
    .month-btn {
      font-family: 'Inter', sans-serif;
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase;
      background: transparent;
      color: rgba(240,239,235,0.35);
      border: 1px solid rgba(240,239,235,0.1);
      padding: 9px 18px;
      cursor: pointer;
      transition: color 0.2s, border-color 0.2s;
      white-space: nowrap;
    }
    .month-btn:hover { color: var(--fg); border-color: rgba(240,239,235,0.35); }
    .month-btn.active {
      background: var(--fg);
      color: var(--bg);
      border-color: var(--fg);
    }

    /* year select */
    .year-sel {
      font-family: 'Inter', sans-serif;
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase;
      background: transparent;
      border: 1px solid rgba(240,239,235,0.1);
      color: rgba(240,239,235,0.5);
      padding: 9px 16px;
      outline: none;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .year-sel:hover { border-color: rgba(240,239,235,0.35); }
    .year-sel option { background: #111; color: #f0efeb; }

    /* event card */
    .ev-card { cursor: pointer; }
    .ev-card-img {
      transition: transform 0.6s cubic-bezier(0.22,1,0.36,1), filter 0.4s;
      filter: grayscale(60%) brightness(0.85);
    }
    .ev-card:hover .ev-card-img {
      transform: scale(1.05);
      filter: grayscale(0%) brightness(0.95);
    }
    .ev-card:hover .ev-card-border { border-color: rgba(240,239,235,0.25); }
    .ev-card-border {
      border: 1px solid var(--dim);
      transition: border-color 0.3s;
    }

    /* tag */
    .tag-upcoming {
      font-family: 'Inter', sans-serif;
      font-size: 9px; font-weight: 500; letter-spacing: 0.18em;
      text-transform: uppercase;
      background: var(--fg); color: var(--bg);
      padding: 4px 10px;
    }
    .tag-past {
      font-family: 'Inter', sans-serif;
      font-size: 9px; font-weight: 500; letter-spacing: 0.18em;
      text-transform: uppercase;
      background: rgba(240,239,235,0.08); color: rgba(240,239,235,0.3);
      padding: 4px 10px;
    }

    /* modal */
    .modal-img { transition: transform 0.7s cubic-bezier(0.22,1,0.36,1); }
    .modal-inner:hover .modal-img { transform: scale(1.03); }

    .modal-btn {
      font-family: 'Inter', sans-serif;
      font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
      padding: 13px 28px; cursor: pointer; transition: opacity 0.2s;
      text-decoration: none; display: inline-block; text-align: center;
    }
    .modal-btn-solid { background: var(--fg); color: var(--bg); border: none; }
    .modal-btn-solid:hover { opacity: 0.85; }
    .modal-btn-ghost { background: transparent; color: var(--fg); border: 1px solid rgba(240,239,235,0.22); }
    .modal-btn-ghost:hover { border-color: rgba(240,239,235,0.55); }
    .modal-btn-disabled {
      background: rgba(240,239,235,0.05); color: rgba(240,239,235,0.2);
      border: 1px solid rgba(240,239,235,0.06); cursor: not-allowed;
    }

    .close-btn {
      background: none; border: 1px solid rgba(240,239,235,0.12);
      color: rgba(240,239,235,0.4); width: 34px; height: 34px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 14px; flex-shrink: 0;
      transition: border-color 0.2s, color 0.2s;
    }
    .close-btn:hover { border-color: rgba(240,239,235,0.45); color: var(--fg); }

    /* scrollbar hide */
    .no-scroll::-webkit-scrollbar { display: none; }
    .no-scroll { -ms-overflow-style: none; scrollbar-width: none; }

    @media (max-width: 768px) {
      .modal-split { flex-direction: column !important; }
      .modal-split > *:first-child { height: 260px !important; width: 100% !important; }
    }
  `}</style>
)

const pad = 'clamp(20px, 5vw, 72px)'
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

export default function CalendarPage() {
  const currentDate = new Date();
  const [events, setEvents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const today = new Date();

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchEvents();
  }, []);

  const filtered = events
    .filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <>
      <GlobalStyles />
      <main className="cal" style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh' }}>

        {/* ── HEADER ── */}
        <div style={{ padding: `clamp(100px,14vw,160px) ${pad} clamp(40px,5vw,64px)`, borderBottom: '1px solid var(--dim)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="cal-label" style={{ display: 'block', marginBottom: 16 }}>Events</span>
              <h1 className="f-syne" style={{
                fontSize: 'clamp(52px, 11vw, 140px)',
                fontWeight: 800, lineHeight: 0.9,
                letterSpacing: '-0.02em', marginBottom: 0,
              }}>
                Calendar
              </h1>
            </motion.div>
          </div>
        </div>

        {/* ── FILTERS ── */}
        <div style={{
          padding: `24px ${pad}`,
          borderBottom: '1px solid var(--dim)',
          display: 'flex', gap: 12, alignItems: 'center',
          overflowX: 'auto',
        }} className="no-scroll">
          <div style={{ display: 'flex', gap: 4, flex: 1, overflowX: 'auto' }} className="no-scroll">
            {months.map((m, idx) => (
              <button
                key={m}
                className={`month-btn${idx === selectedMonth ? ' active' : ''}`}
                onClick={() => setSelectedMonth(idx)}
              >
                {m.slice(0, 3)}
              </button>
            ))}
          </div>
          <select
            className="year-sel"
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* ── EVENTS ── */}
        <div style={{ padding: `clamp(48px,6vw,80px) ${pad}`, maxWidth: 1200, margin: '0 auto' }}>
          {filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
              {filtered.map((event, i) => {
                const isPast = new Date(event.date) < today;
                return (
                  <motion.div
                    key={event.id}
                    className="ev-card ev-card-border"
                    style={{ overflow: 'hidden', position: 'relative' }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                      <Image
                        src={event.img || '/default-event.jpg'}
                        alt={event.title} fill
                        className="ev-card-img"
                        style={{ objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.9) 0%, transparent 55%)' }} />

                      {/* tag top-right */}
                      <div style={{ position: 'absolute', top: 16, right: 16 }}>
                        <span className={isPast ? 'tag-past' : 'tag-upcoming'}>
                          {isPast ? 'Past' : 'Upcoming'}
                        </span>
                      </div>
                    </div>

                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 20px' }}>
                      <p className="cal-label" style={{ marginBottom: 6 }}>
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {event.time ? ` · ${event.time}` : ''}
                      </p>
                      <h3 className="f-syne" style={{ fontSize: 'clamp(18px,2vw,24px)', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                        {event.title}
                      </h3>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 13, color: 'rgba(240,239,235,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                No events for {months[selectedMonth]} {selectedYear}
              </p>
            </div>
          )}
        </div>

        {/* ── EVENT MODAL ── */}
        <AnimatePresence>
          {selectedEvent && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setSelectedEvent(null)}
                style={{
                  position: 'fixed', inset: 0, zIndex: 50,
                  background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
                }}
              />

              <motion.div
                key="modal"
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'fixed', inset: 0, zIndex: 51,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '24px',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    pointerEvents: 'all',
                    background: '#0e0e0e',
                    border: '1px solid rgba(240,239,235,0.08)',
                    width: '100%', maxWidth: 880,
                    maxHeight: '88vh',
                    overflow: 'hidden',
                    display: 'flex',
                    position: 'relative',
                  }}
                  className="modal-split modal-inner"
                >
                  {/* left — image */}
                  <div style={{ position: 'relative', width: '42%', flexShrink: 0, overflow: 'hidden' }}>
                    <Image
                      src={selectedEvent.img || '/default-event.jpg'}
                      alt={selectedEvent.title} fill
                      className="modal-img"
                      style={{ objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, #0e0e0e 100%)' }} />
                  </div>

                  {/* right — content */}
                  <div
                    className="no-scroll"
                    style={{ flex: 1, padding: 'clamp(28px,4vw,48px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}
                  >
                    <div>
                      {/* close */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
                        <button className="close-btn" onClick={() => setSelectedEvent(null)}>✕</button>
                      </div>

                      <span className="cal-label" style={{ display: 'block', marginBottom: 10 }}>
                        {new Date(selectedEvent.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {selectedEvent.time ? ` · ${selectedEvent.time}` : ''}
                      </span>

                      <h2 className="f-syne" style={{
                        fontSize: 'clamp(26px,3.5vw,42px)',
                        fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.0,
                        marginBottom: 20,
                      }}>
                        {selectedEvent.title}
                      </h2>

                      {selectedEvent.description && (
                        <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(240,239,235,0.5)', lineHeight: 1.75, marginBottom: 32 }}>
                          {selectedEvent.description}
                        </p>
                      )}
                    </div>

                    {/* CTA buttons */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {new Date(selectedEvent.date) >= today ? (
                        <>
                          <Link href="/tables" className="modal-btn modal-btn-solid">
                            Book Table
                          </Link>
                          <a
                            href={selectedEvent.entryLink || `/tickets?event=${encodeURIComponent(selectedEvent.id)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="modal-btn modal-btn-ghost"
                          >
                            Get Tickets
                          </a>
                        </>
                      ) : (
                        <>
                          <button disabled className="modal-btn modal-btn-disabled">Book Table</button>
                          <button disabled className="modal-btn modal-btn-disabled">Get Tickets</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </main>
    </>
  )
}