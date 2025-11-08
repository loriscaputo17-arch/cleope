'use client'

import Image from "next/image"
import Link from "next/link"

export default function Sidebar({ section, setSection, setAccess }) {
  const logout = () => setAccess(false)

  return (
    <div className="flex flex-col justify-between h-full py-8 px-4">
      <div>

        <nav className="flex flex-col gap-3 mt-16">
          {["dashboard", "events", "lists", "settings"].map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`cursor-pointer text-left px-4 py-2 rounded-md transition-all duration-200 ${
                section === s
                  ? "bg-white text-black font-semibold"
                  : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={logout}
        className="text-sm text-neutral-400 hover:text-white transition mt-8"
      >
        Logout
      </button>
    </div>
  )
}
