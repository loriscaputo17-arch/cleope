'use client'

import { useState, useEffect } from "react"
import { db } from "../../../../lib/firebase"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore"
import Image from "next/image"
import { AdminUser, COLORS, FONTS, Card, Label, Input, Textarea, Select, Btn, PageHeader, Badge, Table, TR, TD, Empty } from "./ui"

interface EventForm {
  title: string; tag: string; date: string; time: string
  description: string; img: string; entryLink: string
  status: "draft" | "published" | "closed"; capacity: string
}

const EMPTY_FORM: EventForm = { title: "", tag: "", date: "", time: "", description: "", img: "", entryLink: "", status: "draft", capacity: "" }

export default function Events({ user }: { user: AdminUser }) {
  const [events, setEvents] = useState<any[]>([])
  const [form, setForm] = useState<EventForm>(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchEvents = async () => {
    const snap = await getDocs(collection(db, "events"))
    const list = snap.docs
  .map(d => ({ id: d.id, ...d.data() }))
  .filter((ev: any) => {
    if (!ev.title) return false
    if (!ev.date) return false

    const t = new Date(ev.date).getTime()
    return !Number.isNaN(t)
  })
  .sort(
    (a: any, b: any) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  )

setEvents(list)  
  }

  useEffect(() => { fetchEvents() }, [])

  const set = (k: keyof EventForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.title || !form.date || !form.time) return alert("Title, date and time are required.")
    setLoading(true)
    const data = { ...form, capacity: form.capacity ? Number(form.capacity) : null }
    try {
      if (editId) {
        await updateDoc(doc(db, "events", editId), data)
      } else {
        const ref = await addDoc(collection(db, "events"), data)
        await setDoc(doc(db, "listsAccessWebsite", ref.id), { eventId: ref.id, signups: [] })
      }
      await fetchEvents()
      setForm(EMPTY_FORM); setEditId(null); setShowForm(false)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (ev: any) => {
    setForm({ title: ev.title || "", tag: ev.tag || "", date: ev.date || "", time: ev.time || "", description: ev.description || "", img: ev.img || "", entryLink: ev.entryLink || "", status: ev.status || "draft", capacity: ev.capacity || "" })
    setEditId(ev.id); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return
    await deleteDoc(doc(db, "events", id)); await fetchEvents()
  }

  const statusColor: Record<string, any> = { draft: "default", published: "green", closed: "amber" }

  return (
    <div>
      <PageHeader
        title="Events"
        sub={`${events.length} events total`}
        action={
          <Btn onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowForm(s => !s) }}>
            {showForm ? "Cancel" : "+ New Event"}
          </Btn>
        }
      />

      {/* Form */}
      {showForm && (
        <Card style={{ marginBottom: 24 }}>
          <Label style={{ marginBottom: 20 }}>{editId ? "Edit Event" : "Create Event"}</Label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
            <div style={{ marginBottom: 20 }}>
              <Label>Title *</Label>
              <Input placeholder="Event title" value={form.title} onChange={e => set("title", e.target.value)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label>Tag</Label>
              <Input placeholder="e.g. Club Night" value={form.tag} onChange={e => set("tag", e.target.value)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label>Date *</Label>
              <Input type="date" value={form.date} onChange={e => set("date", e.target.value)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label>Time *</Label>
              <Input type="time" value={form.time} onChange={e => set("time", e.target.value)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label>Image URL</Label>
              <Input placeholder="https://..." value={form.img} onChange={e => set("img", e.target.value)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label>Entry / RSVP Link</Label>
              <Input placeholder="https://..." value={form.entryLink} onChange={e => set("entryLink", e.target.value)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label>Capacity</Label>
              <Input type="number" placeholder="Max attendees" value={form.capacity} onChange={e => set("capacity", e.target.value)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label>Status</Label>
              <Select value={form.status} onChange={e => set("status", e.target.value as any)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="closed">Closed</option>
              </Select>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Label>Description</Label>
            <Textarea placeholder="Event description..." value={form.description} onChange={e => set("description", e.target.value)} rows={3} />
          </div>

          {/* Preview */}
          {form.img && (
            <div style={{ marginBottom: 20, position: "relative", width: 120, height: 160, overflow: "hidden" }}>
              <Image src={form.img} alt="Preview" fill style={{ objectFit: "cover" }} />
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <Btn onClick={handleSave} style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? "Saving..." : editId ? "Save Changes" : "Create Event"}
            </Btn>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setEditId(null) }}>Cancel</Btn>
          </div>
        </Card>
      )}

      {/* Events table */}
      <Card style={{ padding: 0 }}>
        {events.length === 0 ? <Empty message="No events yet" /> : (
          <Table headers={["", "Title", "Date", "Status", "Capacity", ""]}>
            {events.map(ev => (
              <TR key={ev.id}>
                <TD style={{ width: 48, padding: "8px 12px" }}>
                  {ev.img ? (
                    <div style={{ position: "relative", width: 36, height: 48, overflow: "hidden", flexShrink: 0 }}>
                      <Image src={ev.img} alt={ev.title} fill style={{ objectFit: "cover" }} />
                    </div>
                  ) : (
                    <div style={{ width: 36, height: 48, background: COLORS.muted }} />
                  )}
                </TD>
                <TD>
                  <p style={{ fontWeight: 500, marginBottom: 2 }}>{ev.title}</p>
                  {ev.tag && <p style={{ fontSize: 10, color: COLORS.dim, letterSpacing: "0.1em", textTransform: "uppercase" }}>{ev.tag}</p>}
                </TD>
                <TD style={{ color: COLORS.mid, fontSize: 12 }}>
                  {new Date(ev.date).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}
                  {ev.time && ` · ${ev.time}`}
                </TD>
                <TD><Badge variant={statusColor[ev.status || "draft"]}>{ev.status || "draft"}</Badge></TD>
                <TD style={{ color: COLORS.mid, fontSize: 12 }}>{ev.capacity || "—"}</TD>
                <TD>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="ghost" style={{ padding: "6px 14px", fontSize: 9 }} onClick={() => handleEdit(ev)}>Edit</Btn>
                    <Btn variant="danger" style={{ padding: "6px 14px", fontSize: 9 }} onClick={() => handleDelete(ev.id)}>Delete</Btn>
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>
    </div>
  )
}