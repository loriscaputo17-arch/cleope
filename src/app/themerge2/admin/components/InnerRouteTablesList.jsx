'use client'

import { useEffect, useMemo, useState } from "react"
import { db } from "../../../../lib/firebase"
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc
} from "firebase/firestore"

export default function InnerRouteTablesList() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState("")

  /* ================= FETCH ================= */
  useEffect(() => {
    const q = query(
      collection(db, "the_merge_2_tables"),
      orderBy("createdAt", "desc")
    )

    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })

    return () => unsub()
  }, [])

  /* ================= SEARCH ================= */
  const filtered = useMemo(() => {
    const s = search.toLowerCase()
    return items.filter(i =>
      `${i.fullName} ${i.phone} ${i.notes || ""}`
        .toLowerCase()
        .includes(s)
    )
  }, [items, search])

  /* ================= CSV ================= */
  const exportCSV = () => {
    const headers = ["Full Name", "Phone", "Guests", "Checked In", "Notes", "Date"]
    const rows = filtered.map(i => [
      i.fullName,
      i.phone,
      i.guests,
      i.checkedIn ? "YES" : "NO",
      i.notes || "",
      i.createdAt?.toDate().toISOString() || ""
    ])

    const csv = [headers, ...rows]
      .map(r => r.map(v => `"${v}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "inner-route-tables.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  /* ================= ACTIONS ================= */
  const toggleCheckin = async (item) => {
    await updateDoc(doc(db, "inner_route_part_one_tables", item.id), {
      checkedIn: !item.checkedIn
    })
  }

  const whatsappLink = (phone) => {
    const clean = phone.replace(/\D/g, "")
    return `https://wa.me/${clean}`
  }

  /* ================= UI ================= */
  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <h3 className="text-xs uppercase tracking-[0.3em] text-white/60">
          Table Requests ({filtered.length})
        </h3>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            placeholder="Search name, phone or notes"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-b w-[50vw] border-white/30 text-[14px] uppercase tracking-widest px-2 py-2 outline-none"
          />

          <button
            onClick={exportCSV}
            className="border border-white/30 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-white/50 border-b border-white/10">
              <th className="py-2">Name</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Guests</th>
              <th className="py-2">Notes</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(item => (
              <tr
                key={item.id}
                className={`border-b border-white/5 ${item.checkedIn ? "opacity-50" : ""}`}
              >
                <td className="py-2">{item.fullName}</td>

                <td className="py-2">
                  <a
                    href={whatsappLink(item.phone)}
                    target="_blank"
                    className="underline underline-offset-2"
                  >
                    {item.phone}
                  </a>
                </td>

                <td className="py-2">{item.guests}</td>

                <td className="py-2 text-xs text-white/60 max-w-xs truncate">
                  {item.notes || "-"}
                </td>

                <td className="py-2 text-xs uppercase tracking-wider">
                  {item.checkedIn ? "Checked-in" : "Pending"}
                </td>

                <td className="py-2 text-right">
                  <button
                    onClick={() => toggleCheckin(item)}
                    className={`border px-3 py-1 text-xs uppercase transition ${
                      item.checkedIn
                        ? "border-white/20 text-white/40"
                        : "border-white/40 hover:bg-white hover:text-black"
                    }`}
                  >
                    {item.checkedIn ? "Undo" : "Check-in"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden flex flex-col gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className={`border border-white/15 p-4 ${item.checkedIn ? "opacity-50" : ""}`}
          >
            <p className="text-sm mb-1">{item.fullName}</p>

            <a
              href={whatsappLink(item.phone)}
              target="_blank"
              className="text-xs underline underline-offset-2 block mb-1"
            >
              {item.phone}
            </a>

            <p className="text-xs text-white/60 mb-1">
              Guests: {item.guests}
            </p>

            {item.notes && (
              <p className="text-xs text-white/60 mb-2">
                {item.notes}
              </p>
            )}

            <p className="text-[10px] uppercase tracking-wider mb-3">
              {item.checkedIn ? "Checked-in" : "Pending"}
            </p>

            <button
              onClick={() => toggleCheckin(item)}
              className="w-full border border-white/40 py-2 text-[14px] uppercase"
            >
              {item.checkedIn ? "Undo Check-in" : "Check-in"}
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}
