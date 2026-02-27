'use client'

import { useEffect, useState, useRef } from "react"
import { db } from "../../../../lib/firebase"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { AdminUser, COLORS, FONTS, Card, Label, Select, Btn, Badge, PageHeader, Empty } from "./ui"

// We use the qrcode.react library for generation
// Install: npm install qrcode.react
// For scanning we use the jsQR library via webcam
// Install: npm install jsqr

let QRCode: any = null
let jsQR: any = null

// ─── QR token = eventId:attendeeId ───────────────────────────────────────────
const makeToken = (eventId: string, attendeeId: string) => `cleope:${eventId}:${attendeeId}`
const parseToken = (raw: string): { eventId: string; attendeeId: string } | null => {
  const parts = raw.split(":")
  if (parts.length !== 3 || parts[0] !== "cleope") return null
  return { eventId: parts[1], attendeeId: parts[2] }
}

export default function QRCheckIn({ user }: { user: AdminUser }) {
  const [tab, setTab] = useState<"scan" | "generate">("scan")
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState("")
  const [attendees, setAttendees] = useState<any[]>([])
  const [libs, setLibs] = useState(false)

  // Load events
  useEffect(() => {
    getDocs(collection(db, "events"))
      .then(snap => setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() as any }))
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())))
  }, [])

  // Load attendees when event selected
  useEffect(() => {
    if (!selectedEvent) { setAttendees([]); return }
    getDocs(collection(db, "events", selectedEvent, "attendees"))
      .then(snap => setAttendees(snap.docs.map(d => ({ id: d.id, ...d.data() as any }))
        .filter(a => a.status === "approved" || !a.status)))
  }, [selectedEvent])

  // Lazy-load QR libs client-side
  useEffect(() => {
    Promise.all([
      import("qrcode.react").then(m => { QRCode = m.QRCodeSVG }),
      import("jsqr").then(m => { jsQR = m.default }),
    ]).then(() => setLibs(true)).catch(() => setLibs(false))
  }, [])

  const handleCheckIn = async (eventId: string, attendeeId: string): Promise<{ ok: boolean; name: string }> => {
    const attendee = attendees.find(a => a.id === attendeeId)
    if (!attendee) return { ok: false, name: "Unknown" }
    if (attendee.checkedIn) return { ok: false, name: `${attendee.firstName} already checked in` }
    await updateDoc(doc(db, "events", eventId, "attendees", attendeeId), {
      checkedIn: true, checkedInAt: new Date().toISOString()
    })
    setAttendees(prev => prev.map(a => a.id === attendeeId ? { ...a, checkedIn: true } : a))
    return { ok: true, name: `${attendee.firstName} ${attendee.lastName}` }
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: FONTS.body, fontSize: 10, fontWeight: 500,
    letterSpacing: "0.18em", textTransform: "uppercase",
    padding: "10px 24px", cursor: "pointer",
    background: active ? COLORS.fg : "transparent",
    color: active ? COLORS.bg : COLORS.dim,
    border: `1px solid ${active ? COLORS.fg : COLORS.border}`,
    transition: "all 0.15s",
  })

  return (
    <div>
      <PageHeader title="QR Check-in" sub="Scan QR codes or generate passes for attendees" />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        <button style={tabStyle(tab === "scan")} onClick={() => setTab("scan")}>◎ Scanner</button>
        <button style={tabStyle(tab === "generate")} onClick={() => setTab("generate")}>⊞ Generate QR</button>
      </div>

      {/* Event selector (shared) */}
      <Card style={{ marginBottom: 16 }}>
        <Label>Event</Label>
        <Select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} style={{ maxWidth: 400 }}>
          <option value="">— Select event —</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.title} · {new Date(ev.date).toLocaleDateString("it-IT")}
            </option>
          ))}
        </Select>
      </Card>

      {tab === "scan" && (
        <Scanner eventId={selectedEvent} attendees={attendees} onCheckIn={handleCheckIn} libs={libs} />
      )}
      {tab === "generate" && (
        <Generator eventId={selectedEvent} attendees={attendees} libs={libs} />
      )}
    </div>
  )
}

// ─── SCANNER ──────────────────────────────────────────────────────────────────
function Scanner({ eventId, attendees, onCheckIn, libs }: {
  eventId: string
  attendees: any[]
  onCheckIn: (eId: string, aId: string) => Promise<{ ok: boolean; name: string }>
  libs: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; name: string } | null>(null)
  const [manualInput, setManualInput] = useState("")
  const rafRef = useRef<number>(null)
  const streamRef = useRef<MediaStream>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setScanning(true)
        tick()
      }
    } catch {
      alert("Camera access denied or not available.")
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setScanning(false)
  }

  const tick = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !jsQR) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)
    if (code?.data) {
      handleScan(code.data)
      return
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const handleScan = async (raw: string) => {
    stopCamera()
    const parsed = parseToken(raw)
    if (!parsed) { setResult({ ok: false, name: "Invalid QR code" }); return }
    if (eventId && parsed.eventId !== eventId) { setResult({ ok: false, name: "QR from a different event" }); return }
    const res = await onCheckIn(parsed.eventId, parsed.attendeeId)
    setResult(res)
  }

  const handleManual = async () => {
    if (!manualInput.trim() || !eventId) return
    const found = attendees.find(a =>
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(manualInput.toLowerCase()) ||
      a.phone?.includes(manualInput)
    )
    if (!found) { setResult({ ok: false, name: `"${manualInput}" not found` }); return }
    const res = await onCheckIn(eventId, found.id)
    setResult(res)
    setManualInput("")
  }

  useEffect(() => () => stopCamera(), [])

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card>
        <Label>Camera Scanner</Label>

        <div style={{ position: "relative", background: "#000", aspectRatio: "4/3", overflow: "hidden", marginBottom: 16 }}>
          <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover" }} playsInline muted />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          {!scanning && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.surface }}>
              <p style={{ fontSize: 12, color: COLORS.dim }}>Camera off</p>
            </div>
          )}
          {scanning && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ width: 160, height: 160, border: `2px solid rgba(240,239,235,0.6)`, boxShadow: "0 0 0 2000px rgba(0,0,0,0.4)" }} />
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {!scanning ? (
            <Btn onClick={startCamera} style={{ opacity: !libs ? 0.4 : 1 }}>
              {!libs ? "Loading libs..." : "▶ Start Camera"}
            </Btn>
          ) : (
            <Btn variant="danger" onClick={stopCamera}>◼ Stop</Btn>
          )}
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Result feedback */}
        {result && (
          <div style={{
            padding: "20px 24px",
            background: result.ok ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
            border: `1px solid ${result.ok ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
          }}>
            <p style={{ fontSize: 22, marginBottom: 4 }}>{result.ok ? "✓" : "✕"}</p>
            <p style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 800, color: result.ok ? COLORS.green : COLORS.red, letterSpacing: "-0.01em" }}>
              {result.name}
            </p>
            <p style={{ fontSize: 11, color: COLORS.dim, marginTop: 4 }}>
              {result.ok ? "Checked in successfully" : "Check-in failed"}
            </p>
            <button onClick={() => { setResult(null); if (scanning) { rafRef.current = requestAnimationFrame(tick) } else startCamera() }}
              style={{ marginTop: 12, fontFamily: FONTS.body, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.dim, padding: "7px 16px", cursor: "pointer" }}>
              Scan Next →
            </button>
          </div>
        )}

        {/* Manual check-in */}
        <Card>
          <Label>Manual Search</Label>
          <p style={{ fontSize: 12, color: COLORS.dim, marginBottom: 12 }}>Search by name or phone number</p>
          <div style={{ display: "flex", gap: 0 }}>
            <input
              value={manualInput}
              onChange={e => setManualInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleManual()}
              placeholder="Name or phone..."
              style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 300, flex: 1, background: "transparent", border: "none", borderBottom: `1px solid ${COLORS.muted}`, color: COLORS.fg, padding: "10px 0", outline: "none" }}
            />
            <Btn onClick={handleManual} style={{ marginLeft: 12 }}>→</Btn>
          </div>
        </Card>

        {/* Stats */}
        <Card>
          <Label>Status</Label>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { label: "Checked in", value: attendees.filter(a => a.checkedIn).length, color: COLORS.green },
              { label: "Pending", value: attendees.filter(a => !a.checkedIn).length, color: COLORS.dim },
              { label: "Total", value: attendees.length, color: COLORS.fg },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.dim, marginTop: 4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── GENERATOR ───────────────────────────────────────────────────────────────
function Generator({ eventId, attendees, libs }: { eventId: string; attendees: any[]; libs: boolean }) {
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [printMode, setPrintMode] = useState(false)

  const filtered = search
    ? attendees.filter(a => `${a.firstName} ${a.lastName}`.toLowerCase().includes(search.toLowerCase()))
    : attendees

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const selectAll = () => setSelected(filtered.map(a => a.id))
  const clearAll = () => setSelected([])

  const selectedAttendees = attendees.filter(a => selected.includes(a.id))

  if (printMode) {
    return (
      <div>
        <button
          onClick={() => setPrintMode(false)}
          style={{ fontFamily: FONTS.body, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", background: "none", border: `1px solid ${COLORS.border}`, color: COLORS.dim, padding: "8px 16px", cursor: "pointer", marginBottom: 20 }}
        >
          ← Back
        </button>
        <button
          onClick={() => window.print()}
          style={{ fontFamily: FONTS.body, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", background: COLORS.fg, border: "none", color: COLORS.bg, padding: "8px 20px", cursor: "pointer", marginBottom: 20, marginLeft: 8 }}
        >
          Print / Save PDF
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }} className="print-qr-grid">
          {selectedAttendees.map(a => {
            const token = makeToken(eventId, a.id)
            return (
              <div key={a.id} style={{ background: "#fff", color: "#000", padding: 16, textAlign: "center", border: "1px solid #e5e5e5" }}>
                {libs && QRCode && (
                  <QRCode value={token} size={140} style={{ margin: "0 auto 12px" }} />
                )}
                <p style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 2 }}>
                  {a.firstName} {a.lastName}
                </p>
                <p style={{ fontSize: 10, color: "#666", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {a.pr ? `PR: ${a.pr}` : "Guest"}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      {!libs && (
        <div style={{ background: "rgba(251,191,36,0.08)", border: `1px solid rgba(251,191,36,0.2)`, padding: "12px 16px", marginBottom: 16, fontSize: 12, color: COLORS.amber }}>
          ⚠ Run <code>npm install qrcode.react jsqr</code> to enable QR features.
        </div>
      )}

      {!eventId ? (
        <Card><Empty message="Select an event to generate QR codes" /></Card>
      ) : (
        <>
          <Card style={{ marginBottom: 16, padding: "12px 20px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search attendees..."
                style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 300, flex: 1, maxWidth: 240, background: "transparent", border: "none", borderBottom: `1px solid ${COLORS.muted}`, color: COLORS.fg, padding: "8px 0", outline: "none" }}
              />
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <Btn variant="ghost" style={{ fontSize: 9 }} onClick={selectAll}>Select All</Btn>
                <Btn variant="ghost" style={{ fontSize: 9 }} onClick={clearAll}>Clear</Btn>
                {selected.length > 0 && (
                  <Btn style={{ fontSize: 9 }} onClick={() => setPrintMode(true)}>
                    ⊞ Generate {selected.length} QR{selected.length > 1 ? "s" : ""}
                  </Btn>
                )}
              </div>
            </div>
          </Card>

          <Card style={{ padding: 0 }}>
            {filtered.length === 0 ? <Empty message="No attendees" /> : (
              <div>
                {filtered.map((a, i) => (
                  <div
                    key={a.id}
                    onClick={() => toggleSelect(a.id)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 20px",
                      borderBottom: i < filtered.length - 1 ? `1px solid ${COLORS.border}` : "none",
                      cursor: "pointer",
                      background: selected.includes(a.id) ? "rgba(240,239,235,0.04)" : "transparent",
                      transition: "background 0.1s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 18, height: 18, flexShrink: 0,
                        border: `1px solid ${selected.includes(a.id) ? COLORS.fg : COLORS.muted}`,
                        background: selected.includes(a.id) ? COLORS.fg : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, color: COLORS.bg,
                      }}>
                        {selected.includes(a.id) ? "✓" : ""}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: COLORS.fg }}>{a.firstName} {a.lastName}</p>
                        <p style={{ fontSize: 11, color: COLORS.dim }}>{a.pr ? `PR: ${a.pr}` : "No PR"}</p>
                      </div>
                    </div>
                    <Badge variant={a.checkedIn ? "green" : "default"}>
                      {a.checkedIn ? "Checked in" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      <style>{`
        @media print {
          body > *:not(.print-qr-grid) { display: none; }
          .print-qr-grid { display: grid !important; }
        }
      `}</style>
    </div>
  )
}