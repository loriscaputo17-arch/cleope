'use client'

import { useEffect, useState, useRef } from "react"
import { supabase } from "../../../../lib/supabase"
import { db } from "../../../../lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import {
  AdminUser,
  COLORS,
  FONTS,
  Card,
  Label,
  Select,
  Input,
  PageHeader,
  Table,
  TR,
  TD,
  Empty
} from "./ui"

export default function CheckIn({ user }: { user: AdminUser }) {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState("")
  const [attendees, setAttendees] = useState<any[]>([])
  const [checkins, setCheckins] = useState<Record<string, any>>({})
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [lastScanned, setLastScanned] = useState<any>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  /* ================= EVENTS ================= */
  useEffect(() => {
    getDocs(collection(db, "events")).then(snap => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() as any }))
        .filter(ev => ev.title && ev.date && Number.isFinite(new Date(ev.date).getTime()))
        .sort((a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )

      setEvents(list)
    })
  }, [])

  /* ================= LOAD LIST + CHECKINS ================= */
  useEffect(() => {
    if (!selectedEvent) {
      setAttendees([])
      setCheckins({})
      return
    }

    setLoading(true)

    const load = async () => {
      try {
        // 🔹 carica lista
        const { data: listData, error: listErr } = await supabase
          .from("Lists")
          .select("*")
          .eq("event_id", selectedEvent)

        if (listErr) throw listErr

        // 🔹 carica checkins
        const { data: checkData, error: checkErr } = await supabase
          .from("checkins")
          .select("*")
          .eq("event_id", selectedEvent)

        if (checkErr) throw checkErr

        // 🔥 mappa checkins per lookup veloce
        const checkMap: Record<string, any> = {}
        ;(checkData || []).forEach(c => {
          checkMap[c.user_id] = c
        })

        // 🔹 normalizza attendees
        const normalized = (listData || [])
          .filter(r => r.approved) // solo approved entrano
          .map(r => ({
            id: r.id,
            firstName: r.full_name?.split(" ")[0] || "",
            lastName: r.full_name?.split(" ").slice(1).join(" ") || "",
            phone: r.phone_number,
            pr: r.pr,
            checkedIn: !!checkMap[r.id],
            checkedInAt: checkMap[r.id]?.created_at
          }))
          .sort((a, b) =>
            `${a.firstName}${a.lastName}`.localeCompare(
              `${b.firstName}${b.lastName}`
            )
          )

        setAttendees(normalized)
        setCheckins(checkMap)
      } catch (err) {
        console.error(err)
        setAttendees([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [selectedEvent])

  /* ================= TOGGLE CHECKIN ================= */
  const toggle = async (userId: string, current: boolean) => {
    try {
      if (!current) {
        // ✅ INSERT checkin
        const { error } = await supabase.from("checkins").insert({
          event_id: selectedEvent,
          user_id: userId,
          checked_in: true
        })

        if (error) throw error

      } else {
        // ❌ DELETE checkin (undo)
        const { error } = await supabase
          .from("checkins")
          .delete()
          .eq("event_id", selectedEvent)
          .eq("user_id", userId)

        if (error) throw error
      }

      // 🔄 refresh veloce locale
      setAttendees(prev =>
        prev.map(a =>
          a.id === userId
            ? {
                ...a,
                checkedIn: !current,
                checkedInAt: !current ? new Date().toISOString() : null
              }
            : a
        )
      )

      const found = attendees.find(a => a.id === userId)
      if (!current && found) {
        setLastScanned({ ...found, checkedIn: true })
        setTimeout(() => setLastScanned(null), 3000)
      }
    } catch (err) {
      console.error(err)
      alert("Check-in failed")
    }
  }

  /* ================= FILTER ================= */
  const filtered = search.trim()
    ? attendees.filter(a =>
        `${a.firstName} ${a.lastName} ${a.phone || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : attendees

  const checkedCount = attendees.filter(a => a.checkedIn).length

  /* ================= UI ================= */
  return (
    <div>
      <PageHeader
        title="Check-in"
        sub={
          selectedEvent
            ? `${checkedCount} / ${attendees.length} checked in`
            : "Select an event to start"
        }
      />

      {/* Event selector */}
      <Card style={{ marginBottom: 16 }}>
        <Label>Event</Label>
        <Select
          value={selectedEvent}
          onChange={e => {
            setSelectedEvent(e.target.value)
            setSearch("")
          }}
          style={{ maxWidth: 400 }}
        >
          <option value="">— Choose an event —</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.title} ·{" "}
              {new Date(ev.date).toLocaleDateString("it-IT")}
            </option>
          ))}
        </Select>
      </Card>

      {selectedEvent && (
        <>
          {/* Progress */}
          <Card style={{ marginBottom: 16, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Label style={{ marginBottom: 0 }}>Present</Label>
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 20,
                  fontWeight: 800,
                  color: COLORS.green
                }}
              >
                {checkedCount} / {attendees.length}
              </span>
            </div>

            <div style={{ height: 4, background: COLORS.muted }}>
              <div
                style={{
                  height: "100%",
                  background: COLORS.green,
                  width: attendees.length
                    ? `${(checkedCount / attendees.length) * 100}%`
                    : "0%"
                }}
              />
            </div>
          </Card>

          {/* Search */}
          <Card style={{ marginBottom: 16, padding: "12px 20px" }}>
            <Input
              ref={searchRef}
              placeholder="Search by name or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </Card>

          {/* Table */}
          <Card style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: 32, textAlign: "center" }}>
                Loading...
              </div>
            ) : filtered.length === 0 ? (
              <Empty message="No attendees found" />
            ) : (
              <Table headers={["Name", "Phone", "PR", "Time", "Status"]}>
                {filtered.map(a => (
                  <TR key={a.id} highlight={a.checkedIn ? "green" : undefined}>
                    <TD>
                      <p style={{ fontWeight: 500 }}>
                        {a.firstName} {a.lastName}
                      </p>
                    </TD>

                    <TD style={{ color: COLORS.mid, fontSize: 12 }}>
                      {a.phone || "—"}
                    </TD>

                    <TD style={{ fontSize: 11, color: COLORS.dim }}>
                      {a.pr || "—"}
                    </TD>

                    <TD style={{ fontSize: 11, color: COLORS.dim }}>
                      {a.checkedIn && a.checkedInAt
                        ? new Date(a.checkedInAt).toLocaleTimeString("it-IT", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        : "—"}
                    </TD>

                    <TD>
                      <button
                        onClick={() => toggle(a.id, a.checkedIn)}
                        style={{
                          fontFamily: FONTS.body,
                          fontSize: 10,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          padding: "7px 16px",
                          cursor: "pointer",
                          background: a.checkedIn
                            ? "rgba(74,222,128,0.12)"
                            : "rgba(240,239,235,0.06)",
                          color: a.checkedIn
                            ? COLORS.green
                            : COLORS.mid,
                          border: `1px solid ${
                            a.checkedIn
                              ? "rgba(74,222,128,0.25)"
                              : COLORS.muted
                          }`
                        }}
                      >
                        {a.checkedIn ? "✓ In" : "Check in"}
                      </button>
                    </TD>
                  </TR>
                ))}
              </Table>
            )}
          </Card>
        </>
      )}
    </div>
  )
}