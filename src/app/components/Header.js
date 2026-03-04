'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [temperature, setTemperature] = useState(null)
  const [time, setTime] = useState("")
  const [scrolled, setScrolled] = useState(false)

  const leftLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'The Hub' },
  ]

  const rightLinks = [
    { href: '/nextevents', label: 'Calendar' },
    { href: '/tables', label: 'Tables' },
    { href: 'https://www.instagram.com/cleopeofficial/', label: 'Instagram' },
    { href: 'https://www.tiktok.com/@cleopeofficial?lang=en', label: 'Tiktok' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit' }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=45.4642&longitude=9.19&current_weather=true")
      .then(res => res.json())
      .then(data => setTemperature(data.current_weather?.temperature))
      .catch(() => setTemperature("--"))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .hdr { font-family: 'DM Sans', sans-serif; }

        /* ── ticker ── */
        .ticker-wrap {
          background: #fff;
          overflow: hidden;
          height: 26px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e8e8e8;
        }
        .ticker-track {
          display: flex;
          white-space: nowrap;
          animation: tick 32s linear infinite;
        }
        .ticker-track:hover { animation-play-state: paused; }
        @keyframes tick {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-item {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #111;
          padding: 0 40px;
        }
        .ticker-sep { color: #aaa; margin: 0 8px; }

        /* ── nav ── */
        .nav-bar {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* ── links ── */
        .nav-link {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.42);
          text-decoration: none;
          position: relative;
          padding-bottom: 2px;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: #fff;
          transition: width 0.25s ease;
        }
        .nav-link:hover { color: #fff; }
        .nav-link:hover::after { width: 100%; }

        /* ── status ── */
        .status {
          font-size: 9px;
          font-weight: 300;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          white-space: nowrap;
        }

        /* ── burger ── */
        .burger {
          background: none;
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.65);
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 13px;
          flex-shrink: 0;
          transition: border-color 0.2s, color 0.2s;
        }
        .burger:hover { border-color: rgba(255,255,255,0.55); color: #fff; }

        /* ── mobile overlay ── */
        .mob-overlay {
          position: fixed; top: 0; left: 0;
          width: 100%; height: 100vh;
          background: #050505;
          z-index: 40;
          display: flex; flex-direction: column;
        }
        .mob-link {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 11vw, 58px);
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.1);
          text-decoration: none;
          line-height: 1;
          display: flex; align-items: baseline; gap: 12px;
          transition: color 0.2s;
        }
        .mob-link:hover { color: rgba(255,255,255,0.88); }
        .mob-num {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 300;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.25);
        }
      `}</style>

      <header className="hdr fixed top-0 left-0 w-full z-50">

        {/* ── TICKER ── */}
        <a href="/formats/themerge2/">
          <div className="ticker-wrap">
            <div className="ticker-track">
              {Array(8).fill(null).map((_, i) => (
                <span key={i} className="ticker-item">
                  <strong>The Merge 2</strong>
                  <span className="ticker-sep">·</span>
                  Sabato 28 Febbraio
                  <span className="ticker-sep">·</span>
                  Milano
                  <span className="ticker-sep">·</span>
                  RSVP Now
                </span>
              ))}
            </div>
          </div>
        </a>

        {/* ── NAV ── */}
        <div
          className="nav-bar"
          style={{
            background: scrolled ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0.55)',
            transition: 'background 0.4s ease',
          }}
        >
          {/*
            3-column grid:  [left nav]  [logo]  [right nav]
            col 1 and col 3 are equal width → logo is always perfectly centered
          */}
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              padding: '18px 32px',
            }}
          >
            {/* LEFT */}
            <div className="hidden md:flex items-center gap-7">
              {leftLinks.map(link => (
                <Link key={link.href} href={link.href} className="nav-link">{link.label}</Link>
              ))}
            </div>

            {/* CENTER — logo col */}
            <Link
              href="/"
              className='flex items-center'
            >
              <Image
                src="/logo/logowhite.png"
                alt="CLEOPE HUB"
                width={144}
                height={50}
                style={{ objectFit: 'contain' }}
                priority
              />
            </Link>

            {/* RIGHT */}
            <div className="hidden md:flex items-center justify-end gap-7">
              {rightLinks.slice(0, 2).map(link => (
                <Link key={link.href} href={link.href} className="nav-link">{link.label}</Link>
              ))}
              <span
                className="status"
                style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '14px' }}
              >
                Milano · {temperature !== null ? `${temperature}°C` : '--°C'} · {time}
              </span>
            </div>

            {/* MOBILE — burger lives in col 3, logo stays in col 2 */}
            <div
              className="md:hidden flex justify-end"
              style={{ gridColumn: 3 }}
            >
              <button
                className="burger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
              >
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE OVERLAY ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mob-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              {/* top bar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <Image
                  src="/logo/logowhite.png"
                  alt="CLEOPE"
                  width={112}
                  height={40}
                  style={{ objectFit: 'contain', opacity: 0.9 }}
                />
                <button className="burger" onClick={() => setMenuOpen(false)} aria-label="Chiudi">✕</button>
              </div>

              {/* nav links */}
              <nav style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '0 24px',
              }}>
                {[...leftLinks, ...rightLinks].map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + idx * 0.055, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 0' }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="mob-link"
                    >
                      <span className="mob-num">{String(idx + 1).padStart(2, '0')}</span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* footer */}
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span className="status">
                  Milano · {temperature !== null ? `${temperature}°C` : '--°C'} · {time} IT
                </span>
                <span style={{
                  fontSize: '9px', letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.12)', textTransform: 'uppercase',
                }}>
                  © CLEOPE
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}