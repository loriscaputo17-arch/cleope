'use client'

import { useState, useEffect } from "react"
import InnerRouteRSVPList from "./components/InnerRouteRSVPList"
import InnerRouteTablesList from "../admin/components/InnerRouteTablesList"

export default function InnerRouteAdminPage() {
  const [accessGranted, setAccessGranted] = useState(false)
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState("rsvp")

  // Persist login
  useEffect(() => {
    const saved = localStorage.getItem("innerroute_admin")
    if (saved === "true") setAccessGranted(true)
  }, [])

  const handleLogin = () => {
    if (password === "1") {
      setAccessGranted(true)
      localStorage.setItem("innerroute_admin", "true")
    } else {
      alert("Invalid access code")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("innerroute_admin")
    setAccessGranted(false)
  }

  /* ================= LOGIN ================= */
  if (!accessGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-6 relative overflow-hidden">

        {/* Background */}
        <h1 className="absolute inset-0 flex items-center justify-center text-[22vw] md:text-[12vw] font-black opacity-[0.04] tracking-tight select-none pointer-events-none">
          THE MERGE
        </h1>

        <div className="relative z-10 w-full max-w-sm text-center">

          <input
            type="password"
            placeholder="Access Code"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-white/40 px-4 py-3 text-center text-sm uppercase tracking-[0.3em] text-white outline-none"
          />

          <button
            onClick={handleLogin}
            className="mt-10 w-full border border-white py-3 text-xs uppercase tracking-[0.35em] hover:bg-white hover:text-black transition"
          >
            Enter
          </button>

          <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-white/40">
            Admin Area · The Merge
          </p>
        </div>
      </div>
    )
  }

  /* ================= AUTH ================= */
  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-16 py-12 relative overflow-hidden mt-24">

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 text-xs uppercase tracking-wider border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition"
      >
        Logout
      </button>

      {/* Background */}
      <h1 className="absolute inset-0 flex items-center justify-center text-[22vw] md:text-[10vw] font-black opacity-[0.04] tracking-tight select-none pointer-events-none">
        ADMIN
      </h1>

      {/* Header */}
      <div className="relative z-10 text-center mb-14">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">
          The Merge 2
        </p>
      </div>

      {/* Tabs */}
      <div className="relative z-10 flex justify-center gap-12 mb-10 text-xs uppercase tracking-[0.3em]">
        <button
          onClick={() => setActiveTab("rsvp")}
          className={activeTab === "rsvp" ? "border-b border-white pb-2" : "opacity-40"}
        >
          RSVP Requests
        </button>
        <button
          onClick={() => setActiveTab("tables")}
          className={activeTab === "tables" ? "border-b border-white pb-2" : "opacity-40"}
        >
          Table Requests
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 bg-white/5 border border-white/15 rounded-xl p-4 md:p-8 overflow-x-auto">
        {activeTab === "rsvp" ? (
          <InnerRouteRSVPList collection="inner_route_part_one_rsvp" />
        ) : (
          <InnerRouteTablesList collection="inner_route_part_one_tables" />
        )}
      </div>

      <p className="relative z-10 mt-16 text-center text-[10px] uppercase tracking-[0.3em] text-white/40">
        CLEOPE · VESPER · Restricted Admin
      </p>
    </main>
  )
}
