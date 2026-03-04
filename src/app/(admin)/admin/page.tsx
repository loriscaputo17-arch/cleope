'use client'

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Login from "./components/Login"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import Events from "./components/Events"
import Lists from "./components/Lists"
import Contacts from "./components/Contacts"
import CheckIn from "./components/CheckIn"
import QRCheckIn from "./components/Qrcheckin"
import Messaging from "./components/Messaging"
import Settings from "./components/Settings"
import { Section, AdminUser } from "./components/ui"

const STORAGE_KEY = "cleope_admin_user"

export default function AdminPage() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [section, setSection] = useState<Section>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)


  const sectionMap: Record<Section, React.ReactNode> = {
    dashboard:  <Dashboard user={user} />,
    events:     <Events user={user} />,
    lists:      <Lists user={user} />,
    contacts:   <Contacts user={user} />,
    checkin:    <CheckIn user={user} />,
    qrcheckin:  <QRCheckIn user={user} />,
    messaging:  <Messaging user={user} />,
    settings:   <Settings user={user} />,
  }

  const sectionLabels: Record<Section, string> = {
    dashboard: "Dashboard",
    events:    "Events",
    lists:     "Lists & RSVPs",
    contacts:  "Contacts",
    checkin:   "Check-in",
    qrcheckin: "QR Check-in",
    messaging: "Messaging",
    settings:  "Settings",
  }

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

    if (!user) return <Login onLogin={setUser} />


  return (
    <div style={{ display: "flex", height: "100vh", background: "#070707", color: "#f0efeb", fontFamily: "'Inter', sans-serif", overflow: "hidden" }}>

      {/* Desktop sidebar */}
      <div className="hidden md:flex" style={{ width: 220, flexShrink: 0 }}>
        <Sidebar user={user} section={section} setSection={setSection} onLogout={() => {
  localStorage.removeItem(STORAGE_KEY)
  setUser(null)
}} />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 40, backdropFilter: "blur(4px)" }}
            />
            <motion.div
              key="sidebar"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 220, zIndex: 50 }}
            >
              <Sidebar user={user} section={section} setSection={(s) => { setSection(s); setSidebarOpen(false) }} onLogout={() => setUser(null)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", height: 56,
          borderBottom: "1px solid rgba(240,239,235,0.07)",
          flexShrink: 0,
        }}>
          {/* mobile burger */}
          <button
            className="md:hidden flex"
            onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "1px solid rgba(240,239,235,0.12)", color: "rgba(240,239,235,0.6)", width: 32, height: 32, cursor: "pointer", fontSize: 14, alignItems: "center", justifyContent: "center" }}
          >
            ☰
          </button>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>
            {sectionLabels[section]}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,239,235,0.3)" }}>
              {user.name}
            </span>
            <span style={{
              fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "3px 8px",
              background: user.role === "admin" ? "rgba(240,239,235,0.9)" : "rgba(240,239,235,0.08)",
              color: user.role === "admin" ? "#070707" : "rgba(240,239,235,0.5)",
            }}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "clamp(24px,3vw,40px)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {sectionMap[section]}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}