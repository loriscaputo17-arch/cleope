'use client'

import { useEffect, useState } from "react"
import { db } from "../../../../lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { AdminUser, COLORS, FONTS, Card, Label, PageHeader, Badge } from "./ui"

interface Stats {
  totalEvents: number
  upcomingEvents: number
  totalContacts: number
  totalAttendees: number
  checkedIn: number
}

export default function Dashboard({ user }: { user: AdminUser }) {
  const [stats, setStats] = useState<Stats>({ totalEvents: 0, upcomingEvents: 0, totalContacts: 0, totalAttendees: 0, checkedIn: 0 })
  const [recentEvents, setRecentEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const evSnap = await getDocs(collection(db, "events"))
        const events = evSnap.docs.map(d => ({ id: d.id, ...d.data() as any }))
        const now = new Date()
        const upcoming = events.filter(e => new Date(e.date) >= now)

        let totalAtt = 0, checkedIn = 0
        for (const ev of events) {
          try {
            const attSnap = await getDocs(collection(db, "events", ev.id, "attendees"))
            totalAtt += attSnap.size
            checkedIn += attSnap.docs.filter(d => d.data().checkedIn).length
          } catch {}
        }

        let contacts = 0
        try {
          const cSnap = await getDocs(collection(db, "contacts"))
          contacts = cSnap.size
        } catch {}

        setStats({ totalEvents: events.length, upcomingEvents: upcoming.length, totalContacts: contacts, totalAttendees: totalAtt, checkedIn })
        setRecentEvents(events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statCards = [
    { label: "Total Events",    value: stats.totalEvents,    note: `${stats.upcomingEvents} upcoming` },
    { label: "Total RSVPs",     value: stats.totalAttendees, note: "across all events" },
    { label: "Checked In",      value: stats.checkedIn,      note: stats.totalAttendees ? `${Math.round(stats.checkedIn / stats.totalAttendees * 100)}% rate` : "—" },
    { label: "Contacts",        value: stats.totalContacts,  note: "in CRM" },
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        sub={`Welcome back, ${user.name}`}
      />

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 3, marginBottom: 32 }}>
        {statCards.map(s => (
          <Card key={s.label} style={{ padding: "20px 24px" }}>
            <Label>{s.label}</Label>
            <p style={{ fontFamily: FONTS.display, fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em", color: COLORS.fg, lineHeight: 1, marginBottom: 4 }}>
              {loading ? "—" : s.value}
            </p>
            <p style={{ fontSize: 11, color: COLORS.dim }}>{s.note}</p>
          </Card>
        ))}
      </div>

      {/* Recent events */}
      <Card>
        <Label style={{ marginBottom: 16 }}>Recent Events</Label>
        {recentEvents.length === 0 && !loading ? (
          <p style={{ fontSize: 13, color: COLORS.dim }}>No events yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {recentEvents.map((ev, i) => {
              const past = new Date(ev.date) < new Date()
              return (
                <div key={ev.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 0",
                  borderBottom: i < recentEvents.length - 1 ? `1px solid ${COLORS.border}` : "none",
                }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: COLORS.fg, marginBottom: 2 }}>{ev.title}</p>
                    <p style={{ fontSize: 11, color: COLORS.dim }}>
                      {new Date(ev.date).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}
                      {ev.time ? ` · ${ev.time}` : ""}
                    </p>
                  </div>
                  <Badge variant={past ? "default" : "green"}>{past ? "Past" : "Upcoming"}</Badge>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}