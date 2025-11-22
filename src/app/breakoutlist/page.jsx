'use client'

import { useState, useEffect } from "react"
import BreakoutList from "../admin/components/BreakoutList"

export default function BreakoutPage() {
  const [accessGranted, setAccessGranted] = useState(false)
  const [password, setPassword] = useState("")

  // ⬅️ Check localStorage on page load
  useEffect(() => {
    const savedAccess = localStorage.getItem("breakout_access")
    if (savedAccess === "true") {
      setAccessGranted(true)
    }
  }, [])

  const handleLogin = () => {
    if (password === "123") {
      setAccessGranted(true)
      localStorage.setItem("breakout_access", "true") // ⬅️ persist login
    } else {
      alert("Wrong password!")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("breakout_access")
    setAccessGranted(false)
  }

  if (!accessGranted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#dd0005] text-white text-center px-4 relative overflow-hidden">
        <h1 className="absolute text-[20vw] md:text-[12vw] font-black opacity-10 tracking-tight select-none">
          BREAKOUT
        </h1>

        <div className="relative z-10 flex flex-col items-center">
          <img
            src="/images/breaktitle.png"
            alt="Breakout Logo"
            className="w-72 mb-6"
          />

          <h2 className="text-xl uppercase tracking-[0.25em] mb-4">
            Restricted Access
          </h2>

          <input
            type="password"
            placeholder="Enter Access Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white text-black rounded-md px-4 py-3 focus:outline-none w-64 text-center placeholder-neutral-500 uppercase tracking-wide"
          />

          <button
            onClick={handleLogin}
            className="cursor-pointer mt-6 bg-black text-white px-8 py-3 rounded-full uppercase tracking-wider text-sm hover:bg-white hover:text-black transition-all duration-300"
          >
            Login
          </button>

          <p className="text-[10px] text-white/60 uppercase tracking-[0.25em] mt-12">
            Not a format — a movement.
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#dd0005] text-white px-6 md:px-20 py-16 relative overflow-hidden">

      {/* logout button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-black/50 hover:bg-black px-4 py-2 rounded-xl text-xs uppercase tracking-wide"
      >
        Logout
      </button>

      {/* background word */}
      <h1 className="absolute inset-0 flex items-center justify-center text-[20vw] md:text-[10vw] font-black opacity-10 tracking-tight select-none pointer-events-none">
        BREAKOUT
      </h1>

      {/* Header */}
      <div className="relative z-10 mb-12 text-center">
        <img
          src="/images/breaktitle.png"
          alt="Breakout Admin"
          className="w-64 mx-auto mb-4"
        />
        <h2 className="text-sm uppercase tracking-[0.25em] opacity-80">
          RSVP List — Milan 22.11.25
        </h2>
      </div>

      {/* List */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-10 shadow-lg overflow-x-auto">
        <BreakoutList />
      </div>

      <p className="relative z-10 mt-16 text-center text-[10px] text-white/70 uppercase tracking-[0.25em]">
        Breakout Admin — Restricted Area
      </p>
    </main>
  )
}
