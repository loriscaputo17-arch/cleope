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

export default function InnerRouteRSVPList() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState("")

  /* ================= FETCH ================= */
  useEffect(() => {
    const q = query(
      collection(db, "the_merge_2_rsvp"),
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
      `${i.fullName} ${i.email}`
        .toLowerCase()
        .includes(s)
    )
  }, [items, search])

  /* ================= CSV ================= */
const exportCSV = (rows, filename) => {
  if (!rows?.length) {
    alert("Nothing to export")
    return
  }

  const headers = [
    "Fullname",
    "Email",
    "Phone",
    "PR",
    "Guests",
    "Status",
    "Note",
    "Created At",
  ]

  const csvRows = [headers.join(";")]

  rows.forEach(r => {
    const created =
      r.createdAt?.seconds
        ? new Date(r.createdAt.seconds * 1000).toLocaleString("it-IT")
        : ""

    csvRows.push([
      r.fullName || "",
      r.email || "",
      r.phone || "",
      r.q || "",
      r.guests ?? 1,
      r.status || "pending",
      r.note || "",
      created,
    ].join(";"))
  })

  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  })

  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}-${Date.now()}.csv`
  link.click()
}

  /* ================= ACTIONS ================= */
  const approve = async (item) => {
    await updateDoc(doc(db, "the_merge_2_rsvp", item.id), {
      approved: true
    })

    await fetch("/api/themerge2_confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: item.email,
        name: `${item.firstName} ${item.lastName}`
      })
    })
  }

  const toggleCheckin = async (item) => {
    await updateDoc(doc(db, "inner_route_part_one_rsvp", item.id), {
      checkedIn: !item.checkedIn
    })
  }

  const whatsappLink = (phone) => {
    if (!phone) return "#"
    const clean = phone.replace(/\D/g, "")
    return `https://wa.me/${clean}`
    }


  /* ================= UI ================= */
  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <h3 className="text-xs uppercase tracking-[0.3em] text-white/60">
          RSVP Requests ({filtered.length})
        </h3>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            placeholder="Search name or email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent w-[50vw] border-b border-white/30 text-[14px] uppercase tracking-widest px-2 py-2 outline-none"
          />

          <button
            onClick={() => exportCSV(filtered, "the-merge-2-rsvp")}
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
              <th className="py-2">Email</th>
              <th className="py-2">PR</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Date</th>
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
                  <a href={`mailto:${item.email}`} className="underline underline-offset-2">
                    {item.email}
                  </a>
                </td>
                <td className="py-2">
                    {item.q}
                </td>
                <td className="py-2">
                {item.phone ? (
                    <a
                    href={whatsappLink(item.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                    >
                    {item.phone}
                    </a>
                ) : "-"}
                </td>
                <td className="py-2 text-xs text-white/40">
                  {item.createdAt?.toDate().toLocaleString("it-IT")}
                </td>
                <td className="py-2 text-xs uppercase tracking-wider">
                  {item.checkedIn ? "Checked-in" : item.approved ? "Approved" : "Pending"}
                </td>
                <td className="py-2 text-right flex justify-end gap-3">
                  {!item.approved && (
                    <button
                      onClick={() => approve(item)}
                      className="border border-white/30 px-3 py-1 text-xs uppercase hover:bg-white hover:text-black transition"
                    >
                      Approve
                    </button>
                  )}
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
            <p className="text-sm mb-1">
              {item.fullName}
            </p>

            <a
              href={`mailto:${item.email}`}
              className="text-xs underline underline-offset-2 block mb-1"
            >
              {item.email}
            </a>

            <p className="text-xs text-white/60 mb-1">
              {item.phone || "No phone"}
            </p>

            <p className="text-[10px] text-white/40 mb-3">
              {item.createdAt?.toDate().toLocaleString("it-IT")}
            </p>

            <p className="text-[10px] uppercase tracking-wider mb-3">
              {item.checkedIn ? "Checked-in" : item.approved ? "Approved" : "Pending"}
            </p>

            <div className="flex gap-3">
              {!item.approved && (
                <button
                  onClick={() => approve(item)}
                  className="flex-1 border border-white/30 py-2 text-[14px] uppercase"
                >
                  Approve
                </button>
              )}
              <button
                onClick={() => toggleCheckin(item)}
                className="flex-1 border border-white/40 py-2 text-[14px] uppercase"
              >
                {item.checkedIn ? "Undo" : "Check-in"}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
