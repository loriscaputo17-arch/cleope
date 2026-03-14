'use client'

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"

export default function BreakoutList() {
  const [attendees, setAttendees] = useState<any[]>([])
  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // Carica lista
        const { data, error } = await supabase
          .from("Lists")
          .select("*")
          .eq("event_id", "breakout2")
          .order("created_at", { ascending: false })

        if (error) throw error

        setAttendees(
          (data || []).map((r) => ({
            id: r.id,
            firstName: r.full_name?.split(" ")[0] || "",
            lastName: r.full_name?.split(" ").slice(1).join(" ") || "",
            email: r.email,
            phone: r.phone_number,
            pr: r.pr,
            approved: r.approved,
          }))
        )

        // Carica checkins già esistenti per questo evento
        const { data: checkins } = await supabase
          .from("checkins")
          .select("user_id")
          .eq("event_id", "breakout2")

        if (checkins) {
          setCheckedInIds(new Set(checkins.map((c: any) => c.user_id)))
        }
      } catch (err) {
        console.error(err)
        setAttendees([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleCheckin = async (id: string) => {
    if (checkedInIds.has(id)) {
      alert("⚠️ Already checked in!")
      return
    }

    const { error } = await supabase.from("checkins").insert({
      event_id: "breakout2",
      user_id: id,
      checked_in: true,
    })

    if (error) {
      console.error(error)
      alert("Check-in failed")
      return
    }

    setCheckedInIds(prev => new Set([...prev, id]))
    alert("✅ Checked in!")
  }

  const handleSendInvite = async (a: any) => {
    if (!a.email) return alert("No email for this contact")

    try {
      const res = await fetch("/api/breakout_send_invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: a.email,
          name: `${a.firstName} ${a.lastName}`,
          code: a.id,
        }),
      })

      if (!res.ok) throw new Error("Failed")
      alert(`📩 Invite sent to ${a.email}`)
    } catch (err) {
      console.error(err)
      alert("Failed to send invite")
    }
  }

  const filtered = search
    ? attendees.filter(a =>
        `${a.firstName} ${a.lastName} ${a.email} ${a.phone}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : attendees

  const counts = {
    total: attendees.length,
    approved: attendees.filter(a => a.approved).length,
    pending: attendees.filter(a => !a.approved).length,
  }

  return (
    <div className="mx-12 mt-[10rem] mb-[10rem]">
      {/* Stats */}
      <div className="flex gap-4 mb-6 text-center">
        {[
          { label: "Total", value: counts.total },
          { label: "Approved", value: counts.approved },
          { label: "Pending", value: counts.pending },
        ].map(s => (
          <div key={s.label} className="flex-1 bg-white/10 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{s.label}</p>
            <p className="text-3xl font-black">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search name, email, phone..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder-white/40 mb-6 focus:outline-none"
      />

      {/* Table */}
      {loading ? (
        <p className="text-center text-white/50 text-sm py-8">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-white/50 text-sm py-8">No attendees found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest opacity-50 border-b border-white/10">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Phone</th>
              <th className="pb-3 pr-4">PR</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => {
              const isCheckedIn = checkedInIds.has(a.id)
              return (
                <tr key={a.id} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="py-3 pr-4 font-medium">
                    {a.firstName} {a.lastName}
                  </td>
                  <td className="py-3 pr-4 opacity-70">
                    {a.email
                      ? <a href={`mailto:${a.email}`} className="underline underline-offset-2">{a.email}</a>
                      : "—"
                    }
                  </td>
                  <td className="py-3 pr-4 opacity-70">
                    {a.phone
                      ? <a href={`https://wa.me/${String(a.phone).replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{a.phone}</a>
                      : "—"
                    }
                  </td>
                  <td className="py-3 pr-4 opacity-60 text-xs">{a.pr || "—"}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-semibold ${a.approved ? "bg-green-500/20 text-green-300" : "bg-amber-500/20 text-amber-300"}`}>
                      {a.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleCheckin(a.id)}
                        className={`text-[14px] uppercase tracking-wider px-3 py-1.5 rounded-full font-semibold transition ${
                          isCheckedIn
                            ? "bg-green-500/30 text-green-300 cursor-default"
                            : "bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        }`}
                      >
                        {isCheckedIn ? "✓ Checked In" : "Check-in"}
                      </button>
                      <button
                        onClick={() => handleSendInvite(a)}
                        className="text-[14px] uppercase tracking-wider px-3 py-1.5 rounded-full font-semibold bg-[#dd0005]/30 hover:bg-[#dd0005]/60 text-white transition cursor-pointer"
                      >
                        Invite
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}