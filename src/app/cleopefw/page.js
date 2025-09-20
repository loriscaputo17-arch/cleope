// /app/book/page.jsx
'use client';

import { useState } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const COLLECTION_NAME = "25_sett_cleope";
const TICKET_URL = "https://www.ticketnation.it/milano/cvlture-milan-fashion-week-spazio-diaz.6328?s=pr223293";

export default function BookPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [option, setOption]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fullName = `${firstName} ${lastName}`.trim();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !phone || !option) {
      setError("Compila tutti i campi e seleziona un'opzione.");
      return;
    }

    setSubmitting(true);
    try {
      // 1) Salva su Firestore
      const payload = {
        firstName,
        lastName,
        email,
        phone,
        option,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, COLLECTION_NAME), payload);

      // 2) Flusso in base all'opzione
      if (option === "cleope") {
        await fetch("/api/send_email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            subject: "Conferma prenotazione CLEOPE",
            name: fullName,
            phone,
            optionLabel: "CLEOPE (21:00 - 00:00) – Free entry",
          }),
        });
        alert("Richiesta inviata! Ti abbiamo mandato una mail di conferma.");
      } else {
        // redirect a Ticketnation
        window.location.href = TICKET_URL;
      }

      // 3) Reset form (solo se non hai fatto redirect)
      if (option === "cleope") {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setOption("");
      }
    } catch (err) {
      console.error(err);
      setError("C'è stato un problema. Riprova tra poco.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-black text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg mt-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
          {/* Foto rettangolare in cima */}
          <div className="relative w-full aspect-[1/1]">
            <Image
              src="https://www.ticketnation.it/images/cvlture-milan-fashion-week-spazio-diaz.600x600.7290.webp"
              alt="CLEOPE"
              fill
              className="object-cover"
              priority
            />
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-center">
                RSVP 25th September
              </h1>
              <p className="text-md text-center">
                Milan Fashion Week
              </p>
            </div>
            

            {!!error && (
              <p className="text-sm text-red-400 bg-red-950/40 border border-red-500/30 rounded-lg p-3">
                {error}
              </p>
            )}

            {/* Nome Cognome */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:outline-none focus:border-white/40 placeholder-white/60 uppercase text-sm"
                required
              />
              <input
                type="text"
                placeholder="Cognome"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:outline-none focus:border-white/40 placeholder-white/60 uppercase text-sm"
                required
              />
            </div>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:outline-none focus:border-white/40 placeholder-white/60 uppercase text-sm"
              required
            />

            {/* Telefono */}
            <input
              type="tel"
              placeholder="Telefono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:outline-none focus:border-white/40 placeholder-white/60 uppercase text-sm"
              required
            />

            {/* Opzioni */}
            <fieldset className="space-y-3">
              <legend className="uppercase text-xs tracking-widest text-white/70 mb-2">
                Seleziona un&apos;opzione
              </legend>

              <label className="flex items-start gap-3 p-4 rounded-xl bg-black/40 border border-white/15 hover:border-white/35 cursor-pointer">
                <input
                  type="radio"
                  name="option"
                  value="cleope"
                  checked={option === "cleope"}
                  onChange={() => setOption("cleope")}
                  className="mt-1"
                  required
                />
                <div>
                  <div className="font-semibold">CLEOPE</div>
                  <div className="text-sm text-white/70">21:00 - 00:00 · Free entry</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl bg-black/40 border border-white/15 hover:border-white/35 cursor-pointer">
                <input
                  type="radio"
                  name="option"
                  value="cleope_cvlture"
                  checked={option === "cleope_cvlture"}
                  onChange={() => setOption("cleope_cvlture")}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold">CLEOPE + CVLTURE PARTY</div>
                  <div className="text-sm text-white/70">21:00 - 05:00 · Acquista il ticket nella pagina successiva</div>
                </div>
              </label>
            </fieldset>

            {/* Conferma */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 cursor-pointer inline-flex justify-center items-center px-6 py-3 rounded-full bg-white text-black uppercase text-xs tracking-widest hover:bg-neutral-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Invio…" : "Conferma"}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}
