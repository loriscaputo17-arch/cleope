'use client'

import { useState, useEffect } from "react"
import Only300List from "../admin/components/Only300List"

export default function BreakoutPage() {
  const [accessGranted, setAccessGranted] = useState(false)
  const [password, setPassword] = useState("")

  // Check saved login
  useEffect(() => {
    const savedAccess = localStorage.getItem("only300_rsvp")
    if (savedAccess === "true") {
      setAccessGranted(true)
    }
  }, [])

  const handleLogin = () => {
    if (password === "123") {
      setAccessGranted(true)
      localStorage.setItem("only300_rsvp", "true")
    } else {
      alert("Wrong password!")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("only300_rsvp")
    setAccessGranted(false)
  }

  // --- LOGIN SCREEN ---
  if (!accessGranted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-4 relative overflow-hidden">
        
        {/* Background Typography */}
        <h1 className="absolute text-[20vw] md:text-[12vw] font-black opacity-5 tracking-tight select-none text-[#dd0005] pointer-events-none">
          ONLY 300
        </h1>

        <div className="relative z-10 flex flex-col items-center animate-fadeIn">
          <img
            src="/images/RONIN_title.png"
            alt="Breakout Logo"
            className="w-72 mb-6 brightness-90"
          />

          <h2 className="text-xl uppercase tracking-[0.25em] mb-4 text-white/60">
            Restricted Access
          </h2>

          <input
            type="password"
            placeholder="Access Code"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white text-black rounded-md px-4 py-3 focus:outline-none w-64 text-center placeholder-neutral-500 uppercase tracking-wide"
          />

          <button
            onClick={handleLogin}
            className="cursor-pointer mt-6 bg-[#dd0005] text-white px-8 py-3 rounded-full uppercase tracking-wider text-sm hover:bg-white hover:text-[#dd0005] transition-all duration-300"
          >
            Enter
          </button>

          <p className="text-[10px] text-white/40 uppercase tracking-[0.25em] mt-12">
            Not a format — a movement.
          </p>
        </div>
      </div>
    )
  }

  // --- AUTHENTICATED PAGE ---
  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-20 py-16 relative overflow-hidden">
      
      {/* Logout */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-white/10 hover:bg-[#dd0005] hover:text-white px-4 py-2 rounded-xl text-xs uppercase tracking-wide transition-all duration-300"
      >
        Logout
      </button>

      {/* Background word */}
      <h1 className="absolute inset-0 flex items-center justify-center text-[20vw] md:text-[10vw] font-black opacity-5 tracking-tight select-none pointer-events-none text-[#dd0005]">
        ONLY 300
      </h1>

      {/* Header */}
      <div className="relative z-10 mb-12 text-center">
        <img
          src="/images/RONIN_title.png"
          alt="Breakout Admin"
          className="w-64 mx-auto mb-4"
        />
        <h2 className="text-sm uppercase tracking-[0.25em] text-white/60">
          RSVP List — Milan 29.11.25
        </h2>
      </div>

      {/* List Container */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-10 shadow-lg overflow-x-auto">
        <Only300List />
      </div>

      <p className="relative z-10 mt-16 text-center text-[10px] text-white/40 uppercase tracking-[0.25em]">
        Breakout Admin — Restricted Area
      </p>
    </main>
  )
}
