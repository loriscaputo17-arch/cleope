// /app/book/page.jsx
'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";  // 👈 import
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const COLLECTION_NAME = "11oct_merge";

// data target: 11 ottobre 2025, 00:00
const EVENT_DATE = new Date("2025-10-11T23:45:00");

export default function BookPage() {
  const searchParams = useSearchParams();
  const inviteCode   = searchParams.get("code"); // 👈 prendi il parametro

  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  const [timeLeft, setTimeLeft] = useState({ days:0, hours:0, minutes:0, seconds:0 });
  const [showPopup, setShowPopup] = useState(false);

  // countdown update
  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const diff = EVENT_DATE.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days:0, hours:0, minutes:0, seconds:0 });
        return;
      }

      const days = Math.floor(diff / (1000*60*60*24));
      const hours = Math.floor((diff / (1000*60*60)) % 24);
      const minutes = Math.floor((diff / (1000*60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !phone) {
      setError("Compila tutti i campi.");
      return;
    }

    setSubmitting(true);
    try {
      // 👇 aggiunto inviteCode al payload
      const payload = { 
        firstName, 
        lastName, 
        email, 
        phone, 
        code: inviteCode || null,   // se non c’è → null
        createdAt: serverTimestamp() 
      };

      await addDoc(collection(db, COLLECTION_NAME), payload);
      setShowPopup(true);

      await fetch("/api/send_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "Your RSVP for THE MERGE – Secret Party",
          name: `${firstName} ${lastName}`,
          phone,
          optionLabel: "THE MERGE – Secret Party (Early Access)",
          code: inviteCode || undefined,  // opzionale anche nell'email
        }),
      });

      setFirstName(""); setLastName(""); setEmail(""); setPhone("");
    } catch (err) {
      console.error(err);
      setError("C'è stato un problema. Riprova tra poco.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full bg-[#f0f0f0] text-black overflow-hidden pt-6">

      {/* scritte sparse */}
      <span className="absolute top-16 left-10 rotate-[-15deg] text-[10px] md:text-lg font-bold text-neutral-700">
        SECRET PARTY
      </span>
      <span className="absolute top-32 right-10 z-20 rotate-[15deg] text-[10px] md:text-base font-semibold text-neutral-600">
        LIMITED ACCESS
      </span>
      <span className="absolute top-80 right-4 rotate-[20deg] text-[10px] md:text-base font-bold text-neutral-500">
        UNKNOWN<br/>LOCATION
      </span>
      <span className="absolute top-100 left-12 text-center z-20 rotate-[-10deg] text-[10px] md:text-sm font-bold text-neutral-700 uppercase">
        Invite <br/>your friend
      </span>

      {/* linee geometriche */}
      <div className="absolute bottom-1/3 right-8 w-40 h-[1px] bg-neutral-700 rotate-[90deg] opacity-40"></div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-8 text-center">
        {/* logo principale */}
        <img src="/logo/logowhite.png" alt="Main Logo" className="w-28 md:w-30 invert" />
        <p className="text-[10px] uppercase tracking-widest font-medium">Presents</p>

        {/* titolo */}
        <img src="/images/titlesecretparty.png" alt="Title Secret Party" className="mt-10 w-120 md:w-120" />

        {/* descrizione */}
        <p className="mt-10 max-w-xl text-[14px] md:text-[14px] leading-snug">
          <span className="font-semibold">A new chapter</span> in the Milan electronic scene. <br />
          <span className="font-bold">One city.</span> <span className="font-bold">Six crews.</span> <span className="font-bold">One party.</span> <br />
          This is{" "}
          <span className="font-extrabold tracking-wide">
            THE MERGE.
          </span>{" "}
          <br />
          Entrance via <strong>online ticket</strong>,<br />
          Get the RSVP below.
        </p>

        <div className="mt-8 text-center">
          <div className="flex gap-4 justify-center font-mono text-[20px] text-black tracking-wider">
            <div className="flex flex-col items-center">
              <span className="font-bold">{timeLeft.days}</span>
              <span className="text-[10px] uppercase">Days</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">{timeLeft.hours}</span>
              <span className="text-[10px] uppercase">Hrs</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">{timeLeft.minutes}</span>
              <span className="text-[10px] uppercase">Min</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">{timeLeft.seconds}</span>
              <span className="text-[10px] uppercase">Sec</span>
            </div>
          </div>
        </div>

        {/* error */}
        {!!error && (
          <p className="mt-6 text-sm text-red-500 bg-red-200/50 border border-red-300 rounded-lg p-3">
            {error}
          </p>
        )}

        {/* FORM glass */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 w-full max-w-md flex flex-col gap-4
             bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-lg"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="transform -skew-x-12">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 skew-x-12 bg-white/70 border border-white/30
                   focus:outline-none focus:border-black
                   placeholder-neutral-600 uppercase text-sm"
                required
              />
            </div>

            {/* Cognome */}
            <div className="transform -skew-x-12">
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 skew-x-12 bg-white/70 border border-white/30
                   focus:outline-none focus:border-black
                   placeholder-neutral-600 uppercase text-sm"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="transform -skew-x-12">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 skew-x-12 bg-white/70 border border-white/30
                 focus:outline-none focus:border-black
                 placeholder-neutral-600 uppercase text-sm"
              required
            />
          </div>

          {/* Telefono */}
          <div className="transform -skew-x-12">
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 skew-x-12 bg-white/70 border border-white/30
                 focus:outline-none focus:border-black
                 placeholder-neutral-600 uppercase text-sm"
              required
            />
          </div>

          {/* bottone */}
          <button
            type="submit"
            disabled={submitting}
            className="relative mt-6 px-6 py-3 bg-black/80 text-white font-bold uppercase tracking-widest
               disabled:opacity-60 disabled:cursor-not-allowed
               transform -skew-x-12 hover:bg-black transition cursor-pointer"
          >
            <span className="block skew-x-12">
              {submitting ? "Sending..." : "I'M READY"}
            </span>
          </button>
        </form>

        <p className="mb-12 mt-6 text-xs text-neutral-600 tracking-wide">
          You will receive more details by email after RSVP confirmation.
        </p>

        {showPopup && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
    <div className="bg-white/10 backdrop-blur-md border border-white/30 p-8 max-w-md text-center transform -skew-x-12">
      <div className="skew-x-12">
        <h2 className="text-xl md:text-2xl text-white font-bold uppercase tracking-widest drop-shadow-[0_0_6px_#00ffe0]">
          Secret Party<br></br> Confirmed
        </h2>
        <p className="mt-4 text-sm md:text-base text-neutral-200">
          Your <strong>RSVP has been received</strong>.  <br></br>
          You will get an email shortly with more details. <br></br> 
          Stay tuned — the location remains a mystery.
        </p>
        <button
          onClick={() => setShowPopup(false)}
          className="mt-6 px-6 py-2 bg-black/80 text-white font-bold uppercase tracking-wider transform -skew-x-12 hover:bg-black transition cursor-pointer"
        >
          <span className="block skew-x-12">Close</span>
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </main>
  );
}
