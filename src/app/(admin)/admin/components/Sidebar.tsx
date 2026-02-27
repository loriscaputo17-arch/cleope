'use client'

import { AdminUser, Section, COLORS, FONTS } from "./ui"

interface NavItem {
  id: Section
  label: string
  icon: string
  roles: Array<"admin" | "pr" | "staff">
}

const NAV: NavItem[] = [
  { id: "dashboard",  label: "Dashboard",  icon: "◈", roles: ["admin", "pr", "staff"] },
  { id: "events",     label: "Events",     icon: "◉", roles: ["admin"] },
  { id: "lists",      label: "Lists",      icon: "≡", roles: ["admin", "pr", "staff"] },
  { id: "contacts",   label: "Contacts",   icon: "◎", roles: ["admin", "pr"] },
  { id: "checkin",    label: "Check-in",   icon: "✓", roles: ["admin", "staff"] },
  { id: "messaging",  label: "Messaging",  icon: "◷", roles: ["admin"] },
  { id: "settings",   label: "Settings",   icon: "◌", roles: ["admin"] },
]

export default function Sidebar({
  user, section, setSection, onLogout
}: {
  user: AdminUser
  section: Section
  setSection: (s: Section) => void
  onLogout: () => void
}) {
  const visible = NAV.filter(n => n.roles.includes(user.role))

  return (
    <div style={{
      width: "100%", height: "100%",
      background: COLORS.surface,
      borderRight: `1px solid ${COLORS.border}`,
      display: "flex", flexDirection: "column",
      padding: "28px 0",
      fontFamily: FONTS.body,
    }}>
      {/* Brand */}
      <div style={{ padding: "0 20px 28px", borderBottom: `1px solid ${COLORS.border}` }}>
        <p style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em", color: COLORS.fg }}>
          CLEOPE
        </p>
        <p style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: COLORS.dim, marginTop: 2 }}>
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {visible.map(item => {
          const active = section === item.id
          return (
            <button
              key={`${item.id}`}
              onClick={() => setSection(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "9px 12px",
                cursor: 'pointer',
                background: active ? "rgba(240,239,235,0.07)" : "transparent",
                borderLeft: active ? `2px solid ${COLORS.fg}` : "2px solid transparent",
                color: active ? COLORS.fg : COLORS.dim,
                fontFamily: FONTS.body, fontSize: 12, fontWeight: active ? 500 : 400,
                letterSpacing: "0.04em",
                transition: "all 0.15s",
                textAlign: "left",
                width: "100%",
              }}
            >
              <span style={{ fontSize: 14, opacity: active ? 1 : 0.5 }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: "16px 20px", borderTop: `1px solid ${COLORS.border}` }}>
        <p style={{ fontSize: 12, color: COLORS.mid, marginBottom: 2 }}>{user.name}</p>
        <p style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.dim, marginBottom: 12 }}>
          {user.role}
        </p>
        <button
          onClick={onLogout}
          style={{
            fontFamily: FONTS.body, fontSize: 10, fontWeight: 500,
            letterSpacing: "0.15em", textTransform: "uppercase",
            background: "none", border: "none",
            color: "rgba(248,113,113,0.5)", cursor: "pointer",
            transition: "color 0.2s", padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(248,113,113,0.5)"}
        >
          Logout
        </button>
      </div>
    </div>
  )
}