"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore"
import { motion, AnimatePresence } from "framer-motion"

export default function BreakoutRsvp() {
  const [attendees, setAttendees] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

  // Fetch attendees from Firestore
  const fetchAttendees = async () => {
    try {
      setLoading(true)
      const snapshot = await getDocs(collection(db, "breakout_rsvp"))

      const list = snapshot.docs.map((d) => ({
        id: d.id,
        checkedIn: d.data().checkedIn || false,
        ...d.data(),
      }))

      // Order newest → oldest
      list.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0
        const dateB = b.createdAt?.seconds || 0
        return dateB - dateA
      })

      setAttendees(list)
      setFiltered(list)
    } catch (err) {
      console.error(err)
      setError("Errore durante il caricamento.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendees()
  }, [])

  // Live search filter
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      attendees.filter((a) =>
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(q)
      )
    )
  }, [search, attendees])

  // Update check-in status
  const updateCheckIn = async (id, status) => {
    try {
      await updateDoc(doc(db, "breakout_rsvp", id), { checkedIn: status })

      setAttendees((prev) =>
        prev
          .map((a) => (a.id === id ? { ...a, checkedIn: status } : a))
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      )
    } catch (err) {
      alert("Errore check-in.")
    }
  }

  // Delete guest
  const handleDelete = async (id) => {
    if (!confirm("Vuoi eliminare questo contatto?")) return
    try {
      await deleteDoc(doc(db, "breakout_rsvp", id))
      setAttendees((prev) => prev.filter((a) => a.id !== id))
    } catch {
      alert("Errore eliminazione.")
    }
  }

  // Export as CSV for Brevo
  const downloadCSV = () => {
    if (attendees.length === 0) return alert("Nessun dato da esportare.")

    const headers = ["Nome", "Cognome", "Email", "Check-in", "Registrato il"]

    const rows = attendees.map(a => [
      a.firstName || "",
      a.lastName || "",
      a.email || "",
      a.checkedIn ? "YES" : "NO",
      a.createdAt instanceof Timestamp
        ? new Date(a.createdAt.toDate()).toLocaleString("it-IT")
        : "",
    ])

    const csvContent = [
      headers.join(";"),
      ...rows.map(r => r.join(";")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `breakout-checkin-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="text-white pb-20">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Breakout 11.11 – Check-in</h1>

      <p className="mb-6 text-lg text-neutral-400">
        Presenti:{" "}
        <strong>{attendees.filter((a) => a.checkedIn).length}</strong> /{" "}
        {attendees.length}
      </p>

      {/* 📁 EXPORT CSV BUTTON */}
      <button
        onClick={downloadCSV}
        className="mb-6 bg-blue-500 px-5 py-3 rounded-xl font-semibold hover:bg-blue-400 transition"
      >
        ⬇️ Scarica CSV per Brevo
      </button>

      {/* 🔍 SEARCH BAR */}
      <input
        type="text"
        placeholder="🔍 Cerca nome o cognome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 bg-neutral-800 px-4 py-3 rounded-xl w-full md:w-1/2 outline-none border border-white/10 focus:border-purple-400 transition"
      />

      {error && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-xl mb-6 border border-red-500/30">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-neutral-500">Caricamento...</p>
      ) : filtered.length === 0 ? (
        <p className="text-neutral-600 italic text-lg">Nessun risultato trovato.</p>
      ) : (
        <>
          {/* 🖥 TABLE */}
          <div className="hidden md:block bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-base">
              <thead className="bg-neutral-900 border-b border-white/10 text-neutral-400 uppercase text-sm">
                <tr>
                  <th className="px-6 py-4 text-left">Nome</th>
                  <th className="px-6 py-4 text-left">Stato</th>
                  <th className="px-6 py-4 text-left">Data</th>
                  <th className="px-6 py-4 text-right">Azioni</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence mode="popLayout">
                  {filtered.map((a) => (
                    <motion.tr
                      key={a.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`border-b border-white/10 transition ${
                        a.checkedIn && "bg-green-900/20"
                      }`}
                    >
                      <td className="px-6 py-4 text-lg font-medium">
                        {a.firstName} {a.lastName}
                      </td>

                      <td className="px-6 py-4">
                        {a.checkedIn ? (
                          <span className="text-green-400 font-bold">Entrato 🟢</span>
                        ) : (
                          <span className="text-red-400 font-bold">Non entrato 🔴</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-neutral-400">
                        {a.createdAt instanceof Timestamp
                          ? new Date(a.createdAt.toDate()).toLocaleString("it-IT")
                          : "—"}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        {!a.checkedIn ? (
                          <button
                            onClick={() => updateCheckIn(a.id, true)}
                            className="bg-green-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition"
                          >
                            Check-in
                          </button>
                        ) : (
                          <button
                            onClick={() => updateCheckIn(a.id, false)}
                            className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                          >
                            Undo
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(a.id)}
                          className="text-red-400 hover:text-red-300 font-bold"
                        >
                          Elimina
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* 📱 MOBILE CARDS */}
          <div className="md:hidden space-y-5 mt-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((a) => (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`border p-5 rounded-xl shadow-lg transition ${
                    a.checkedIn
                      ? "border-green-500/50 bg-green-900/10"
                      : "border-white/10 bg-neutral-950"
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-1">
                    {a.firstName} {a.lastName}
                  </h3>

                  <p className="text-sm mb-2">
                    {a.checkedIn ? (
                      <span className="text-green-400 font-semibold">Entrato 🟢</span>
                    ) : (
                      <span className="text-red-400 font-semibold">Non entrato 🔴</span>
                    )}
                  </p>

                  <p className="text-xs text-neutral-500 mb-4">
                    {a.createdAt instanceof Timestamp
                      ? new Date(a.createdAt.toDate()).toLocaleString("it-IT")
                      : ""}
                  </p>

                  <div className="flex gap-3">
                    {!a.checkedIn ? (
                      <button
                        onClick={() => updateCheckIn(a.id, true)}
                        className="flex-1 bg-green-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-green-400 transition"
                      >
                        Check-in
                      </button>
                    ) : (
                      <button
                        onClick={() => updateCheckIn(a.id, false)}
                        className="flex-1 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition"
                      >
                        Undo
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(a.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-500 transition"
                    >
                      X
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </main>
  )
}
