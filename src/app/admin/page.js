'use client'

import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import Events from "./components/Events"
import Lists from "./components/Lists"
import Settings from "./components/Settings"
import Login from "./components/Login"

export default function AdminPage() {
  const [access, setAccess] = useState(false)
  const [section, setSection] = useState("events")

  return (
    <>
      {!access ? (
        <Login setAccess={setAccess} />
      ) : (
        <div className="flex h-screen bg-black text-white pt-12">
          {/* Sidebar */}
          <div className="w-64 fixed left-0 top-0 h-full border-r border-white/10 bg-neutral-950">
            <Sidebar section={section} setSection={setSection} setAccess={setAccess} />
          </div>

          {/* Main content */}
          <main className="flex-1 ml-64 overflow-y-auto p-10">
            {section === "dashboard" && <Dashboard />}
            {section === "events" && <Events />}
            {section === "lists" && <Lists />}
            {section === "settings" && <Settings />}
          </main>
        </div>
      )}
    </>
  )
}
