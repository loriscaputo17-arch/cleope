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

export default function Only300List() {
  const [attendees, setAttendees] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [search, setSearch] = useState("")

  // Fetch attendees
  const fetchAttendees = async () => {
    try {
      setLoading(true)
      const snapshot = await getDocs(collection(db, "only300_rsvp"))

      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        status: d.data().status || "pending",
        checkedIn: d.data().checkedIn || false,
      }))

      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))

      setAttendees(list)
      setFiltered(list)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendees()
  }, [])

  // Search filter
  useEffect(() => {
    const q = search.trim().toLowerCase()
    setFiltered(attendees.filter(a => `${a.firstName} ${a.lastName}`.toLowerCase().includes(q)))
  }, [search, attendees])

  // Update + Send Email
  const updateStatus = async (id, newStatus, attendee) => {
    try {
      setSendingEmail(true)

      await updateDoc(doc(db, "only300_rsvp", id), { status: newStatus })

      // Send approval email only if approved
      if (newStatus === "approved") {
        await fetch("/api/only300_confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: attendee.email,
            name: `${attendee.firstName} ${attendee.lastName}`,
          }),
        })
      }

      setAttendees(prev =>
        prev.map(a => (a.id === id ? { ...a, status: newStatus } : a))
      )

      alert("Email inviata e stato aggiornato ✔️")
    } catch {
      alert("Errore: impossibile aggiornare o inviare email ❌")
    } finally {
      setSendingEmail(false)
    }
  }

  // Delete entry
  const handleDelete = async (id) => {
    if (!confirm("Vuoi eliminare questo contatto?")) return

    await deleteDoc(doc(db, "only300_rsvp", id))
    setAttendees(prev => prev.filter(a => a.id !== id))
  }

  // CSV export
  const downloadCSV = () => {
    if (!attendees.length) return alert("Nessun dato da esportare.")

    const headers = ["Nome", "Cognome", "Email", "Status", "Registrato il"]
    const rows = attendees.map(a => [
      a.firstName || "",
      a.lastName || "",
      a.email || "",
      a.status || "",
      a.createdAt instanceof Timestamp ? new Date(a.createdAt.toDate()).toLocaleString("it-IT") : "",
    ])

    const csvContent = [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement("a")
    link.href = url
    link.download = `only300-rsvp-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="text-white pb-20">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-2">ONLY 300 — Admin</h1>

      <p className="mb-6 text-lg text-neutral-400">
        Richieste totali: <strong>{attendees.length}</strong>
      </p>

      <button
        onClick={downloadCSV}
        className="mb-6 mr-4 bg-blue-500 px-5 py-3 rounded-xl font-semibold hover:bg-blue-400 transition"
      >
        Scarica CSV
      </button>

      <input
        type="text"
        placeholder="🔍 Cerca nome o cognome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 bg-neutral-800 px-4 py-3 rounded-xl w-full md:w-1/2 border border-white/10 focus:border-purple-400 outline-none"
      />

      {loading ? (
        <p className="text-neutral-500">Caricamento...</p>
      ) : filtered.length === 0 ? (
        <p className="text-neutral-600 italic text-lg">Nessun risultato trovato.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-base">
              <thead className="bg-neutral-900 border-b border-white/10 text-neutral-400 uppercase text-sm">
                <tr>
                  <th className="px-6 py-4 text-left">Nome</th>
                  <th className="px-6 py-4 text-left">Status</th>
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
                      className={`border-b border-white/10 ${
                        a.status === "approved"
                          ? "bg-green-900/20"
                          : a.status === "pending"
                          ? "bg-yellow-900/20"
                          : "bg-red-900/20"
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-lg">
                        {a.firstName} {a.lastName}
                      </td>

                      <td className="px-6 py-4">
                        {a.status === "approved" ? (
                          <span className="text-green-400 font-bold">APPROVATO</span>
                        ) : (
                          <span className="text-yellow-400 font-bold">IN ATTESA</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-neutral-400">
                        {a.createdAt instanceof Timestamp
                          ? new Date(a.createdAt.toDate()).toLocaleString("it-IT")
                          : "—"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {a.status !== "approved" && (
                          <button
                            disabled={sendingEmail}
                            onClick={() => updateStatus(a.id, "approved", a)}
                            className="bg-green-500 px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition mr-2"
                          >
                            {sendingEmail ? "Invio..." : "Approva"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="bg-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-500 transition"
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
        </>
      )}
    </main>
  )
}
