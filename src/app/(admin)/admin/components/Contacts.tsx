'use client'

import { useEffect, useState } from "react"
import { db } from "../../../../lib/firebase"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { AdminUser, COLORS, FONTS, Card, Label, Input, Btn, Badge, PageHeader, Table, TR, TD, Empty } from "./ui"

interface ContactForm {
  firstName: string; lastName: string; email: string; phone: string; pr: string; tags: string
}

const EMPTY: ContactForm = { firstName: "", lastName: "", email: "", phone: "", pr: "", tags: "" }

export default function Contacts({ user }: { user: AdminUser }) {
  const [contacts, setContacts] = useState<any[]>([])
  const [form, setForm] = useState<ContactForm>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
  const [tagFilter, setTagFilter] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchContacts = async () => {
    const snap = await getDocs(collection(db, "contacts"))
    setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() as any })).sort((a: any, b: any) => `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`)))
  }

  useEffect(() => { fetchContacts() }, [])

  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags || []))) as string[]

  const set = (k: keyof ContactForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.firstName || !form.lastName) return alert("Name required")
    setLoading(true)
    const data = { ...form, tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [] }
    try {
      if (editId) {
        await updateDoc(doc(db, "contacts", editId), data)
      } else {
        await addDoc(collection(db, "contacts"), { ...data, createdAt: new Date() })
      }
      await fetchContacts()
      setForm(EMPTY); setEditId(null); setShowForm(false)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (c: any) => {
    setForm({ firstName: c.firstName || "", lastName: c.lastName || "", email: c.email || "", phone: c.phone || "", pr: c.pr || "", tags: (c.tags || []).join(", ") })
    setEditId(c.id); setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete contact?")) return
    await deleteDoc(doc(db, "contacts", id)); fetchContacts()
  }

  let filtered = contacts
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(c => `${c.firstName} ${c.lastName} ${c.email} ${c.phone}`.toLowerCase().includes(q))
  }
  if (tagFilter) filtered = filtered.filter(c => (c.tags || []).includes(tagFilter))
  if (user.role === "pr" && user.prCode) filtered = filtered.filter(c => c.pr === user.prCode)

  const exportCSV = () => {
    const rows = [["Nome","Cognome","Email","Phone","PR","Tags"].join(";")]
    filtered.forEach(c => rows.push([c.firstName,c.lastName,c.email||"",c.phone||"",c.pr||"",(c.tags||[]).join(",")].join(";")))
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob)
    link.download = `contacts-${Date.now()}.csv`; link.click()
  }

  return (
    <div>
      <PageHeader
        title="Contacts"
        sub={`${contacts.length} contacts in CRM`}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" onClick={exportCSV} style={{ fontSize: 9 }}>↓ CSV</Btn>
            <Btn onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(s => !s) }}>
              {showForm ? "Cancel" : "+ Add Contact"}
            </Btn>
          </div>
        }
      />

      {/* Add/Edit form */}
      {showForm && (
        <Card style={{ marginBottom: 16 }}>
          <Label style={{ marginBottom: 16 }}>{editId ? "Edit Contact" : "New Contact"}</Label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0 24px" }}>
            {([["firstName","First Name"],["lastName","Last Name"],["email","Email"],["phone","Phone"],["pr","PR Code"]] as [keyof ContactForm, string][]).map(([k, lbl]) => (
              <div key={k} style={{ marginBottom: 16 }}>
                <Label>{lbl}</Label>
                <Input placeholder={lbl} value={form[k]} onChange={e => set(k, e.target.value)} />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <Label>Tags (comma separated)</Label>
              <Input placeholder="vip, regular, promo" value={form.tags} onChange={e => set("tags", e.target.value)} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <Btn onClick={handleSave} style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? "Saving..." : editId ? "Save" : "Add Contact"}
            </Btn>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY) }}>Cancel</Btn>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card style={{ marginBottom: 16, padding: "12px 20px" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 220, padding: "8px 0" }} />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button
              onClick={() => setTagFilter("")}
              style={{ fontFamily: FONTS.body, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", padding: "5px 12px", cursor: "pointer", background: !tagFilter ? COLORS.fg : "transparent", color: !tagFilter ? COLORS.bg : COLORS.dim, border: `1px solid ${!tagFilter ? COLORS.fg : COLORS.muted}` }}
            >
              All
            </button>
            {allTags.map(t => (
              <button
                key={t}
                onClick={() => setTagFilter(t === tagFilter ? "" : t)}
                style={{ fontFamily: FONTS.body, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", padding: "5px 12px", cursor: "pointer", background: tagFilter === t ? COLORS.fg : "transparent", color: tagFilter === t ? COLORS.bg : COLORS.dim, border: `1px solid ${tagFilter === t ? COLORS.fg : COLORS.muted}` }}
              >
                {t}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 11, color: COLORS.dim, marginLeft: "auto" }}>{filtered.length} results</span>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: 0 }}>
        {filtered.length === 0 ? <Empty message="No contacts" /> : (
          <Table headers={["Name", "Email", "Phone", "PR", "Tags", ""]}>
            {filtered.map(c => (
              <TR key={c.id}>
                <TD><p style={{ fontWeight: 500 }}>{c.firstName} {c.lastName}</p></TD>
                <TD style={{ color: COLORS.mid, fontSize: 12 }}>{c.email || "—"}</TD>
                <TD style={{ color: COLORS.mid, fontSize: 12 }}>{c.phone || "—"}</TD>
                <TD style={{ fontSize: 11, color: COLORS.dim }}>{c.pr || "—"}</TD>
                <TD>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {(c.tags || []).map((t: string) => <Badge key={t} variant="blue">{t}</Badge>)}
                  </div>
                </TD>
                <TD>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn variant="ghost" style={{ padding: "5px 12px", fontSize: 9 }} onClick={() => handleEdit(c)}>Edit</Btn>
                    {user.role === "admin" && (
                      <Btn variant="danger" style={{ padding: "5px 12px", fontSize: 9 }} onClick={() => handleDelete(c.id)}>Del</Btn>
                    )}
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