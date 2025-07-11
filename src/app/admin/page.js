'use client'

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [access, setAccess] = useState(false);

  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [entryLink, setEntryLink] = useState(""); // nuovo stato per il link ingressi

  const handleLogin = () => {
    if (password === "123") {
      setAccess(true);
    } else {
      alert("Wrong password!");
    }
  };

  const handleCreateEvent = async () => {
    // Crea evento con URL immagine e link ingressi (se fornito)
    const eventData = {
      title,
      tag,
      date,
      time,
      description,
      img: imgURL,
    };

    // Aggiungi entryLink solo se è valorizzato (non vuoto)
    if (entryLink.trim() !== "") {
      eventData.entryLink = entryLink.trim();
    }

    const eventRef = await addDoc(collection(db, "events"), eventData);

    await setDoc(doc(db, "listsAccessWebsite", eventRef.id), {
      eventId: eventRef.id,
      signups: [],
    });

    alert("Event & list created!");

    // Reset campi
    setTitle("");
    setTag("");
    setDate("");
    setTime("");
    setDescription("");
    setImgURL("");
    setEntryLink("");
  };

  if (!access) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-b px-4 py-2"
        />
        <button
          onClick={handleLogin}
          className="mt-4 bg-white text-black px-6 py-2 cursor-pointer rounded-md"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-xl mx-auto py-20 flex flex-col gap-6">
      <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
      <input
        placeholder="Title"
        className="border-b px-4 py-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Tag"
        className="border-b px-4 py-2"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />
      <label className="text-sm font-medium">Date</label>
      <input
        type="date"
        className="border-b px-4 py-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <label className="text-sm font-medium">Time</label>
      <input
        type="time"
        className="border-b px-4 py-2"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <label className="text-sm font-medium">Image URL</label>
      <input
        type="text"
        placeholder="https://..."
        value={imgURL}
        onChange={(e) => setImgURL(e.target.value)}
        className="border-b px-4 py-2"
      />
      
      <label className="text-sm font-medium">Access Link (optional)</label>
      <input
        type="url"
        placeholder="https://..."
        value={entryLink}
        onChange={(e) => setEntryLink(e.target.value)}
        className="border-b px-4 py-2"
      />

      <textarea
        placeholder="Description"
        className="border-b px-4 py-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <button
        onClick={handleCreateEvent}
        className="bg-white text-black px-6 py-2 cursor-pointer rounded-md"
      >
        Create Event
      </button>
    </main>
  );
}
