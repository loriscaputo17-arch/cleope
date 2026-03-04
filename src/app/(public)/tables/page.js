'use client'

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500&display=swap');

    :root {
      --bg: #080808;
      --fg: #f0efeb;
      --dim: rgba(240,239,235,0.08);
      --mid: rgba(240,239,235,0.4);
    }

    .tbl { font-family: 'Inter', sans-serif; }
    .f-syne { font-family: 'Syne', sans-serif; }

    .tbl-label {
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      font-weight: 500;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: rgba(240,239,235,0.3);
      display: block;
      margin-bottom: 14px;
    }

    /* gallery hover */
    .gal-img { transition: transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.4s; filter: grayscale(40%); }
    .gal-wrap:hover .gal-img { transform: scale(1.05); filter: grayscale(0%); }

    /* form fields */
    .tbl-field {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 300;
      width: 100%;
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(240,239,235,0.12);
      color: #f0efeb;
      padding: 12px 0;
      outline: none;
      transition: border-color 0.25s;
      letter-spacing: 0.02em;
    }
    .tbl-field::placeholder { color: rgba(240,239,235,0.25); }
    .tbl-field:focus { border-bottom-color: rgba(240,239,235,0.5); }

    select.tbl-field option { background: #111; color: #f0efeb; }

    /* drawer */
    .drawer {
      position: fixed;
      top: 0; right: 0;
      width: min(480px, 100vw);
      height: 100vh;
      background: #0e0e0e;
      border-left: 1px solid rgba(240,239,235,0.07);
      z-index: 60;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .cta-btn {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      background: #f0efeb;
      color: #080808;
      border: none;
      padding: 15px 36px;
      cursor: pointer;
      transition: opacity 0.2s;
      white-space: nowrap;
    }
    .cta-btn:hover { opacity: 0.85; }

    .ghost-btn {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      background: transparent;
      color: rgba(240,239,235,0.6);
      border: 1px solid rgba(240,239,235,0.18);
      padding: 15px 36px;
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s;
    }
    .ghost-btn:hover { border-color: rgba(240,239,235,0.5); color: #f0efeb; }

    .close-btn {
      background: none;
      border: 1px solid rgba(240,239,235,0.12);
      color: rgba(240,239,235,0.5);
      width: 34px; height: 34px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      font-size: 16px;
      transition: border-color 0.2s, color 0.2s;
      flex-shrink: 0;
    }
    .close-btn:hover { border-color: rgba(240,239,235,0.45); color: #f0efeb; }

    .form-section-label {
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      font-weight: 500;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: rgba(240,239,235,0.25);
      margin-bottom: 16px;
      display: block;
    }

    @media (max-width: 640px) {
      .gal-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
)

const pad = 'clamp(20px, 5vw, 72px)'
const sec = 'clamp(64px, 8vw, 120px)'

export default function TablePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState("");

  const [event, setEvent] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [guests, setGuests] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const snapshot = await getDocs(collection(db, "events"));
        setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError("Failed to load events.");
        console.error(err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!event) { alert("Please select an event."); return; }
    const msg =
      `Richiesta Tavolo VIP\n` +
      `Evento: ${events.find(ev => ev.id === event)?.title || "N/A"}\n` +
      `Nome: ${firstName} ${lastName}\n` +
      `Email: ${email}\n` +
      `Telefono: ${phone}\n` +
      `Età stimata: ${age}\n` +
      `Ospiti: ${guests}\n` +
      `Note: ${comment}`;
    window.open(`https://wa.me/393513895086?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const images = [
    "https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0523.JPG?alt=media&token=ce2b3ad8-eb40-4fca-8814-95bb549adbd2",
    "https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0509.JPG?alt=media&token=317eda7e-cf65-41af-8ae9-dea6bdfd38eb",
    "https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0506.JPG?alt=media&token=7770406e-cb0b-4e84-bff7-518b713297ad",
  ];

  return (
    <>
      <GlobalStyles />
      <main className="tbl" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', height: '100svh', overflow: 'hidden' }}>
          <Image
            src={images[2]}
            alt="Tables" fill priority
            style={{ objectFit: 'cover', opacity: 0.38, filter: 'blur(2px)', transform: 'scale(1.05)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0.65) 65%, #080808 100%)' }} />

          <div style={{
            position: 'relative', zIndex: 10,
            height: '100%', display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: `0 ${pad} clamp(48px,7vw,80px)`,
          }}>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="tbl-label">VIP Experience</span>
              <h1 className="f-syne" style={{
                fontSize: 'clamp(60px, 14vw, 180px)',
                fontWeight: 800, lineHeight: 0.9,
                letterSpacing: '-0.02em', marginBottom: 24,
              }}>
                Book a<br />Table
              </h1>
              <p style={{
                fontSize: 'clamp(14px,1.4vw,17px)', fontWeight: 300,
                color: 'rgba(240,239,235,0.5)', maxWidth: 360,
                lineHeight: 1.65, marginBottom: 40,
              }}>
                Request a VIP table for our next events. Best spots, exclusive service.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="cta-btn" onClick={() => setIsOpen(true)}>
                  Request a Table →
                </button>
              </div>
            </motion.div>
          </div>

          {/* scroll hint */}
          <div style={{ position: 'absolute', right: 28, bottom: 56, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <span className="tbl-label" style={{ writingMode: 'vertical-rl', fontSize: 9, marginBottom: 0 }}>Scroll</span>
            <span style={{ width: 1, height: 48, background: 'rgba(240,239,235,0.15)', display: 'block' }} />
          </div>
        </section>

        {/* ── PERKS ── */}
        <section style={{ padding: `${sec} ${pad}`, borderBottom: '1px solid var(--dim)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="tbl-label">What's Included</span>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 2, marginTop: 8,
              }}>
                {[
                  { n: '01', t: 'Priority Entry', d: 'Skip the line with your group.' },
                  { n: '02', t: 'Dedicated Host', d: 'Personal service throughout the night.' },
                  { n: '03', t: 'Best Spots', d: 'Exclusive access to premium locations.' },
                  { n: '04', t: 'Bottle Service', d: 'Curated selection delivered to your table.' },
                ].map(p => (
                  <div key={p.n} style={{
                    borderTop: '1px solid var(--dim)',
                    padding: '24px 0',
                    paddingRight: 24,
                  }}>
                    <span style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(240,239,235,0.22)', display: 'block', marginBottom: 14 }}>{p.n}</span>
                    <h3 className="f-syne" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 8 }}>{p.t}</h3>
                    <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(240,239,235,0.42)', lineHeight: 1.6 }}>{p.d}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section style={{ padding: `${sec} ${pad}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <span className="tbl-label">Atmosphere</span>
            <div
              className="gal-grid"
              style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 3, marginTop: 8 }}
            >
              {images.map((src, idx) => (
                <motion.div
                  key={idx}
                  className="gal-wrap"
                  style={{
                    position: 'relative',
                    aspectRatio: idx === 0 ? '3/4' : '3/4',
                    overflow: 'hidden',
                    gridRow: idx === 0 ? 'span 2' : 'span 1',
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <Image
                    src={src} alt={`Atmosphere ${idx + 1}`}
                    fill className="gal-img"
                    style={{ objectFit: 'cover' }} quality={65}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DRAWER ── */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'fixed', inset: 0, zIndex: 50,
                  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                }}
              />

              {/* drawer */}
              <motion.div
                key="drawer"
                className="drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* drawer header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px 28px',
                  borderBottom: '1px solid rgba(240,239,235,0.07)',
                  flexShrink: 0,
                }}>
                  <div>
                    <h2 className="f-syne" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>
                      Request a Table
                    </h2>
                    <p style={{ fontSize: 11, color: 'rgba(240,239,235,0.3)', marginTop: 2, letterSpacing: '0.05em' }}>
                      We'll confirm via WhatsApp
                    </p>
                  </div>
                  <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
                </div>

                {/* form body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '32px 28px' }}>
                  {loadingEvents ? (
                    <p style={{ color: 'rgba(240,239,235,0.4)', fontSize: 13 }}>Loading events...</p>
                  ) : error ? (
                    <p style={{ color: '#e55', fontSize: 13 }}>{error}</p>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

                      {/* Event */}
                      <div style={{ marginBottom: 32 }}>
                        <span className="form-section-label">Event</span>
                        <select className="tbl-field" value={event} onChange={e => setEvent(e.target.value)} required>
                          <option value="">Select an event</option>
                          {events.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.title || ev.id}</option>
                          ))}
                        </select>
                      </div>

                      {/* Personal */}
                      <div style={{ marginBottom: 32 }}>
                        <span className="form-section-label">Personal Info</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                          <input className="tbl-field" type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                          <input className="tbl-field" type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
                        </div>
                        <input className="tbl-field" style={{ marginTop: 16 }} type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                        <input className="tbl-field" style={{ marginTop: 16 }} type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
                      </div>

                      {/* Details */}
                      <div style={{ marginBottom: 32 }}>
                        <span className="form-section-label">Details</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                          <input className="tbl-field" type="number" placeholder="Est. Age" value={age} onChange={e => setAge(e.target.value)} />
                          <input className="tbl-field" type="number" placeholder="Guests" value={guests} onChange={e => setGuests(e.target.value)} required />
                        </div>
                        <textarea
                          className="tbl-field"
                          style={{ marginTop: 16, resize: 'none' }}
                          placeholder="Any special requests..."
                          rows={3}
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                        />
                      </div>

                      <button type="submit" className="cta-btn" style={{ marginTop: 8, width: '100%', padding: '16px' }}>
                        Send via WhatsApp →
                      </button>

                      <p style={{ fontSize: 11, color: 'rgba(240,239,235,0.2)', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
                        By submitting you'll be redirected to WhatsApp to confirm your request.
                      </p>

                    </form>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </main>
    </>
  )
}