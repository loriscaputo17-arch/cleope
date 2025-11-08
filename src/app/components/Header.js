'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [temperature, setTemperature] = useState(null)
  const [time, setTime] = useState("")

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

  // Time update
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString("it-IT", {
        hour: '2-digit',
        minute: '2-digit',
      })
      setTime(now)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Milano temp
  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=45.4642&longitude=9.19&current_weather=true")
      .then(res => res.json())
      .then(data => setTemperature(data.current_weather?.temperature))
      .catch(() => setTemperature("--"))
  }, [])

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6 text-[13px] uppercase tracking-widest text-neutral-300">
        
        {/* LEFT NAV */}
        <div className="hidden md:flex items-center gap-8">
          {leftLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors text-[12px]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CENTER LOGO */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
          <Link href="/" className="hover:opacity-90 transition">
            <Image
              src="/logo/logowhite.png"
              alt="CLEOPE HUB"
              width={160}
              height={60}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* RIGHT NAV */}
        <div className="hidden md:flex items-center gap-8 text-[12px]">
          {rightLinks.slice(0, 2).map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="text-[11px] text-neutral-500 border-l border-white/10 pl-4">
            Milano • {temperature !== null ? `${temperature}°C` : '--°C'} • {time} IT
          </div>
        </div>

        {/* BURGER MOBILE */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl ml-auto z-1000"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-xl z-40 flex flex-col justify-between"
          >
            <div className="flex flex-col mx-8 items-left justify-left text-left gap-6 mt-28">
              <Image
                src="/logo/logowhite.png"
                alt="CLEOPE Logo"
                width={140}
                height={50}
                className="mb-8"
              />

              {[...leftLinks, ...rightLinks].map((link, idx) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg uppercase tracking-widest text-white hover:text-neutral-400 transition"
                >
                  <span className="text-neutral-500 text-[12px] mr-2">{String(idx + 1).padStart(2, '0')}.</span>
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="text-center pb-8 text-[11px] text-neutral-500 border-t border-white/10 pt-4">
              Milano • {temperature !== null ? `${temperature}°C` : '--°C'} • {time} IT
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
