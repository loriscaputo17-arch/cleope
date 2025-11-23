'use client'

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Events() {
  const [events, setEvents] = useState([])

  const [title, setTitle] = useState("")
  const [tag, setTag] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [description, setDescription] = useState("")
  const [imgURL, setImgURL] = useState("")
  const [entryLink, setEntryLink] = useState("")

  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"))
    setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleCreateEvent = async () => {
    if (!title || !date || !time) return alert("Title, date, and time are required.")

    const eventData = {
      title,
      tag,
      date,
      time,
      description,
      img: imgURL,
      ...(entryLink && { entryLink }),
    }

    const eventRef = await addDoc(collection(db, "events"), eventData)
    await setDoc(doc(db, "listsAccessWebsite", eventRef.id), {
      eventId: eventRef.id,
      signups: [],
    })

    alert("Event created successfully!")
    fetchEvents()
    setTitle("")
    setTag("")
    setDate("")
    setTime("")
    setDescription("")
    setImgURL("")
    setEntryLink("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-3xl font-bold mb-8">Manage Events</h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* FORM */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Create New Event</h3>
          <div className="flex flex-col gap-4">
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-transparent border-b border-white/20 px-4 py-2 focus:outline-none placeholder-white/50" />
            <input placeholder="Tag" value={tag} onChange={(e) => setTag(e.target.value)} className="bg-transparent border-b border-white/20 px-4 py-2 focus:outline-none placeholder-white/50" />
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent border-b border-white/20 px-4 py-2 focus:outline-none" />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-transparent border-b border-white/20 px-4 py-2 focus:outline-none" />
            </div>
            <input type="url" placeholder="Image URL" value={imgURL} onChange={(e) => setImgURL(e.target.value)} className="bg-transparent border-b border-white/20 px-4 py-2 focus:outline-none placeholder-white/50" />
            <input type="url" placeholder="Access Link (optional)" value={entryLink} onChange={(e) => setEntryLink(e.target.value)} className="bg-transparent border-b border-white/20 px-4 py-2 focus:outline-none placeholder-white/50" />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-transparent border-b border-white/20 px-4 py-2 focus:outline-none min-h-[100px] placeholder-white/50"></textarea>
            <button onClick={handleCreateEvent} className="bg-white text-black px-6 py-3 rounded-full font-semibold uppercase text-sm hover:bg-neutral-200 transition">
              Create Event
            </button>
          </div>
        </div>

        {/* PREVIEW */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Preview</h3>
          <div className="rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
            {imgURL ? (
              <Image src={imgURL} alt="Preview" width={600} height={400} className="w-full h-64 object-cover" />
            ) : (
              <div className="w-full h-64 bg-neutral-800 flex items-center justify-center text-neutral-500 text-sm">
                No image preview
              </div>
            )}
            <div className="p-4">
              <h4 className="text-lg font-semibold">{title || "Event Title"}</h4>
              <p className="text-sm text-neutral-400">
                {date || "YYYY-MM-DD"} • {time || "HH:MM"}
              </p>
              <p className="mt-3 text-neutral-300 text-sm">{description || "Event description will appear here."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* EVENTS LIST */}
      <div className="mt-16">
        <h3 className="text-xl font-semibold mb-4">All Events</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {events
          .filter((ev) => ev.img && ev.img.trim() !== "")
          .map((ev) => (
            <div key={ev.id} className="rounded-xl border border-white/10 overflow-hidden bg-neutral-900">
              <img src={ev.img || "/fallback.jpg"} alt={ev.title} width={1080} height={1350} className="w-full h-[50vh] object-cover" />
              <div className="p-4">
                <h4 className="font-semibold">{ev.title}</h4>
                <p className="text-sm text-neutral-400">
                  {ev.date} • {ev.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
