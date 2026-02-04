"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSearchParams } from "next/navigation";

const COLLECTION_RSVP = "inner_route_part_one_rsvp";
const COLLECTION_TABLE = "inner_route_part_one_tables";
const EVENT_DATE = new Date("2026-02-07T20:00:00");

export default function InnerRoutePartOneLanding() {
  const [activeTab, setActiveTab] = useState("access");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [fullName, setFullName] = useState("");
  const [tablePhone, setTablePhone] = useState("");
  const [guests, setGuests] = useState("");
  const [notes, setNotes] = useState("");

  const searchParams = useSearchParams();
  const qParam = searchParams.get("q"); 

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
    setSubmitting(true);

    try {
      if (activeTab === "access") {
        if (!firstName || !lastName || !email)
          return setError("Please complete all required fields.");

        await addDoc(collection(db, COLLECTION_RSVP), {
          firstName,
          lastName,
          email,
          phone,
          q: qParam || null,
          createdAt: serverTimestamp(),
        });


        await fetch("/api/innerroute_sendrequest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            name: `${firstName} ${lastName}`,
          }),
        });
      } else {
        if (!fullName || !tablePhone || !guests)
          return setError("Please complete all required fields.");

        await addDoc(collection(db, COLLECTION_TABLE), {
          fullName,
          phone: tablePhone,
          guests,
          notes,
          q: qParam || null,
          createdAt: serverTimestamp(),
        });

        await fetch("/api/innerroute_sendrequest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            name: `${firstName} ${lastName}`,
          }),
        });
      }

      setSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex items-center justify-center overflow-hidden">

      {/* Monumental Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-center text-[22vw] md:text-[14vw] font-black opacity-[0.03] tracking-tight select-none">
          INNER ROUTE
        </h1>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">

        <img
            src="/logo/logovesper.png"
            alt="VESPER"
            className="w-32 mx-auto mt-10 mb-2"
          />

        <img
          src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/locandine%2Fvesper%2Fintestazione.png?alt=media&token=006a3583-41d5-44e5-a306-c716c142b9d4"
          className="w-90 mb-6 opacity-90"
        />

        <p className="text-[11px] uppercase tracking-[0.4em] text-white/70">
          The Inner Route · Part I
        </p>

        <p className="text-[11px] uppercase tracking-[0.4em] mt-2 text-white/50">
          Saturday February 7th 2026
        </p>
        <p className="text-[11px] uppercase tracking-[0.4em] mb-10 text-white/50">
          Milan ·  Private Party
        </p>

        {/* Countdown */}
        <div className="flex gap-8 mb-6">
          {["days", "hours", "minutes", "seconds"].map((unit, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white-500 drop-shadow-[0_0_8px_#fff]">{timeLeft[unit]}</span>

              <span className="text-[9px] uppercase tracking-[0.25em] opacity-40 mt-1">
                {unit}
              </span>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-12 text-[11px] uppercase tracking-[0.25em] mb-10 cursor-pointer font-bold">
          <button
            onClick={() => { setActiveTab("access"); setSuccess(false); }}
            className={activeTab === "access" ? "text-uppercase  cursor-pointer border-b border-white pb-2" : "opacity-40"}
          >
            RSVP
          </button>
          <button
            onClick={() => { setActiveTab("table"); setSuccess(false); }}
            className={activeTab === "table" ? "text-uppercase font-bold cursor-pointer border-b border-white pb-2" : "opacity-40"}
          >
            BOOK TABLE
          </button>
        </div>

        {!!error && (
          <p className="mb-6 text-xs border border-white/20 px-4 py-2 text-white/70">
            {error}
          </p>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

           {activeTab === "access" ? (
            <>
              <input
                className="innerroute-input"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
              <input
                className="innerroute-input"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
              <input
                className="innerroute-input"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                className="innerroute-input"
                placeholder="Phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </>
          ) : (
            <>
              <input
                className="innerroute-input"
                placeholder="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
              <input
                className="innerroute-input"
                placeholder="Phone"
                value={tablePhone}
                onChange={e => setTablePhone(e.target.value)}
              />
              <input
                className="innerroute-input"
                placeholder="Number of Guests"
                value={guests}
                onChange={e => setGuests(e.target.value)}
              />
              <textarea
                className="innerroute-input textarea"
                placeholder="Notes (optional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </>
          )}


            <button
              type="submit"
              disabled={submitting}
              className="mt-6 border border-white py-3 uppercase tracking-[0.4em] text-xs hover:bg-white hover:text-black transition"
            >
              {submitting ? "Processing…" : "Submit Request"}
            </button>
          </form>
        ) : (
          <div className="mt-6 border border-white/20 px-10 py-10">
            <p className="uppercase tracking-[0.35em] text-sm">
              Request Received
            </p>
            <p className="text-sm text-white/60 mt-4 leading-relaxed">
              Our team will review your request and contact you personally.
            </p>
          </div>
        )}

        <p className="mt-16 text-[9px] uppercase tracking-[0.35em] text-white/40 mb-2">
          A Mediterranean State of Mind
        </p>

        <img
          src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/locandine%2Fvesper%2Ffooterlogo.png?alt=media&token=70997dc8-9d7b-468e-a859-a09b24f9fcc0"
          className="w-90 mt-0 mb-6 opacity-90"
        />
      </div>
    </main>
  );
}
