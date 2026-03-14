'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { db } from "../../lib/firebase"
import { supabase } from "../../lib/supabase"
import { collection, getDocs } from 'firebase/firestore'
import { motion } from 'framer-motion'

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap');

    :root {
      --bg: #080808;
      --fg: #f0efeb;
      --mid: rgba(240,239,235,0.5);
      --dim: rgba(240,239,235,0.1);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--fg); }

    .f-syne  { font-family: 'Syne', sans-serif; }
    .f-inter { font-family: 'Inter', sans-serif; }

    .label {
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--mid);
    }

    @keyframes marq { to { transform: translateX(-50%); } }
    .marq { animation: marq 26s linear infinite; display: flex; white-space: nowrap; }
    .marq:hover { animation-play-state: paused; }

    .svc {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 22px 0;
      border-bottom: 1px solid var(--dim);
      cursor: default;
      transition: padding-left 0.3s ease;
    }
    .svc:first-child { border-top: 1px solid var(--dim); }
    .svc:hover { padding-left: 12px; }
    .svc:hover .svc-arrow { opacity: 1; transform: translateX(0); }
    .svc-arrow {
      font-size: 18px;
      color: var(--fg);
      opacity: 0;
      transform: translateX(-8px);
      transition: opacity 0.3s, transform 0.3s;
    }

    .ev-img {
      transition: transform 0.6s cubic-bezier(0.22,1,0.36,1), filter 0.4s;
      filter: grayscale(100%) brightness(0.85);
    }
    .ev-wrap:hover .ev-img {
      transform: scale(1.05);
      filter: grayscale(0%) brightness(0.95);
    }
    .ev-wrap:hover .ev-cta { opacity: 1; transform: translateY(0); }
    .ev-cta {
      opacity: 0;
      transform: translateY(6px);
      transition: opacity 0.3s, transform 0.3s;
    }

    .nl-in {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 300;
      background: rgba(240,239,235,0.04);
      border: 1px solid var(--dim);
      border-right: none;
      color: var(--fg);
      padding: 14px 20px;
      flex: 1;
      outline: none;
      transition: border-color 0.25s;
    }
    .nl-in::placeholder { color: rgba(240,239,235,0.25); }
    .nl-in:focus { border-color: rgba(240,239,235,0.35); }

    .btn-solid {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      background: var(--fg);
      color: var(--bg);
      border: none;
      padding: 14px 28px;
      cursor: pointer;
      transition: opacity 0.2s;
      white-space: nowrap;
    }
    .btn-solid:hover { opacity: 0.88; }

    .btn-ghost {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      background: transparent;
      color: var(--fg);
      border: 1px solid rgba(240,239,235,0.22);
      padding: 14px 28px;
      cursor: pointer;
      transition: border-color 0.2s;
      white-space: nowrap;
    }
    .btn-ghost:hover { border-color: rgba(240,239,235,0.55); }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fu  { animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both; }
    .d1  { animation-delay: 0.1s; }
    .d2  { animation-delay: 0.22s; }
    .d3  { animation-delay: 0.36s; }

    @media (max-width: 768px) {
      .two-col { grid-template-columns: 1fr !important; }
      .hide-mob { display: none !important; }
      .ev-grid { grid-template-columns: 1fr !important; }
      .ev-grid > * { grid-column: span 1 !important; grid-row: span 1 !important; min-height: 280px !important; }
    }
  `}</style>
)

export default function Home() {
  const [events, setEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [email, setEmail] = useState("")
  const [loadingNewsletter, setLoadingNewsletter] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const snap = await getDocs(collection(db, 'events'))
        const list = snap.docs
          .map(doc => {
            const data = doc.data()
            console.log(data)
            return {
              id: doc.id, ...data,
              date: typeof data.date === 'string'
                ? data.date
                : data.date?.toDate?.().toISOString?.()
            }
          })
          .filter(e => e.date)
          .sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        setEvents(list.slice(0, 5))
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingEvents(false)
      }
    }
    fetchEvents()
  }, [])

  async function subscribeNewsletter() {
    if (!email) return

    try {
      setLoadingNewsletter(true)

      const { error } = await supabase
        .from('Newsletter')
        .insert([{ email }])

      if (error) throw error

      setSuccess(true)
      setEmail("")
    } catch (err) {
      console.error("Newsletter error:", err)
      alert("Something went wrong")
    } finally {
      setLoadingNewsletter(false)
    }
  }

  const pad = 'clamp(20px, 5vw, 72px)'
  const sec = 'clamp(64px, 9vw, 128px)'

  return (
    <>
      <GlobalStyles />
      <main className="f-inter" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', height: '100svh', width: '100%', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <img
              src="image.webp"
              alt="CLEOPE"
              style={{ objectFit: 'cover', opacity: 0.45, height: '100%' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, transparent 30%, #080808 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,8,8,0.1) 0%, rgba(8,8,8,0.65) 75%, #080808 100%)' }} />
          </div>

          <div style={{
            position: 'relative', zIndex: 10,
            height: '100%', display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: `0 ${pad} clamp(48px, 7vw, 80px)`,
          }}>
            <p className="label fu" style={{ marginBottom: 20 }}>Milano — Creative Hub</p>
            <h1 className="f-syne fu d1 md:text-[80px] text-[40px]" style={{
              fontWeight: 800, lineHeight: 0.9, letterSpacing: '-0.02em',
              color: 'var(--fg)', marginBottom: 24,
            }}>
              CLEOPE
            </h1>
            <p className="f-inter fu d2 text-[12px] md:text-[14px] md:w-full w-80" style={{
              fontWeight: 300, color: 'rgba(240,239,235,0.55)',
              maxWidth: 380, lineHeight: 1.6, marginBottom: 40,
            }}>
              Creative direction, event production and community growth for the new wave of nightlife.
            </p>
            <div className="fu d3" style={{ display: 'flex', gap: 12 }}>
              <Link href="/events"><button className="btn-solid">Explore Events</button></Link>
              <Link href="/about"><button className="btn-ghost">What We Do</button></Link>
            </div>
          </div>

          <div style={{
            position: 'absolute', right: 28, bottom: 56, zIndex: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <span className="label" style={{ writingMode: 'vertical-rl', fontSize: 9 }}>Scroll</span>
            <span style={{ width: 1, height: 48, background: 'rgba(240,239,235,0.15)', display: 'block' }} />
          </div>
        </section>

        {/* ── TICKER ── */}
        <div style={{ borderTop: '1px solid var(--dim)', borderBottom: '1px solid var(--dim)', padding: '13px 0', overflow: 'hidden' }}>
          <div className="marq">
            {Array(10).fill(null).map((_, i) => (
              <span key={i} className="label" style={{ padding: '0 28px', color: 'rgba(240,239,235,0.16)' }}>
                Creative Direction
                <span style={{ margin: '0 20px', opacity: 0.4 }}>×</span>
                Event Production
                <span style={{ margin: '0 20px', opacity: 0.4 }}>×</span>
                Community
                <span style={{ margin: '0 20px', opacity: 0.4 }}>×</span>
                Milano
                <span style={{ margin: '0 20px', opacity: 0.4 }}>×</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── WHAT WE DO ── */}
        <section style={{ padding: `${sec} ${pad}`, borderBottom: '1px solid var(--dim)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'clamp(40px,6vw,100px)', alignItems: 'start' }}>

              <div style={{ position: 'sticky', top: 120 }}>
                <p className="label" style={{ marginBottom: 16 }}>What We Do</p>
                <h2 className="f-syne" style={{
                  fontSize: 'clamp(32px, 3.5vw, 48px)',
                  fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em',
                }}>
                  We make<br />things happen.
                </h2>
              </div>

              <div>
                {[
                  { n: '01', title: 'Art Direction', text: 'Creative concepts and visual identities shaping next-generation nightlife experiences.' },
                  { n: '02', title: 'Event Production', text: 'Full-stack event design, from venue strategy to immersive execution.' },
                  { n: '03', title: 'Community Creation', text: 'We build and nurture highly engaged cultural communities across Italy.' },
                  { n: '04', title: 'Marketing & Growth', text: 'Data-driven campaigns, PR networks and performance strategies.' },
                ].map((item) => (
                  <motion.div
                    key={item.n} className="svc"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                      <span className="label" style={{ fontSize: 10, minWidth: 28 }}>{item.n}</span>
                      <div>
                        <h3 className="f-syne" style={{ fontSize: 'clamp(18px,2vw,24px)', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>
                          {item.title}
                        </h3>
                        <p style={{ fontSize: 13, color: 'rgba(240,239,235,0.45)', lineHeight: 1.6, maxWidth: 400 }}>
                          {item.text}
                        </p>
                      </div>
                    </div>
                    <span className="svc-arrow hide-mob">→</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── EVENTS ── */}
        {!loadingEvents && events.length > 0 && (
          <section style={{ padding: `${sec} ${pad}`, borderBottom: '1px solid var(--dim)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
                <div>
                  <p className="label" style={{ marginBottom: 12 }}>On The Calendar</p>
                  <h2 className="f-syne" style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95 }}>
                    Upcoming<br />Events
                  </h2>
                </div>
                <Link href="/events" className="hide-mob">
                  <button className="btn-ghost">View All →</button>
                </Link>
              </div>

              <div className="ev-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 3 }}>
                {events.map((event, idx) => {
                  const big = idx === 0
                  return (
                    <Link
                      key={event.id}
                      href={`#`}
                      style={{ gridColumn: 'span 1', gridRow: big ? 'span 2' : 'span 1', display: 'block' }}
                    >
                      <motion.div
                        className="ev-wrap"
                        style={{ position: 'relative', overflow: 'hidden', height: '100%', minHeight: big ? 540 : 260 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.07, duration: 0.5 }}
                      >
                        <Image
                          src={event.img || '/fallback.jpg'}
                          alt={event.title} fill
                          className="ev-img"
                          style={{ objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.05) 60%)' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 }}>
                          <p className="label" style={{ marginBottom: 6, fontSize: 9 }}>
                            {new Date(event.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          <h4 className="f-syne" style={{
                            fontSize: big ? 'clamp(22px,2.5vw,34px)' : 'clamp(16px,1.8vw,22px)',
                            fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1,
                          }}>
                            {event.title}
                          </h4>
                          <p className="ev-cta label" style={{ marginTop: 8, fontSize: 9 }}>View event →</p>
                        </div>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>

            </div>
          </section>
        )}

        {/* ── STATEMENT ── */}
        <section style={{ padding: `${sec} ${pad}`, borderBottom: '1px solid var(--dim)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.div
              className="two-col"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,100px)', alignItems: 'center' }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="f-syne" style={{
                fontSize: 'clamp(44px,7.5vw,100px)',
                fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.9,
              }}>
                Built<br />Around<br />People.
              </h2>
              <div>
                <p style={{
                  fontSize: 'clamp(15px,1.4vw,18px)',
                  fontWeight: 300, color: 'rgba(240,239,235,0.5)',
                  lineHeight: 1.7, marginBottom: 36,
                }}>
                  CLEOPE is not just about events. We design ecosystems where culture, music and community evolve together.
                </p>
                <Link href="/about">
                  <button className="btn-solid">Join The Community</button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── NEWSLETTER ── */}
        <section style={{ padding: `${sec} ${pad}` }}>
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
            <p className="label" style={{ marginBottom: 16 }}>Newsletter</p>
            <h3 className="f-syne" style={{
              fontSize: 'clamp(28px,3.5vw,44px)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 12,
            }}>
              Stay in the loop.
            </h3>
            <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--mid)', marginBottom: 36, lineHeight: 1.6 }}>
              Early access, private drops and curated experiences. No spam.
            </p>
            <div style={{ display: 'flex' }}>
              <input
                type="email"
                placeholder="your@email.com"
                className="nl-in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                className="btn-solid"
                onClick={subscribeNewsletter}
                disabled={loadingNewsletter}
              >
                {loadingNewsletter ? "..." : "Subscribe"}
              </button>
            </div>

            {success && (
              <p style={{ marginTop: 16, fontSize: 12, color: "rgba(240,239,235,0.6)" }}>
                Thanks for subscribing.
              </p>
            )}
          </div>
        </section>

      </main>
    </>
  )
}