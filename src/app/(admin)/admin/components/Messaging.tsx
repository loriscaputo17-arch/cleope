'use client'

import { useEffect, useState } from "react"
import { db } from "../../../../lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { AdminUser, COLORS, FONTS, Card, Label, Select, Input, Textarea, Btn, Badge, PageHeader } from "./ui"

type Channel = "whatsapp" | "sms" | "email"

const CHANNEL_CONFIG = {
  whatsapp: { label: "WhatsApp", color: "#25D366", icon: "◎" },
  sms:      { label: "SMS",      color: "#93c5fd", icon: "◷" },
  email:    { label: "Email",    color: COLORS.fg,  icon: "◈" },
}

// ─── Template variables you can use in messages ───────────────────────────────
const VARIABLES = ["{{firstName}}", "{{lastName}}", "{{eventTitle}}", "{{eventDate}}"]

// ─── Hooks for recipients ─────────────────────────────────────────────────────
function useRecipients(source: "event" | "contacts", eventId: string, statusFilter: string, prFilter: string) {
  const [recipients, setRecipients] = useState<any[]>([])

  useEffect(() => {
    if (source === "event" && !eventId) { setRecipients([]); return }
    const load = async () => {
      let list: any[] = []
      if (source === "event") {
        const snap = await getDocs(collection(db, "events", eventId, "attendees"))
        list = snap.docs.map(d => ({ id: d.id, ...d.data() as any }))
        if (statusFilter !== "all") list = list.filter(a => (a.status || "pending") === statusFilter)
        if (prFilter) list = list.filter(a => a.pr === prFilter)
      } else {
        const snap = await getDocs(collection(db, "contacts"))
        list = snap.docs.map(d => ({ id: d.id, ...d.data() as any }))
      }
      setRecipients(list)
    }
    load()
  }, [source, eventId, statusFilter, prFilter])

  return recipients
}

export default function Messaging({ user }: { user: AdminUser }) {
  const [events, setEvents] = useState<any[]>([])
  const [channel, setChannel] = useState<Channel>("whatsapp")
  const [source, setSource] = useState<"event" | "contacts">("event")
  const [eventId, setEventId] = useState("")
  const [eventMeta, setEventMeta] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [prFilter, setPrFilter] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sentCount, setSentCount] = useState(0)
  const [log, setLog] = useState<string[]>([])

  const recipients = useRecipients(source, eventId, statusFilter, prFilter)
  const allPRs = Array.from(new Set(recipients.map(r => r.pr).filter(Boolean)))

  useEffect(() => {
    getDocs(collection(db, "events"))
      .then(snap => setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() as any })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())))
  }, [])

  useEffect(() => {
    if (eventId) {
      const ev = events.find(e => e.id === eventId)
      setEventMeta(ev || null)
    }
  }, [eventId, events])

  const interpolate = (text: string, person: any) =>
    text
      .replace(/{{firstName}}/g, person.firstName || "")
      .replace(/{{lastName}}/g, person.lastName || "")
      .replace(/{{eventTitle}}/g, eventMeta?.title || "")
      .replace(/{{eventDate}}/g, eventMeta ? new Date(eventMeta.date).toLocaleDateString("it-IT") : "")

  const handleSend = async () => {
    if (!message.trim()) return alert("Write a message first.")
    if (!recipients.length) return alert("No recipients selected.")
    if (!confirm(`Send to ${recipients.length} recipient(s) via ${CHANNEL_CONFIG[channel].label}?`)) return

    setSending(true)
    setSentCount(0)
    setLog([])
    const newLog: string[] = []

    for (const person of recipients) {
      const text = interpolate(message, person)

      if (channel === "whatsapp") {
        // Opens WhatsApp for each contact — best approach without Business API key
        const phone = (person.phone || "").replace(/\D/g, "")
        if (!phone) { newLog.push(`⚠ ${person.firstName} — no phone`); continue }
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank")
        newLog.push(`✓ ${person.firstName} ${person.lastName} — WhatsApp opened`)
      } else if (channel === "sms") {
        // Twilio via your own API route (create /api/send-sms)
        try {
          await fetch("/api/send-sms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: person.phone, body: text }),
          })
          newLog.push(`✓ ${person.firstName} ${person.lastName} — SMS sent`)
        } catch {
          newLog.push(`✗ ${person.firstName} ${person.lastName} — SMS failed`)
        }
      } else if (channel === "email") {
        // Brevo via your own API route (create /api/send-email)
        try {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: person.email, subject, html: text.replace(/\n/g, "<br>") }),
          })
          newLog.push(`✓ ${person.firstName} ${person.lastName} — Email sent`)
        } catch {
          newLog.push(`✗ ${person.firstName} ${person.lastName} — Email failed`)
        }
      }

      setSentCount(c => c + 1)
      setLog([...newLog])
      await new Promise(r => setTimeout(r, 150)) // small delay to avoid rate limits
    }

    setSending(false)
  }

  return (
    <div>
      <PageHeader title="Messaging" sub="Send messages to your lists via WhatsApp, SMS or Email" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Left — Config */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Channel selector */}
          <Card>
            <Label>Channel</Label>
            <div style={{ display: "flex", gap: 6 }}>
              {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(c => (
                <button
                  key={c}
                  onClick={() => setChannel(c)}
                  style={{
                    flex: 1, fontFamily: FONTS.body, fontSize: 10, fontWeight: 500,
                    letterSpacing: "0.15em", textTransform: "uppercase",
                    padding: "10px 0", cursor: "pointer",
                    background: channel === c ? "rgba(240,239,235,0.08)" : "transparent",
                    color: channel === c ? COLORS.fg : COLORS.dim,
                    border: `1px solid ${channel === c ? COLORS.muted : COLORS.border}`,
                    transition: "all 0.15s",
                  }}
                >
                  {CHANNEL_CONFIG[c].icon} {CHANNEL_CONFIG[c].label}
                </button>
              ))}
            </div>
          </Card>

          {/* Recipients source */}
          <Card>
            <Label>Send to</Label>
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {(["event", "contacts"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  style={{
                    flex: 1, fontFamily: FONTS.body, fontSize: 10, fontWeight: 500,
                    letterSpacing: "0.15em", textTransform: "uppercase",
                    padding: "10px 0", cursor: "pointer",
                    background: source === s ? "rgba(240,239,235,0.08)" : "transparent",
                    color: source === s ? COLORS.fg : COLORS.dim,
                    border: `1px solid ${source === s ? COLORS.muted : COLORS.border}`,
                  }}
                >
                  {s === "event" ? "Event List" : "All Contacts"}
                </button>
              ))}
            </div>

            {source === "event" && (
              <>
                <Label>Event</Label>
                <Select value={eventId} onChange={e => setEventId(e.target.value)} style={{ marginBottom: 12 }}>
                  <option value="">— Select event —</option>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title} · {new Date(ev.date).toLocaleDateString("it-IT")}</option>)}
                </Select>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <div>
                    <Label>Status</Label>
                    <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ marginBottom: 12 }}>
                      <option value="all">All</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                    </Select>
                  </div>
                  <div>
                    <Label>PR</Label>
                    <Select value={prFilter} onChange={e => setPrFilter(e.target.value)}>
                      <option value="">All PR</option>
                      {allPRs.map(p => <option key={p} value={p}>{p}</option>)}
                    </Select>
                  </div>
                </div>
              </>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, padding: "10px 0", borderTop: `1px solid ${COLORS.border}` }}>
              <span style={{ fontSize: 11, color: COLORS.dim }}>Recipients:</span>
              <span style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 800, color: COLORS.fg }}>{recipients.length}</span>
            </div>
          </Card>

          {/* Preview */}
          <Card>
            <Label>Preview (first recipient)</Label>
            {recipients[0] && message ? (
              <div style={{ fontSize: 13, color: COLORS.mid, lineHeight: 1.7, fontWeight: 300, whiteSpace: "pre-wrap" }}>
                {interpolate(message, recipients[0])}
              </div>
            ) : (
              <p style={{ fontSize: 12, color: COLORS.dim }}>Write a message to preview</p>
            )}
          </Card>
        </div>

        {/* Right — Compose */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <Card style={{ flex: 1 }}>
            <Label>Compose</Label>

            {channel === "email" && (
              <div style={{ marginBottom: 16 }}>
                <Label>Subject</Label>
                <Input placeholder="Email subject" value={subject} onChange={e => setSubject(e.target.value)} />
              </div>
            )}

            <Label>Message</Label>
            <Textarea
              placeholder={`Write your message...\n\nUse variables like {{firstName}}, {{eventTitle}}`}
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={10}
              style={{ borderBottom: `1px solid ${COLORS.muted}`, padding: "10px 0" }}
            />

            {/* Variables */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
              {VARIABLES.map(v => (
                <button
                  key={v}
                  onClick={() => setMessage(m => m + v)}
                  style={{
                    fontFamily: FONTS.body, fontSize: 9, letterSpacing: "0.12em",
                    padding: "4px 10px", cursor: "pointer",
                    background: "transparent", color: COLORS.dim,
                    border: `1px solid ${COLORS.border}`, transition: "color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = COLORS.fg}
                  onMouseLeave={e => e.currentTarget.style.color = COLORS.dim}
                >
                  {v}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <Btn
                onClick={handleSend}
                style={{ opacity: sending || !message || !recipients.length ? 0.5 : 1, pointerEvents: sending || !message || !recipients.length ? "none" : "auto" }}
              >
                {sending ? `Sending ${sentCount}/${recipients.length}...` : `Send to ${recipients.length} →`}
              </Btn>
            </div>
          </Card>

          {/* Send log */}
          {log.length > 0 && (
            <Card style={{ maxHeight: 200, overflowY: "auto" }}>
              <Label>Send Log</Label>
              {log.map((l, i) => (
                <p key={i} style={{ fontSize: 11, color: l.startsWith("✓") ? COLORS.green : l.startsWith("⚠") ? COLORS.amber : COLORS.red, lineHeight: 1.8 }}>
                  {l}
                </p>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}