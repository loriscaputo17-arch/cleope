'use client'

import { useState } from "react"
import BreakoutList from "../admin/components/BreakoutList"

export default function BreakoutPage() {
  const [accessGranted, setAccessGranted] = useState(false)
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (password === "123") {
      setAccessGranted(true)
    } else {
      alert("Wrong password!")
    }
  }

  if (!accessGranted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-4">
        <h1 className="text-3xl font-bold mb-6 uppercase tracking-widest">
          Breakout Access
        </h1>

        <input
          type="password"
          placeholder="Enter Access Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-transparent border-b border-white/30 px-4 py-3 focus:outline-none w-64 text-center placeholder-white/40 text-lg"
        />

        <button
          onClick={handleLogin}
          className="cursor-pointer mt-6 bg-white text-black px-8 py-3 rounded-full uppercase tracking-wide text-sm hover:bg-neutral-200 transition"
        >
          Login
        </button>

      </div>
    )
  }

  return (
    <main className="p-8 mt-16 mx-4 md:mx-20 text-white">
      <BreakoutList />
    </main>
  )
}
