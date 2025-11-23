'use client'

import { useEffect, useState } from "react"

export default function Login({ setAccess }) {
  const [password, setPassword] = useState("")
  const [year, setYear] = useState("")

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  const handleLogin = () => {
    if (password === "123") setAccess(true)
    else alert("Wrong password!")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-4">
      <h1 className="text-3xl font-bold mb-6 uppercase tracking-widest">CLEOPE Admin</h1>

      <input
        type="password"
        placeholder="Enter Admin Password"
        value={password}
        data-lpignore="true"
        onChange={(e) => setPassword(e.target.value)}
        className="bg-transparent border-b border-white/30 px-4 py-3 focus:outline-none w-64 text-center placeholder-white/40"
      />

      <button
        onClick={handleLogin}
        className="cursor-pointer mt-6 bg-white text-black px-8 py-3 rounded-full uppercase tracking-wide text-sm hover:bg-neutral-200 transition"
      >
        Login
      </button>

      <p className="text-neutral-500 text-xs mt-6 tracking-wide">
        © {year || "----"} CLEOPE Admin System
      </p>
    </div>
  )
}
