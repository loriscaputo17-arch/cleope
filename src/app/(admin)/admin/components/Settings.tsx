'use client'

import { useState } from "react"
import { AdminUser, COLORS, FONTS, Card, Label, Input, Btn, Badge, PageHeader } from "./ui"

export default function Settings({ user }: { user: AdminUser }) {
  const [brevoKey, setBrevoKey] = useState("")
  const [twilioSid, setTwilioSid] = useState("")
  const [twilioToken, setTwilioToken] = useState("")
  const [twilioFrom, setTwilioFrom] = useState("")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // In production: save to Firestore settings doc or .env
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <PageHeader title="Settings" sub="API keys and integrations" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 800 }}>

        {/* Brevo */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Label style={{ marginBottom: 0 }}>Brevo (Email + SMS)</Label>
            <Badge variant="blue">Email</Badge>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Label>API Key</Label>
            <Input type="password" placeholder="xkeysib-..." value={brevoKey} onChange={e => setBrevoKey(e.target.value)} />
          </div>
          <p style={{ fontSize: 11, color: COLORS.dim, lineHeight: 1.6 }}>
            Used for sending email campaigns via <code style={{ color: COLORS.mid }}>/api/send-email</code>
          </p>
        </Card>

        {/* Twilio */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Label style={{ marginBottom: 0 }}>Twilio (SMS)</Label>
            <Badge variant="amber">SMS</Badge>
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label>Account SID</Label>
            <Input type="password" placeholder="ACxxxxxxxx" value={twilioSid} onChange={e => setTwilioSid(e.target.value)} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label>Auth Token</Label>
            <Input type="password" placeholder="Token" value={twilioToken} onChange={e => setTwilioToken(e.target.value)} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label>From Number</Label>
            <Input placeholder="+39..." value={twilioFrom} onChange={e => setTwilioFrom(e.target.value)} />
          </div>
        </Card>

        {/* API Routes info */}
        <Card style={{ gridColumn: "1 / -1" }}>
          <Label style={{ marginBottom: 16 }}>Required API Routes</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { path: "/api/send-email", desc: "POST: { to, subject, html } — Uses Brevo API" },
              { path: "/api/send-sms",   desc: "POST: { to, body } — Uses Twilio API" },
            ].map(r => (
              <div key={r.path} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <code style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.mid, background: "rgba(240,239,235,0.05)", padding: "4px 10px", minWidth: 180 }}>
                  {r.path}
                </code>
                <span style={{ fontSize: 12, color: COLORS.dim, fontWeight: 300 }}>{r.desc}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: COLORS.dim, marginTop: 16, lineHeight: 1.7 }}>
            Create these routes in <code style={{ color: COLORS.mid }}>app/api/</code> using your API keys from environment variables.<br />
            For WhatsApp, the messaging panel opens individual WA chats (no API key required). To send in bulk, use the WhatsApp Business API.
          </p>
        </Card>

        {/* Admin users info */}
        <Card style={{ gridColumn: "1 / -1" }}>
          <Label style={{ marginBottom: 16 }}>Admin Users</Label>
          <p style={{ fontSize: 12, color: COLORS.dim, marginBottom: 16, lineHeight: 1.7 }}>
            User credentials are currently hardcoded in <code style={{ color: COLORS.mid }}>components/Login.tsx</code>. Move them to Firestore or Firebase Auth for production.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { name: "Admin", role: "admin", access: "Full access" },
              { name: "PR Marco / PR Sofia", role: "pr", access: "Own lists, contacts, messaging" },
              { name: "Staff", role: "staff", access: "Check-in + lists (read only)" },
            ].map((u, i, arr) => (
              <div key={u.role} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: COLORS.fg, marginBottom: 2 }}>{u.name}</p>
                  <p style={{ fontSize: 11, color: COLORS.dim }}>{u.access}</p>
                </div>
                <Badge variant={u.role === "admin" ? "green" : u.role === "pr" ? "blue" : "default"}>{u.role}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <Btn onClick={handleSave}>Save Settings</Btn>
        {saved && <span style={{ fontSize: 11, color: COLORS.green, letterSpacing: "0.1em" }}>✓ Saved</span>}
      </div>
    </div>
  )
}