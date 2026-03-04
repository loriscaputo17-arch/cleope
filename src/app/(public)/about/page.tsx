'use client'

import { useEffect, useState } from "react";
import Image from 'next/image';
import { motion } from 'framer-motion';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

    :root {
      --bg: #080808;
      --fg: #f0efeb;
      --mid: rgba(240,239,235,0.48);
      --dim: rgba(240,239,235,0.08);
    }

    .abt { font-family: 'Inter', sans-serif; }
    .f-syne { font-family: 'Syne', sans-serif; }

    .abt-label {
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      font-weight: 500;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: rgba(240,239,235,0.32);
      display: block;
      margin-bottom: 14px;
    }

    /* partner card */
    .partner-card {
      border: 1px solid var(--dim);
      padding: 28px;
      transition: border-color 0.25s;
    }
    .partner-card:hover { border-color: rgba(240,239,235,0.22); }

    /* stat block */
    .stat {
      border-top: 1px solid var(--dim);
      padding: 24px 0 20px;
    }

    /* image hover */
    .img-wrap img {
      transition: transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.5s;
      filter: grayscale(30%);
    }
    .img-wrap:hover img {
      transform: scale(1.04);
      filter: grayscale(0%);
    }

    /* quote block */
    .quote-wrap {
      border-left: 1px solid rgba(240,239,235,0.15);
      padding-left: 28px;
    }

    @media (max-width: 768px) {
      .split { grid-template-columns: 1fr !important; }
      .stats-row { grid-template-columns: 1fr 1fr !important; }
      .partners-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
)

const fade = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

const pad  = 'clamp(20px, 5vw, 72px)'
const sec  = 'clamp(72px, 9vw, 130px)'

export default function AboutPage() {
  return (
    <>
      <GlobalStyles />
      <main className="abt" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          <img
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0507.JPG?alt=media"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,8,8,0.15) 0%, rgba(8,8,8,0.6) 60%, #080808 100%)' }} />

          <div style={{ position: 'relative', zIndex: 10, width: '100%', padding: `0 ${pad} clamp(56px, 8vw, 96px)` }}>
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <span className="abt-label">Milano — Creative Hub</span>
              <h1
                className="f-syne"
                style={{
                  fontSize: 'clamp(64px, 15vw, 190px)',
                  fontWeight: 800,
                  lineHeight: 0.9,
                  letterSpacing: '-0.02em',
                  marginBottom: 24,
                }}
              >
                The Hub
              </h1>
              <p style={{
                fontSize: 'clamp(15px, 1.5vw, 19px)',
                fontWeight: 300,
                color: 'rgba(240,239,235,0.52)',
                maxWidth: 440,
                lineHeight: 1.65,
              }}>
                An entertainment idea. With Made in Italy culture.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section style={{ padding: `${sec} ${pad}`, borderBottom: '1px solid var(--dim)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.div
              className="split"
              style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'clamp(40px,7vw,110px)', alignItems: 'start' }}
               initial="hidden" whileInView="show" viewport={{ once: true }}
            >
              <div>
                <span className="abt-label">Our Mission</span>
                <h2 className="f-syne" style={{ fontSize: 'clamp(28px,3vw,42px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Spaces where culture grows.
                </h2>
              </div>
              <div style={{ paddingTop: 4 }}>
                <p style={{ fontSize: 'clamp(15px,1.4vw,18px)', fontWeight: 300, color: 'rgba(240,239,235,0.52)', lineHeight: 1.75, maxWidth: 620 }}>
                  At CLEOPE HUB, we blend music, fashion, and connections through carefully curated nights and collaborations. Our events create value for artists, brands, and communities — building spaces for new ideas to meet, grow, and inspire.
                </p>

                {/* stats */}
                <div
                  className="stats-row"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0 32px', marginTop: 48 }}
                >
                  {[
                    { n: '2024', label: 'Founded' },
                    { n: '20+', label: 'Events produced' },
                    { n: 'Milano', label: 'Based in' },
                  ].map(s => (
                    <div key={s.n} className="stat">
                      <div className="f-syne" style={{ fontSize: 'clamp(28px,3vw,40px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>{s.n}</div>
                      <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,239,235,0.3)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── WHO WE ARE ── */}
        <section style={{ padding: `${sec} ${pad}`, borderBottom: '1px solid var(--dim)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.div
              className="split"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'center' }}
              initial="hidden" whileInView="show" viewport={{ once: true }}
            >
              <div className="img-wrap" style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0523.JPG?alt=media&token=ce2b3ad8-eb40-4fca-8814-95bb549adbd2"
                  alt="Who we are" fill style={{ objectFit: 'cover' }} quality={75}
                />
              </div>
              <div>
                <span className="abt-label">Who We Are</span>
                <h2 className="f-syne" style={{ fontSize: 'clamp(30px,3.5vw,48px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 24 }}>
                  A creative collective.
                </h2>
                <div className="quote-wrap">
                  <p style={{ fontSize: 'clamp(14px,1.3vw,17px)', fontWeight: 300, color: 'rgba(240,239,235,0.52)', lineHeight: 1.8 }}>
                    CLEOPE HUB is where music, fashion, and people seamlessly come together. Each event goes beyond entertainment — it's a curated experience where sound, style, and ideas merge into something unique.
                  </p>
                  <p style={{ fontSize: 'clamp(14px,1.3vw,17px)', fontWeight: 300, color: 'rgba(240,239,235,0.52)', lineHeight: 1.8, marginTop: 16 }}>
                    We stand for quality, creativity, and a new way of living culture together.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── STATEMENT ── */}
        <section style={{ padding: `${sec} ${pad}`, borderBottom: '1px solid var(--dim)', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.p
              className="f-syne"
              style={{
                fontSize: 'clamp(28px, 4.5vw, 64px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: 'var(--fg)',
                maxWidth: 900,
              }} initial="hidden" whileInView="show" viewport={{ once: true }}
            >
              From club nights to showcases, each project builds visibility, connections and lasting stories.
            </motion.p>
          </div>
        </section>

        {/* ── WHY CLEOPE ── */}
        <section style={{ padding: `${sec} ${pad}`, borderBottom: '1px solid var(--dim)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.div
              className="split"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'center' }}
               initial="hidden" whileInView="show" viewport={{ once: true }}
            >
              <div>
                <span className="abt-label">Why Cleope</span>
                <h2 className="f-syne" style={{ fontSize: 'clamp(30px,3.5vw,48px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 24 }}>
                  A true partner, not just an organizer.
                </h2>
                <div className="quote-wrap">
                  <p style={{ fontSize: 'clamp(14px,1.3vw,17px)', fontWeight: 300, color: 'rgba(240,239,235,0.52)', lineHeight: 1.8 }}>
                    Venues choose us for the network we connect, the targeted visibility we deliver, and our ability to provide all-in-one production and services with consistently high-quality performances.
                  </p>
                  <p style={{ fontSize: 'clamp(14px,1.3vw,17px)', fontWeight: 300, color: 'rgba(240,239,235,0.52)', lineHeight: 1.8, marginTop: 16 }}>
                    We build long-term value for every venue we collaborate with.
                  </p>
                </div>
              </div>
              <div className="img-wrap" style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0507.JPG?alt=media&token=c4211af3-dbe5-474a-8459-65d3af342fb2"
                  alt="Why Cleope" fill style={{ objectFit: 'cover' }} quality={75}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PARTNERS ── */}
        <section style={{ padding: `${sec} ${pad}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}>
              <span className="abt-label">Our Partners</span>
              <h2 className="f-syne" style={{ fontSize: 'clamp(30px,3.5vw,48px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 48 }}>
                Who we work with.
              </h2>
            </motion.div>

            <div
              className="partners-grid"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}
            >
              {[
                {
                  img: 'https://www.vesperbeachclub.com/wp-content/uploads/2025/07/DJI_0792-scaled.jpg',
                  label: 'Production',
                  name: 'Vesper Beach Club',
                  desc: '',
                },
                {
                  img: 'https://www.houseofronin.it/images/ronin-home.jpg',
                  label: 'Creative',
                  name: 'Ronin',
                  desc: '',
                },
              ].map((p, i) => (
                <motion.div
                  key={p.name}
                  className="partner-card"
                  style={{ position: 'relative', overflow: 'hidden' }}
                   initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="img-wrap" style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', marginBottom: 24 }}>
                    <Image
                      src={p.img} alt={p.name} fill
                      style={{ objectFit: 'cover' }} quality={70}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.5) 0%, transparent 60%)' }} />
                  </div>
                  <span className="abt-label" style={{ marginBottom: 8 }}>{p.label}</span>
                  <h3 className="f-syne" style={{ fontSize: 'clamp(20px,2vw,28px)', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 12 }}>
                    {p.name}
                  </h3>
                  <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(240,239,235,0.45)', lineHeight: 1.7 }}>
                    {p.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  )
}