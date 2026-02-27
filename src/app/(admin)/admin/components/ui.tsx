// ─── Section type (shared across all admin components) ───────────────────────
export type Section =
  | "dashboard"
  | "events"
  | "lists"
  | "contacts"
  | "checkin"
  | "qrcheckin"
  | "messaging"
  | "settings"

// ─── Shared admin design tokens & reusable primitives ───────────────────────

export const COLORS = {
  bg:     "#070707",
  surface:"#0e0e0e",
  border: "rgba(240,239,235,0.08)",
  fg:     "#f0efeb",
  mid:    "rgba(240,239,235,0.45)",
  dim:    "rgba(240,239,235,0.22)",
  muted:  "rgba(240,239,235,0.12)",
  green:  "#4ade80",
  red:    "#f87171",
  amber:  "#fbbf24",
}

export const FONTS = {
  display: "'Syne', sans-serif",
  body:    "'Inter', sans-serif",
}

// ─── Firestore collection names ──────────────────────────────────────────────
export const COLL = {
  events:    "events",
  contacts:  "contacts",
  rsvp:      (eventId: string) => `events/${eventId}/attendees`,
  checkin:   (eventId: string) => `events/${eventId}/attendees`,
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminUser {
  name: string
  role: "admin" | "pr" | "staff"
  prCode?: string
}

export interface CleEvent {
  id: string
  title: string
  date: string
  time: string
  tag?: string
  description?: string
  img?: string
  entryLink?: string
  status?: "draft" | "published" | "closed"
  capacity?: number
}

export interface Attendee {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  pr?: string
  status?: "pending" | "approved" | "rejected"
  checkedIn?: boolean
  checkedInAt?: string
  createdAt?: any
  guests?: number
  note?: string
}

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  tags?: string[]
  pr?: string
  createdAt?: any
}

// ─── UI primitives ────────────────────────────────────────────────────────────

import React from "react"

// Label
export const Label = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <span style={{
    fontFamily: FONTS.body,
    fontSize: 9, fontWeight: 500,
    letterSpacing: "0.25em", textTransform: "uppercase" as const,
    color: COLORS.dim,
    display: "block",
    marginBottom: 8,
    ...style,
  }}>
    {children}
  </span>
)

// Card
export const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    padding: 24,
    ...style,
  }}>
    {children}
  </div>
)

// Input
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ style, ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      style={{
        fontFamily: FONTS.body,
        fontSize: 13, fontWeight: 300,
        width: "100%",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${COLORS.muted}`,
        color: COLORS.fg,
        padding: "10px 0",
        outline: "none",
        transition: "border-color 0.2s",
        ...style,
      }}
      onFocus={e => { e.currentTarget.style.borderBottomColor = COLORS.dim }}
      onBlur={e => { e.currentTarget.style.borderBottomColor = COLORS.muted }}
    />
  )
)
Input.displayName = "Input"

// Textarea
export const Textarea = ({ style, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    style={{
      fontFamily: FONTS.body,
      fontSize: 13, fontWeight: 300,
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: `1px solid ${COLORS.muted}`,
      color: COLORS.fg,
      padding: "10px 0",
      outline: "none",
      resize: "none",
      ...style,
    }}
  />
)

// Select
export const Select = ({ style, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    style={{
      fontFamily: FONTS.body,
      fontSize: 12, fontWeight: 400,
      width: "100%",
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      color: COLORS.fg,
      padding: "9px 12px",
      outline: "none",
      cursor: "pointer",
      ...style,
    }}
  />
)

// Button variants
type BtnVariant = "solid" | "ghost" | "danger" | "success"
export const Btn = ({
  children, variant = "solid", style, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) => {
  const styles: Record<BtnVariant, React.CSSProperties> = {
    solid:   { background: COLORS.fg, color: COLORS.bg, border: "none" },
    ghost:   { background: "transparent", color: COLORS.fg, border: `1px solid ${COLORS.border}` },
    danger:  { background: "rgba(248,113,113,0.12)", color: COLORS.red, border: `1px solid rgba(248,113,113,0.2)` },
    success: { background: "rgba(74,222,128,0.12)", color: COLORS.green, border: `1px solid rgba(74,222,128,0.2)` },
  }
  return (
    <button
      {...props}
      style={{
        fontFamily: FONTS.body,
        fontSize: 10, fontWeight: 500,
        letterSpacing: "0.18em", textTransform: "uppercase" as const,
        padding: "9px 20px",
        cursor: "pointer",
        transition: "opacity 0.2s",
        whiteSpace: "nowrap" as const,
        ...styles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// Badge
type BadgeVariant = "default" | "green" | "red" | "amber" | "blue"
export const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: BadgeVariant }) => {
  const styles: Record<BadgeVariant, React.CSSProperties> = {
    default: { background: COLORS.muted,  color: COLORS.dim },
    green:   { background: "rgba(74,222,128,0.12)", color: COLORS.green },
    red:     { background: "rgba(248,113,113,0.12)", color: COLORS.red },
    amber:   { background: "rgba(251,191,36,0.12)", color: COLORS.amber },
    blue:    { background: "rgba(147,197,253,0.12)", color: "#93c5fd" },
  }
  return (
    <span style={{
      fontFamily: FONTS.body,
      fontSize: 9, fontWeight: 500,
      letterSpacing: "0.2em", textTransform: "uppercase" as const,
      padding: "3px 8px",
      ...styles[variant],
    }}>
      {children}
    </span>
  )
}

// Table
export const Table = ({ headers, children }: { headers: string[]; children: React.ReactNode }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONTS.body }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={`${h}-${i}`} style={{
              fontSize: 9, fontWeight: 500, letterSpacing: "0.2em",
              textTransform: "uppercase", color: COLORS.dim,
              padding: "10px 16px", textAlign: "left" as const,
              borderBottom: `1px solid ${COLORS.border}`,
            }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
)

export const TR = ({ children, highlight }: { children: React.ReactNode; highlight?: "green" | "red" }) => (
  <tr style={{
    borderBottom: `1px solid ${COLORS.border}`,
    background: highlight === "green" ? "rgba(74,222,128,0.04)" : highlight === "red" ? "rgba(248,113,113,0.04)" : "transparent",
    transition: "background 0.15s",
  }}>
    {children}
  </tr>
)

export const TD = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <td style={{ fontSize: 13, color: COLORS.fg, padding: "12px 16px", ...style }}>
    {children}
  </td>
)

// Section header
export const PageHeader = ({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
    <div>
      <h1 style={{ fontFamily: FONTS.display, fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: sub ? 6 : 0 }}>
        {title}
      </h1>
      {sub && <p style={{ fontSize: 13, color: COLORS.mid, fontWeight: 300 }}>{sub}</p>}
    </div>
    {action}
  </div>
)

// Empty state
export const Empty = ({ message }: { message: string }) => (
  <div style={{ padding: "64px 0", textAlign: "center", color: COLORS.dim }}>
    <p style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>{message}</p>
  </div>
)