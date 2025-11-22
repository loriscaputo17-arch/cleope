'use client'

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
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({ firstName: "", lastName: "" })

  const fetchAttendees = async () => {
    try {
      setLoading(true)
      const snapshot = await getDocs(collection(db, "breakout_rsvp"))
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        checkedIn: d.data().checkedIn || false, // ensure field exists
        ...d.data(),
      }))

      // Optional: sort so unchecked users appear first
      list.sort((a, b) => Number(a.checkedIn) - Number(b.checkedIn))

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

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      attendees.filter(a =>
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(q)
      )
    )
  }, [search, attendees])

  const updateCheckIn = async (id, status) => {
    try {
      await updateDoc(doc(db, "breakout_rsvp", id), { checkedIn: status })
      setAttendees(prev =>
        prev.map(a => (a.id === id ? { ...a, checkedIn: status } : a))
      )
    } catch (err) {
      alert("Errore check-in.")
    }
  }

  const handleEdit = (att) => {
    setEditingId(att.id)
    setEditData({ firstName: att.firstName, lastName: att.lastName })
  }

  const handleSave = async (id) => {
    try {
      await updateDoc(doc(db, "breakout_rsvp", id), {
        firstName: editData.firstName,
        lastName: editData.lastName,
      })
      setEditingId(null)
      fetchAttendees()
    } catch {
      alert("Errore aggiornamento.")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Sicuro di eliminare?")) return
    try {
      await deleteDoc(doc(db, "breakout_rsvp", id))
      setAttendees(prev => prev.filter(a => a.id !== id))
    } catch {
      alert("Errore eliminazione.")
    }
  }

  return (
    <main className="text-white">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Breakout 11.11 – Check-In</h1>

      <p className="mb-6 text-lg text-neutral-400">
        Totale presenti: <strong>{attendees.filter(a => a.checkedIn).length}</strong> / {attendees.length}
      </p>

      <input
        type="text"
        placeholder="🔍 Cerca nome o cognome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 bg-neutral-800 px-4 py-3 rounded-xl w-full md:w-1/2 outline-none border border-white/10 focus:border-purple-400 transition"
      />

      {loading ? <p className="text-neutral-500">Caricamento...</p> : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden">
            <table className="w-full text-base">
              <thead className="bg-neutral-900 border-b border-white/10 text-neutral-400 uppercase text-sm">
                <tr>
                  <th className="px-6 py-4 text-left">Nome</th>
                  <th className="px-6 py-4 text-left">Check-in</th>
                  <th className="px-6 py-4 text-left">Data</th>
                  <th className="px-6 py-4 text-right">Azioni</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence mode="popLayout">
                  {filtered.map((a) => (
                    <motion.tr key={a.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className={`border-b border-white/10 transition ${
                        a.checkedIn ? "bg-green-900/20" : ""
                      }`}>
                      <td className="px-6 py-4 font-medium text-lg">{a.firstName} {a.lastName}</td>

                      <td className="px-6 py-4">
                        {a.checkedIn ? (
                          <span className="text-green-400 font-semibold">Entrato 🟢</span>
                        ) : (
                          <span className="text-red-400 font-semibold">Non entrato 🔴</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-neutral-400 text-sm">
                        {a.createdAt instanceof Timestamp
                          ? new Date(a.createdAt.toDate()).toLocaleString("it-IT")
                          : "—"}
                      </td>

                      <td className="px-6 py-4 text-right flex gap-3 justify-end">

                        {a.checkedIn ? (
                          <button onClick={() => updateCheckIn(a.id, false)}
                            className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400">
                            Undo check-in
                          </button>
                        ) : (
                          <button onClick={() => updateCheckIn(a.id, true)}
                            className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-400">
                            Check-in
                          </button>
                        )}

                        <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-300">Elimina</button>
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
