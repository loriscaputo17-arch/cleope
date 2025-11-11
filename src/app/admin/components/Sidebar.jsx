'use client'

import { useState } from "react"

export default function Sidebar({ section, setSection, setAccess, onClose }) {
  const [formatsOpen, setFormatsOpen] = useState(false)

  const logout = () => setAccess(false)

  // Funzione helper per selezione menu + chiusura mobile
  const handleSectionChange = (s) => {
    setSection(s)
    if (onClose) onClose() // chiudi sidebar solo se siamo su mobile
  }

  return (
    <div className="flex flex-col justify-between h-full py-8 px-4 w-full relative">
      {/* Pulsante chiusura mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition md:hidden"
        >
          ✕
        </button>
      )}

      <div className="mt-10 md:mt-0">
        <nav className="flex flex-col gap-3 mt-16">
          {/* Sezioni principali */}
          {["dashboard", "events", "lists", "settings"].map((s) => (
            <button
              key={s}
              onClick={() => handleSectionChange(s)}
              className={`cursor-pointer text-left px-4 py-3 rounded-md text-lg transition-all duration-200 ${
                section === s
                  ? "bg-white text-black font-semibold"
                  : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}

          {/* FORMATS DROPDOWN */}
          <div className="mt-2">
            <button
              onClick={() => setFormatsOpen(!formatsOpen)}
              className="cursor-pointer text-left px-4 py-3 rounded-md flex justify-between items-center text-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-200 w-full"
            >
              <span>Formats</span>
              <span
                className={`transform transition-transform ${
                  formatsOpen ? "rotate-90" : ""
                }`}
              >
                ▶
              </span>
            </button>

            {formatsOpen && (
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleSectionChange("breakout1111")}
                  className={`cursor-pointer text-left px-4 py-2 rounded-md text-base transition-all duration-200 ${
                    section === "breakout1111"
                      ? "bg-white text-black font-semibold"
                      : "text-neutral-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Breakout 11.11
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      <button
        onClick={() => {
          logout()
          if (onClose) onClose()
        }}
        className="text-base text-neutral-400 hover:text-white transition mt-8"
      >
        Logout
      </button>
    </div>
  )
}
