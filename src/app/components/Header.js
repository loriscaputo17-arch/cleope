'use client'

import { useState } from 'react'
import Link from 'next/link'

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const leftLinks = [
    { href: '/nextevents', label: 'Calendar' },
    { href: '/tables', label: 'Tables' },
  ]

  const rightLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'The Hub' },
  ]

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#28282880] backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {leftLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline uppercase tracking-wider text-[10px]">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="font-lovelo tracking-wider font-bold">
          <img
            src="/logo/logowhite.png"
            alt="Logo"
            className="object-cover w-full md:h-10 h-5 col-span-2 row-span-2 rounded-lg"
            />
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {rightLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline uppercase tracking-wider text-[10px]">
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-neutral-200">
          <div className="flex flex-col px-6 py-4">
            {[...leftLinks, ...rightLinks].map((link, idx) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 flex items-center gap-2 border-b border-neutral-200 last:border-b-0 text-[#565656]"
              >
                <sup className="text-xs text-neutral-500">{String(idx + 1).padStart(2, '0')}.</sup>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
