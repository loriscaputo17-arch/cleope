'use client';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const COLLECTION_NAME = "breakout_rsvp";
const EVENT_DATE = new Date("2025-11-22T23:00:00");

export default function BreakLanding() {
  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState("");
  const [timeLeft, setTimeLeft]     = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = EVENT_DATE - new Date();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email) {
      setError("Compila tutti i campi.");
      return;
    }

    setSubmitting(true);
    try {
      // 1️⃣ Salva su Firestore
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        firstName,
        lastName,
        email,
        phone,
        createdAt: serverTimestamp(),
      });

      // 2️⃣ Genera un codice univoco per l’invito (es. ID del doc)
      const code = docRef.id;

      // 3️⃣ Chiama l’API per inviare l’email di invito
      const res = await fetch("/api/breakout_send_invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          name: `${firstName} ${lastName}`,
          code,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Errore invio email:", data.error);
        throw new Error("Invio email fallito");
      }

      // 4️⃣ Conferma completata
      setSuccess(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");

    } catch (err) {
      console.error(err);
      setError("Errore durante la registrazione o l’invio dell’invito.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full bg-[#dd0005] text-white flex flex-col items-center justify-center overflow-hidden">

      {/* Background word */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-[18vw] md:text-[12vw] font-black opacity-10 tracking-tight leading-none">
          BREAKOUT
        </h1>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-md">
        <img src="/images/breaktitle.png" alt="Title Secret Party" className="mt-10 w-80" />
        <p className="text-xs uppercase tracking-[0.3em] mt-2 mb-6">22.11.25 – Milano</p>

        {/* Countdown */}
        <div className="flex gap-6 text-sm font-mono">
          {["days", "hours", "minutes", "seconds"].map((unit, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl font-bold">{timeLeft[unit]}</span>
              <span className="text-[10px] uppercase">{unit}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="mt-8 text-sm leading-relaxed text-neutral-100/90">
          Three realities. One movement.<br />
          The first <span className="font-bold">BREAKOUT</span> happens in Milan.<br />
          RSVP now, limited access.
        </p>

        {/* Error */}
        {!!error && (
          <p className="mt-4 text-xs bg-white/10 border border-white/20 px-4 py-2 rounded-md text-red-300">
            {error}
          </p>
        )}

        {/* Form */}
        {!success ? (
          <form
            onSubmit={handleSubmit}
            className="mt-8 md:w-[30vw] w-[70vw] flex flex-col gap-4 text-black"
          >
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 uppercase tracking-wide placeholder-neutral-500 bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 uppercase tracking-wide placeholder-neutral-500 bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 uppercase tracking-wide placeholder-neutral-500 bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 uppercase tracking-wide placeholder-neutral-500 bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 bg-black text-white font-bold py-3 uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
            >
              {submitting ? "Sending..." : "RSVP"}
            </button>
          </form>
        ) : (
          <div className="mt-10 bg-black/30 border border-white/30 backdrop-blur-sm px-10 py-10 text-center text-white">
            <p className="text-xl uppercase font-extrabold tracking-widest text-white/90">
              You’re in.
            </p>
            <p className="text-md text-neutral-300 mt-4 leading-relaxed">
              Your spot at <strong>BREAKOUT</strong> is locked. <br />
              Watch your email inbox — details drop soon.  
            </p>
            <p className="text-sm text-white mt-6 italic">
              This isn’t just an event. It’s an escape.
            </p>
          </div>
        )}

        <p className="mt-10 text-[10px] text-neutral-200/70 uppercase tracking-[0.25em] mb-16">
          Not a format — a movement.
        </p>
      </div>
    </main>
  );
}
