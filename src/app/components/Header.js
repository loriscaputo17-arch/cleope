'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit' })
      setTime(now)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=45.4642&longitude=9.19&current_weather=true")
      .then(res => res.json())
      .then(data => setTemperature(data.current_weather?.temperature))
      .catch(() => setTemperature("--"))
  }, [])

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0a80] backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center md:justify-between px-6 py-4 text-[13px] md:text-[15px] uppercase tracking-wider text-neutral-300">

        {/* Left nav */}
        <div className="flex flex-col">
          <nav className="hidden md:flex gap-6 text-sm font-medium">
          <div className="text-[10px] text-neutral-400">
            <span>Milano</span>
            <span className="mx-1">•</span>
            <span>{temperature !== null ? `${temperature}°C` : '--°C'}</span>
            <span className="mx-1">•</span>
            <span>{time} IT</span>
          </div>
            {leftLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline uppercase tracking-wider text-[11px]">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logo center */}
        <Link href="/" className="font-lovelo tracking-wider font-bold">
          <img
            src="/logo/logowhite.png"
            alt="Logo"
            className="object-cover md:w-full w-40 md:h-10 col-span-2 row-span-2 rounded-lg"
          />
        </Link>

        {/* Right nav + socials */}
        <div className="flex flex-col items-end">
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            {rightLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline uppercase tracking-wider text-[11px]">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Burger mobile */}
        <button
          className="md:hidden text-3xl text-white md:ml-4 ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-white/10">
          <div className="flex flex-col px-6 py-4">

            {[...leftLinks, ...rightLinks].map((link, idx) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 flex items-center gap-2 border-b border-white/10 last:border-b-0 text-white"
              >
                <sup className="text-xs text-neutral-500">{String(idx + 1).padStart(2, '0')}.</sup>
                {link.label}
              </Link>
            ))}

            <div className="text-[10px] text-neutral-400 mt-4">
              <span>Milano</span>
              <span className="mx-1">•</span>
              <span>{temperature !== null ? `${temperature}°C` : '--°C'}</span>
              <span className="mx-1">•</span>
              <span>{time} IT</span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}