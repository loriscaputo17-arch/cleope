"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const COLLECTION_NAME = "only300_rsvp";
const EVENT_DATE = new Date("2025-11-29T22:30:00");

export default function BreakLanding() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        firstName,
        lastName,
        email,
        phone,
        createdAt: serverTimestamp(),
      });

      const code = docRef.id;

      const res = await fetch("/api/only300_send_invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          name: `${firstName} ${lastName}`,
          code,
        }),
      });

      if (!res.ok) throw new Error("Invio email fallito");

      setSuccess(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      setError("Errore durante la registrazione o l’invio dell’invito.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden">

      {/* Background kanji and glitch effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-[18vw] md:text-[13vw] font-black opacity-5 text-red-600 tracking-tight select-none">
          脱出
        </h1>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-md">
        <img src="/images/RONIN_title.png" className="mt-10 w-80 brightness-0 invert drop-shadow-[0_0_15px_#ff0000]" />

        <p className="text-xs font-mono tracking-[0.4em] mb-4 text-red-500">
          ANNIVERSARY CLEOPE.
        </p>

        <p className="text-xs font-mono tracking-[0.4em] mb-6 text-red-500">
          29.11.25 — 東京 ⟡ MILANO
        </p>

        {/* Countdown */}
        <div className="flex gap-6 text-sm font-mono">
          {["days", "hours", "minutes", "seconds"].map((unit, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl font-bold text-red-500 drop-shadow-[0_0_8px_#ff0000]">
                {timeLeft[unit]}
              </span>
              <span className="text-[10px] uppercase opacity-60">{unit}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="mt-8 text-sm tracking-wide text-neutral-300 leading-relaxed">
          予測不可能。<br />
          This is <span className="text-red-500 font-bold">ONLY 300.</span><br />
          Access is limited — RSVP now.
        </p>

        {!!error && (
          <p className="mt-4 text-xs bg-red-900/40 border border-red-700 px-4 py-2 rounded-md text-red-300 backdrop-blur-md">
            {error}
          </p>
        )}

        {!success ? (
          <form
            onSubmit={handleSubmit}
            className="mt-8 md:w-[30vw] w-[70vw] flex flex-col gap-4"
          >
            {[
              ["First Name", firstName, setFirstName],
              ["Last Name", lastName, setLastName],
              ["Email", email, setEmail],
              ["Phone", phone, setPhone],
            ].map(([placeholder, value, setter], i) => (
              <input
                key={i}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-red-500/60 text-white font-mono tracking-wider uppercase
                placeholder-red-400/40 focus:ring-2 focus:ring-red-500 transition-all hover:border-red-500
                shadow-[0_0_10px_rgba(255,0,0,0.35)]"
              />
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 bg-red-600 hover:bg-red-900 transition-all text-black font-bold py-3 tracking-[0.3em] uppercase shadow-[0_0_20px_#ff0000]"
            >
              {submitting ? "Sending..." : "Enter"}
            </button>
          </form>
        ) : (
          <div className="mt-10 bg-red-900/20 border border-red-600 backdrop-blur-md px-10 py-10">
            <p className="text-xl font-bold tracking-widest text-red-500 drop-shadow-[0_0_10px_#ff0000]">
              承認 — Accepted
            </p>
            <p className="text-md text-neutral-400 mt-4">
              Your access to <strong>ONLY 300</strong> is confirmed.<br />
              Watch your inbox.
            </p>
          </div>
        )}

        <p className="mt-10 text-[10px] text-neutral-500 uppercase tracking-[0.25em] mb-16">
          不正ではなく、進化。— Not a night. An experience. Crafted by CLEOPE.
        </p>
      </div>
    </main>
  );
}
