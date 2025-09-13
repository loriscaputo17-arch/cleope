'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

export default function TicketsPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event");
  const pr = searchParams.get("pr"); 

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      const docRef = doc(db, "events", eventId);
      const docSnap = await getDoc(docRef);

      console.log(eventId)
      console.log(docSnap)

      if (docSnap.exists()) {
        setEventData({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId) return alert("No event selected");

    // Aggiungi PR nel form
    const signupData = { ...form, pr: pr || null };

    await addDoc(collection(db, "events", eventId, "attendees"), signupData);

    alert(`You have been added to the list for: ${eventData?.title || "the event"}`);
    setForm({ firstName: "", lastName: "", email: "", phone: "" });
  };

  if (loading) {
    return <main className="text-white p-12">Loading...</main>;
  }

  if (!eventData) {
    return <main className="text-white p-12">Event not found.</main>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-12">
      <h1 className="text-4xl font-extrabold uppercase mb-4 tracking-widest text-center mt-8">
        {eventData.title}
      </h1>
      <p className="text-neutral-400 mb-8 text-center">
        You’re about to join the list
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
            className="px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"          />
        </div>
        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
            className="px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"            />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"          />
        </div>
        <div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"          />
        </div>

        <button
          type="submit"
          className="rounded-full w-full bg-white text-black py-3 uppercase tracking-widest hover:bg-neutral-200 transition cursor-pointer"
        >
          Join the List
        </button>
      </form>
    </main>
  );
}
