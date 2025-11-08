'use client'

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { motion, AnimatePresence } from "framer-motion"

export default function Lists() {
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState("")
  const [attendees, setAttendees] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingAttendees, setLoadingAttendees] = useState(false)
  const [error, setError] = useState("")
  const [selectedPR, setSelectedPR] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true)
        const snapshot = await getDocs(collection(db, "events"))
        const eventsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setEvents(eventsList)
      } catch (err) {
        console.error(err)
        setError("Failed to load events.")
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    if (!selectedEventId) {
      setAttendees([])
      setSelectedPR("All")
      return
    }

    const fetchAttendees = async () => {
      try {
        setLoadingAttendees(true)
        const snapshot = await getDocs(collection(db, "events", selectedEventId, "attendees"))
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setAttendees(list)
      } catch (err) {
        console.error(err)
        setError("Failed to load attendees.")
      } finally {
        setLoadingAttendees(false)
      }
    }

    fetchAttendees()
  }, [selectedEventId])

  return (
    <main className="text-white">
      <h1 className="text-4xl font-extrabold mb-10 tracking-tight">Access Lists</h1>

      {error && (
        <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6 border border-red-500/30">
          {error}
        </div>
      )}

      {/* Event Selector */}
      <div className="mb-10">
        <label htmlFor="eventSelect" className="block mb-2 text-sm uppercase tracking-widest text-neutral-400">
          Select Event
        </label>

        {loadingEvents ? (
          <p className="text-neutral-500 text-sm">Loading events...</p>
        ) : (
          <select
            id="eventSelect"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-white/20 focus:outline-none transition"
          >
            <option value="">-- Select an event --</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title || ev.id}
              </option>
            ))}
          </select>
        )}
      </div>

      <AnimatePresence>
        {selectedEventId && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
          >
            <EventDetails
              attendees={attendees}
              loading={loadingAttendees}
              selectedPR={selectedPR}
              setSelectedPR={setSelectedPR}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

function EventDetails({ attendees, loading, selectedPR, setSelectedPR, searchTerm, setSearchTerm }) {
  // Group by PR
  const groupedByPR = attendees.reduce((acc, att) => {
    const pr = att.pr || "No PR"
    if (!acc[pr]) acc[pr] = []
    acc[pr].push(att)
    return acc
  }, {})

  const allPRs = ["All", ...Object.keys(groupedByPR)]
  let filtered = selectedPR === "All" ? attendees : groupedByPR[selectedPR] || []

  // Search filter
  if (searchTerm.trim() !== "") {
    const lower = searchTerm.toLowerCase()
    filtered = filtered.filter(
      (a) =>
        (a.firstName && a.firstName.toLowerCase().includes(lower)) ||
        (a.lastName && a.lastName.toLowerCase().includes(lower))
    )
  }

  return (
    <section className="bg-neutral-950 border border-white/10 p-6 rounded-2xl shadow-2xl relative">
      {/* Sticky toolbar */}
      <div className="sticky top-0 bg-neutral-950 pb-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5">
        <h2 className="text-xl font-semibold tracking-wide">Attendees</h2>

        <div className="flex flex-wrap gap-3">
          <select
            value={selectedPR}
            onChange={(e) => setSelectedPR(e.target.value)}
            className="px-4 py-2 rounded-lg bg-neutral-800 border border-white/10 text-sm focus:ring-1 focus:ring-white/20"
          >
            {allPRs.map((pr) => (
              <option key={pr} value={pr}>
                {pr}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg bg-neutral-800 border border-white/10 text-sm focus:ring-1 focus:ring-white/20"
          />

          <ExportCSVButton attendees={filtered} />
        </div>
      </div>

      {/* Attendees list */}
      {loading ? (
        <p className="text-neutral-500 text-sm">Loading attendees...</p>
      ) : filtered.length === 0 ? (
        <p className="italic text-neutral-500 text-sm">No attendees found.</p>
      ) : (
        <Accordion title={`Showing ${filtered.length} attendees`}>
          <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scroll">
            {filtered.map((a, i) => (
              <motion.li
                key={a.id || i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.01 }}
                className="border-b border-white/5 pb-2 text-sm text-neutral-200 hover:bg-white/5 rounded-md px-2 transition"
              >
                <span className="font-semibold text-white">
                  {a.firstName} {a.lastName}
                </span>{" "}
                <span className="text-neutral-400">• {a.phone || "No phone"}</span>{" "}
                <span className="text-neutral-500 text-xs uppercase tracking-wide ml-1">
                  (PR: {a.pr || "N/A"})
                </span>
              </motion.li>
            ))}
          </ul>
        </Accordion>
      )}
    </section>
  )
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center bg-neutral-900/70 px-4 py-3 rounded-lg text-left hover:bg-neutral-800 transition"
      >
        <span className="font-semibold tracking-wide">{title}</span>
        <span className="text-xs text-neutral-400">{open ? "▲" : "▼"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ExportCSVButton({ attendees }) {
  const handleExport = () => {
    if (!attendees.length) return alert("No data to export.")

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["First Name,Last Name,Phone,PR"]
        .concat(
          attendees.map(
            (a) =>
              `${a.firstName || ""},${a.lastName || ""},${a.phone || ""},${a.pr || ""}`
          )
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "attendees.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={handleExport}
      className="bg-white text-black px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition"
    >
      Export CSV
    </button>
  )
}
