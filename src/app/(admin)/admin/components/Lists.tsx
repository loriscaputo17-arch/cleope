'use client'

import { useEffect, useState } from "react"
import { db } from "../../../../lib/firebase"
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore"
import { AdminUser, COLORS, FONTS, Card, Label, Select, Input, Btn, Badge, PageHeader, Table, TR, TD, Empty } from "./ui"
import { supabase } from "../../../../lib/supabase"

type Status = "pending" | "approved" | "rejected"

export default function Lists({ user }: { user: AdminUser }) {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState("")
  const [attendees, setAttendees] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [prFilter, setPrFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All")
  const [loading, setLoading] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ firstName: "", lastName: "", email: "", phone: "", pr: "", guests: "1", note: "" })

  const [listTab, setListTab] = useState<"rsvp" | "tables">("rsvp")

  useEffect(() => {
    getDocs(collection(db, "events"))
    .then(snap => {
  const list = snap.docs
    .map(d => ({ id: d.id, ...d.data() as any }))
    .filter(ev => {
      if (!ev.title) return false
      if (!ev.date) return false
      return Number.isFinite(new Date(ev.date).getTime())
    })
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )

  setEvents(list)
})
  }, [])

  useEffect(() => {
  if (!selectedEvent) {
    setAttendees([])
    return
  }

  setLoading(true)

  console.log(selectedEvent)
  
const load = async () => {
  try {
    setLoading(true)

    // ================= RSVP =================
    if (listTab === "rsvp") {
      const { data, error } = await supabase
        .from("Lists")
        .select("*")
        .eq("event_id", selectedEvent)
        .order("created_at", { ascending: false })

      if (error) throw error

      let list = (data || []).map((r: any) => ({
        id: r.id,
        firstName: r.full_name?.split(" ")[0] || "",
        lastName: r.full_name?.split(" ").slice(1).join(" ") || "",
        email: r.email,
        phone: r.phone_number,
        pr: r.pr,
        status: r.approved ? "approved" : "pending",
        guests: 1,
        note: "",
        source: "rsvp",
      }))

      if (user.role === "pr" && user.prCode) {
        list = list.filter(a => a.pr === user.prCode)
      }

      setAttendees(list)
    }

    // ================= TABLES =================
    if (listTab === "tables") {
      const { data, error } = await supabase
        .from("TableRequests")
        .select("*")
        .eq("event_id", selectedEvent)
        .order("created_at", { ascending: false })

      if (error) throw error

      let list = (data || []).map((r: any) => ({
        id: r.id,
        firstName: r.full_name?.split(" ")[0] || "",
        lastName: r.full_name?.split(" ").slice(1).join(" ") || "",
        email: r.email,
        phone: r.phone_number,
        pr: r.pr,
        status: r.approved ? "approved" : "pending",
        guests: r.guests || 1,
        note: r.note || "",
        source: "table",
      }))

      if (user.role === "pr" && user.prCode) {
        list = list.filter(a => a.pr === user.prCode)
      }

      setAttendees(list)
    }

  } catch (err) {
    console.error(err)
    setAttendees([])
  } finally {
    setLoading(false)
  }
}

  load()
}, [selectedEvent, listTab, user.role, user.prCode])

  const prs = ["All", ...Array.from(new Set(attendees.map(a => a.pr || "No PR")))]

  let filtered = attendees
  if (user.role !== "pr") {
    if (prFilter !== "All") filtered = filtered.filter(a => (a.pr || "No PR") === prFilter)
  }
  if (statusFilter !== "All") {
    filtered = filtered.filter(a => a.status === statusFilter)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(a => `${a.firstName} ${a.lastName} ${a.email} ${a.phone}`.toLowerCase().includes(q))
  }

const updateStatus = async (id: string, email: string, firstName: string, lastName: string, status: Status) => {
  try {
    const approved = status === "approved"

    // 🔥 update supabase
    const { error } = await supabase
      .from("Lists")
      .update({ approved })
      .eq("id", id)

    if (error) {
      console.error(error)
      return
    }

    // 🔥 aggiorna UI immediata
    setAttendees(prev =>
      prev.map(a => (a.id === id ? { ...a, status } : a))
    )

    // 🔥 chiama API solo se approvato
    if (approved) {
      await fetch("/api/themerge2_confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          name: `${firstName} ${lastName}`
        })
      })
    }
  } catch (err) {
    console.error(err)
  }
}

const handleCheckin = async (id: string) => {
  try {
    const { error } = await supabase.from("checkins").insert({
      event_id: selectedEvent,
      user_id: id,
      checked_in: true,
    })

    if (error) {
      console.error(error)
      alert("Check-in failed")
      return
    }

    alert("Checked-in ✅")
  } catch (err) {
    console.error(err)
  }
}

  const deleteAttendee = async (id: string) => {
    if (!confirm("Delete this contact from the list?")) return
    await deleteDoc(doc(db, "events", selectedEvent, "attendees", id))
    setAttendees(prev => prev.filter(a => a.id !== id))
  }

  const handleAdd = async () => {
    if (!addForm.firstName || !addForm.lastName) return alert("Name required")
    await addDoc(collection(db, "events", selectedEvent, "attendees"), {
      ...addForm, guests: Number(addForm.guests) || 1,
      status: "approved", checkedIn: false, createdAt: { seconds: Date.now() / 1000 }
    })
    setAddForm({ firstName: "", lastName: "", email: "", phone: "", pr: "", guests: "1", note: "" })
    setAddOpen(false)
    getDocs(collection(db, "events", selectedEvent, "attendees"))
      .then(snap => setAttendees(snap.docs.map(d => ({ id: d.id, ...d.data() as any }))))
  }

  const exportCSV = () => {
    if (!filtered.length) return alert("Nothing to export")
    const rows = [["Nome", "Cognome", "Email", "Phone", "PR", "Status", "Ospiti"].join(";")]
    filtered.forEach(a => rows.push([a.firstName, a.lastName, a.email || "", a.phone || "", a.pr || "", a.status || "pending", a.guests || 1].join(";")))
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob)
    link.download = `list-${selectedEvent}-${Date.now()}.csv`; link.click()
  }

  const statusColor: Record<string, any> = { pending: "amber", approved: "green", rejected: "red" }

  const counts = {
    total: filtered.length,
    approved: filtered.filter(a => a.status === "approved").length,
    pending: filtered.filter(a => a.status === "pending").length,
  }

  return (
    <div>
      <PageHeader title="Lists" sub="RSVP & access lists per event" />

      {/* Event selector */}
      <Card style={{ marginBottom: 16 }}>
        <Label>Select Event</Label>
        <Select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} style={{ maxWidth: 400 }}>
          <option value="">— Choose an event —</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.title} · {new Date(ev.date).toLocaleDateString("it-IT")}
            </option>
          ))}
        </Select>
      </Card>

      {selectedEvent && (
        <>
        <div style={{
  display: "flex",
  gap: 16,
  marginBottom: 16,
}}>
  <button
    onClick={() => setListTab("rsvp")}
    style={{
      padding: "6px 14px",
      fontSize: 11,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      border: "1px solid " + COLORS.border,
      background: listTab === "rsvp" ? COLORS.surface : "transparent",
      cursor: "pointer",
    }}
  >
    RSVP
  </button>

  <button
    onClick={() => setListTab("tables")}
    style={{
      padding: "6px 14px",
      fontSize: 11,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      border: "1px solid " + COLORS.border,
      background: listTab === "tables" ? COLORS.surface : "transparent",
      cursor: "pointer",
    }}
  >
    Tables
  </button>
</div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
            {[
              { label: "Total", value: counts.total },
              { label: "Approved", value: counts.approved },
              { label: "Pending", value: counts.pending },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`, padding: "14px 16px" }}>
                <Label style={{ marginBottom: 4 }}>{s.label}</Label>
                <p style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 800, color: COLORS.fg }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <Card style={{ marginBottom: 16, padding: "14px 20px" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <Input placeholder="Search name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 240, padding: "8px 0" }} />

              {user.role === "admin" && (
                <Select value={prFilter} onChange={e => setPrFilter(e.target.value)} style={{ width: "auto", padding: "8px 12px" }}>
                  {prs.map(p => <option key={p} value={p}>{p}</option>)}
                </Select>
              )}

              <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} style={{ width: "auto", padding: "8px 12px" }}>
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>

              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <Btn variant="ghost" onClick={exportCSV} style={{ fontSize: 9 }}>↓ CSV</Btn>
                {user.role !== "staff" && (
                  <Btn onClick={() => setAddOpen(o => !o)} style={{ fontSize: 9 }}>+ Add</Btn>
                )}
              </div>
            </div>
          </Card>

          {/* Add form */}
          {addOpen && (
            <Card style={{ marginBottom: 16 }}>
              <Label style={{ marginBottom: 16 }}>Add to List</Label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0 24px" }}>
                {([["firstName","First Name"],["lastName","Last Name"],["email","Email"],["phone","Phone"],["pr","PR Code"],["guests","Guests"]] as [string, string][]).map(([k, lbl]) => (
                  <div key={k} style={{ marginBottom: 16 }}>
                    <Label>{lbl}</Label>
                    <Input value={(addForm as any)[k]} onChange={e => setAddForm(f => ({ ...f, [k]: e.target.value }))} placeholder={lbl} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <Label>Note</Label>
                <Input value={addForm.note} onChange={e => setAddForm(f => ({ ...f, note: e.target.value }))} placeholder="Optional note" />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={handleAdd}>Add to List</Btn>
                <Btn variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Btn>
              </div>
            </Card>
          )}

          {/* Table */}
          <Card style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: 32, textAlign: "center", color: COLORS.dim, fontSize: 12 }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <Empty message="No attendees found" />
            ) : (
              <Table headers={["Name", "Contact", "PR", "Guests", "Status", "Actions"]}>
                {filtered.map(a => (
                  <TR key={a.id} highlight={a.status === "approved" ? "green" : a.status === "rejected" ? "red" : undefined}>
                    <TD>
                      <p style={{ fontWeight: 500 }}>{a.firstName} {a.lastName}</p>
                      {a.note && <p style={{ fontSize: 11, color: COLORS.dim }}>{a.note}</p>}
                    </TD>
                    <TD style={{ color: COLORS.mid, fontSize: 12 }}>
                      {a.email && (
                        <p>
                          <a
                            href={`mailto:${a.email}`}
                            style={{ textDecoration: "underline", textUnderlineOffset: 2 }}
                          >
                            {a.email}
                          </a>
                        </p>
                      )}

                      {a.phone && (
                        <p>
                          <a
                            href={`https://wa.me/${String(a.phone).replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "underline", textUnderlineOffset: 2 }}
                          >
                            {a.phone}
                          </a>
                        </p>
                      )}
                    </TD>
                    <TD><span style={{ fontSize: 11, color: COLORS.dim }}>{a.pr || "—"}</span></TD>
                    <TD><span style={{ fontSize: 12, color: COLORS.mid }}>{a.guests || 1}</span></TD>
                    <TD><Badge variant={statusColor[a.approved || "pending"]}>{a.approved || "pending"}</Badge></TD>
                    <TD>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {(a.approved !== "approved") && (
                          <Btn variant="success" style={{ padding: "5px 12px", fontSize: 9 }} onClick={() => updateStatus(a.id,a.emai, a.firstName, a.lastName, "approved")}>✓ Approve</Btn>
                        )}
                      </div>
                      <Btn
                        variant="ghost"
                        style={{ padding: "5px 12px", fontSize: 9 }}
                        onClick={() => handleCheckin(a.id)}
                      >
                        Check-in
                      </Btn>
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