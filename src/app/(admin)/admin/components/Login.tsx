'use client'

import { useState, useEffect } from "react"
import { AdminUser } from "./ui"

// ─── Credentials config ──────────────────────────────────────────────────────
// In production move these to env vars or Firestore
const USERS: Array<AdminUser & { password: string }> = [
  { name: "Admin",  role: "admin", password: "admin2024" },
  { name: "PR Marco", role: "pr", prCode: "marco", password: "marco" },
  { name: "PR Sofia",  role: "pr", prCode: "sofia", password: "sofia" },
  { name: "Staff",  role: "staff", password: "staff" },
]

const STORAGE_KEY = "cleope_admin_user";

export default function Login({ onLogin }: { onLogin: (u: AdminUser) => void }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [year, setYear] = useState("")

  useEffect(() => { setYear(String(new Date().getFullYear())) }, [])

  const handleLogin = () => {
    const match = USERS.find(u => u.password === password)

    if (!match) {
      setError("Wrong password.")
      return
    }

    const { password: _, ...user } = match

    // ✅ salva in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))

    onLogin(user)
  }

  useEffect(() => {
    setYear(String(new Date().getFullYear()))

    // ✅ restore session
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const user = JSON.parse(saved)
        onLogin(user)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Inter:wght@300;400;500&display=swap');
        .login-input {
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 300;
          background: transparent; border: none;
          border-bottom: 1px solid rgba(240,239,235,0.15);
          color: #f0efeb; padding: 12px 0; outline: none; width: 260px;
          text-align: center; letter-spacing: 0.1em;
          transition: border-color 0.2s;
        }
        .login-input:focus { border-bottom-color: rgba(240,239,235,0.5); }
        .login-input::placeholder { color: rgba(240,239,235,0.2); }
        .login-btn {
          font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          background: #f0efeb; color: #070707; border: none;
          padding: 13px 40px; cursor: pointer; transition: opacity 0.2s; margin-top: 24px;
        }
        .login-btn:hover { opacity: 0.85; }
      `}</style>

      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "#070707", color: "#f0efeb",
        fontFamily: "'Inter', sans-serif",
        gap: 0,
      }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px,6vw,56px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>
          CLEOPE
        </h1>
        <p style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(240,239,235,0.25)", marginBottom: 48 }}>
          Admin CRM
        </p>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError("") }}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          className="login-input"
          data-lpignore="true"
          autoComplete="off"
        />

        {error && (
          <p style={{ fontSize: 11, color: "#f87171", marginTop: 10, letterSpacing: "0.1em" }}>{error}</p>
        )}

        <button className="login-btn" onClick={handleLogin}>
          Enter →
        </button>

        <p style={{ fontSize: 10, color: "rgba(240,239,235,0.15)", marginTop: 48, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          © {year} CLEOPE HUB
        </p>
      </div>
    </>
  )
}