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
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({ firstName: "", lastName: "" })

  // ---------------------------
  // FETCH FUNCTION
  // ---------------------------
  const fetchAttendees = async () => {
    try {
      if (!refreshing) setLoading(true)

      const snapshot = await getDocs(collection(db, "breakout_rsvp"))
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setAttendees(list)
    } catch (err) {
      console.error(err)
      setError("⚠️ Errore durante il caricamento dei dati.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Auto load
  useEffect(() => {
    fetchAttendees()
  }, [])

  // 🟢 REFRESH BUTTON ACTION
  const handleRefresh = () => {
    setRefreshing(true)
    fetchAttendees()
  }

  const handleEdit = (att) => {
    setEditingId(att.id)
    setEditData({ firstName: att.firstName, lastName: att.lastName })
  }

  const handleSave = async (id) => {
    try {
      const ref = doc(db, "breakout_rsvp", id)
      await updateDoc(ref, {
        firstName: editData.firstName,
        lastName: editData.lastName,
      })
      setEditingId(null)
      fetchAttendees()
    } catch (err) {
      console.error(err)
      alert("Errore durante il salvataggio.")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Eliminare questo RSVP?")) return

    try {
      await deleteDoc(doc(db, "breakout_rsvp", id))
      setAttendees((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      console.error(err)
      alert("Errore durante l’eliminazione.")
    }
  }

  return (
    <main className="text-white">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Breakout 11.11 – RSVPs
          </h1>
          <p className="text-lg text-white mt-1">
            <strong>Totale RSVP:</strong> {attendees.length}
          </p>
        </div>

        {/* 🔄 REFRESH BUTTON */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-white text-black px-6 py-3 rounded-full text-sm uppercase tracking-wide hover:bg-neutral-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {refreshing ? "⏳ Aggiornamento..." : "🔄 Aggiorna Lista"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-xl mb-6 border border-red-500/30 text-base">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-neutral-500 text-lg">Caricamento...</p>
      ) : attendees.length === 0 ? (
        <p className="text-neutral-500 italic text-lg">Nessun RSVP trovato.</p>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-neutral-950 border border-white/10 rounded-3xl shadow-xl overflow-hidden">
            <table className="w-full text-base">
              <thead className="bg-neutral-900/70 border-b border-white/10 uppercase text-sm text-neutral-400">
                <tr>
                  <th className="px-6 py-4 text-left">Nome</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Telefono</th>
                  <th className="px-6 py-4 text-left">Data Creazione</th>
                  <th className="px-6 py-4 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {attendees.map((a, i) => (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="px-6 py-4 font-medium">
                        {editingId === a.id ? (
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={editData.firstName}
                              onChange={(e) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  firstName: e.target.value,
                                }))
                              }
                              className="bg-neutral-800 px-3 py-2 rounded-lg w-28"
                            />
                            <input
                              type="text"
                              value={editData.lastName}
                              onChange={(e) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  lastName: e.target.value,
                                }))
                              }
                              className="bg-neutral-800 px-3 py-2 rounded-lg w-28"
                            />
                          </div>
                        ) : (
                          <span className="text-lg">
                            {a.firstName} {a.lastName}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-neutral-300">{a.email}</td>
                      <td className="px-6 py-4 text-neutral-300">{a.phone}</td>
                      <td className="px-6 py-4 text-neutral-400 text-sm">
                        {a.createdAt instanceof Timestamp
                          ? new Date(a.createdAt.toDate()).toLocaleString("it-IT")
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingId === a.id ? (
                          <div className="flex gap-3 justify-end">
                            <button
                              onClick={() => handleSave(a.id)}
                              className="bg-green-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-400 transition"
                            >
                              Salva
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-neutral-600 transition"
                            >
                              Annulla
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-3 justify-end">
                            <button
                              onClick={() => handleEdit(a)}
                              className="cursor-pointer text-blue-400 hover:text-blue-300 text-base font-semibold transition"
                            >
                              Modifica
                            </button>
                            <button
                              onClick={() => handleDelete(a.id)}
                              className="cursor-pointer text-red-400 hover:text-red-300 text-base font-semibold transition"
                            >
                              Elimina
                            </button>
                          </div>
                        )}
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
