'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import Events from "./components/Events"
import Lists from "./components/Lists"
import BreakoutList from "./components/BreakoutList"
import Settings from "./components/Settings"
import Login from "./components/Login"

export default function AdminPage() {
  const [access, setAccess] = useState(false)
  const [section, setSection] = useState("events")
  const [menuOpen, setMenuOpen] = useState(false)

  const sectionTitles = {
    dashboard: "Dashboard",
    events: "Events",
    lists: "Access Lists",
    settings: "Settings",
    formats: {
      label: "Formats",
      children: {
        breakout1111: "Breakout 11.11",
      },
    },
  }

  const getSectionTitle = () => {
    const direct = sectionTitles[section]
    if (typeof direct === "string") return direct

    for (const key in sectionTitles) {
      const value = sectionTitles[key]
      if (value?.children && value.children[section]) {
        return `${value.label} › ${value.children[section]}`
      }
    }
    return section
  }

  return (
    <>
      {!access ? (
        <Login setAccess={setAccess} />
      ) : (
        <div className="flex h-screen bg-black text-white relative">
          <div className="hidden md:flex w-64 fixed left-0 top-0 h-full border-r border-white/10 bg-neutral-950">
            <Sidebar section={section} setSection={setSection} setAccess={setAccess} />
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md md:hidden"
              >
                <div className="absolute top-0 left-0 w-64 h-full bg-neutral-950 border-r border-white/10 shadow-2xl">
                  <Sidebar
                    section={section}
                    setSection={setSection}
                    setAccess={setAccess}
                    onClose={() => setMenuOpen(false)}
                  />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <main className="flex-1 flex flex-col md:ml-64 overflow-hidden pt-[5rem]">
            <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between md:hidden">
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 rounded-md hover:bg-white/10 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

              <h2 className="text-lg font-semibold uppercase tracking-wide">
                {getSectionTitle()}
              </h2>

              <div className="w-6" />
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {section === "dashboard" && <Dashboard />}
                  {section === "events" && <Events />}
                  {section === "lists" && <Lists />}
                  {section === "settings" && <Settings />}
                  {section === "breakout1111" && <BreakoutList />}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      )}
    </>
  )
}
