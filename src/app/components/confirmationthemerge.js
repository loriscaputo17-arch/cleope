'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { updateDoc, collection, query, where, getDocs } from "firebase/firestore";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    async function confirmRSVP() {
      try {
        let snap;

        // 🔹 1. cerca in 11oct_merge
        let q = query(collection(db, "11oct_merge"), where("email", "==", email));
        snap = await getDocs(q);

        // 🔹 2. se non trova nulla, cerca in 11oct_merge_sheet
        if (snap.empty) {
          q = query(collection(db, "11oct_merge_sheet"), where("email", "==", email));
          snap = await getDocs(q);
        }

        if (!snap.empty) {
          const docRef = snap.docs[0].ref;
          const data = snap.docs[0].data();

          // aggiorna conferma
          await updateDoc(docRef, { confirmed: true });
          setConfirmed(true);

          // genera codice univoco 6 cifre
          const uniqueCode = Math.floor(100000 + Math.random() * 900000).toString();

          // invio seconda mail con QR + dettagli
          await fetch("/api/send_invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: email,
              name: `${data.firstName} ${data.lastName}`,
              code: uniqueCode,
            }),
          });
        }
      } catch (err) {
        console.error("Errore conferma:", err);
      } finally {
        setLoading(false);
      }
    }

    confirmRSVP();
  }, [email]);

  return (
    <main className="relative min-h-screen w-full bg-[#f0f0f0] text-black overflow-hidden pt-6">

      {/* scritte sparse */}
      <span className="absolute top-16 left-10 rotate-[-15deg] text-[10px] md:text-lg font-bold text-neutral-700">
        CONFIRMED
      </span>
      <span className="absolute top-32 right-10 z-20 rotate-[15deg] text-[10px] md:text-base font-semibold text-neutral-600">
        ENTRY GRANTED
      </span>
      <span className="absolute top-80 right-4 rotate-[20deg] text-[10px] md:text-base font-bold text-neutral-500">
        QR CODE<br/>REQUIRED
      </span>
      <span className="absolute top-100 left-12 text-center z-20 rotate-[-10deg] text-[10px] md:text-sm font-bold text-neutral-700 uppercase">
        Party<br/>Details
      </span>

      {/* linea geometrica */}
      <div className="absolute bottom-1/3 right-8 w-40 h-[1px] bg-neutral-700 rotate-[90deg] opacity-40"></div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-8 text-center">

        {/* logo */}
        <img src="/logo/logowhite.png" alt="Main Logo" className="w-28 md:w-30 invert" />
        <p className="text-[10px] uppercase tracking-widest font-medium">Presents</p>

        {/* titolo */}
        <img src="/images/titlesecretparty.png" alt="Title Secret Party" className="mt-10 w-120 md:w-120" />

        {/* MESSAGGIO */}
        {loading ? (
          <p className="mt-10 text-lg font-medium">Stiamo verificando la tua conferma...</p>
        ) : confirmed ? (
          <>
            <h1 className="mt-12 text-2xl md:text-3xl font-bold uppercase tracking-widest drop-shadow-[0_0_6px_#00ffe0]">
              Conferma ricevuta ✅
            </h1>
            <p className="mt-4 max-w-xl text-[14px] md:text-[15px] leading-snug">
              Grazie <strong>per aver confermato la tua presenza</strong> a{" "}
              <span className="font-extrabold">THE MERGE</span>. <br/>
              Ti abbiamo inviato una <strong>seconda email</strong> con il tuo <strong>QR Code personale</strong>.
              Il ticket é acquistabile all'ingresso.
            </p>

            {/* INFO GLASS */}
            <div className="mt-10 w-full max-w-md px-8
                bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-lg transform -skew-x-12">
              <div className="skew-x-12">
                <h2 className="text-xl font-bold uppercase mb-4">Dettagli Evento</h2>
                <ul className="space-y-2 text-sm md:text-base">
                  <li><strong>Evento:</strong> THE MERGE – Secret Party</li>
                  <li><strong>Data:</strong> Sabato 11 Ottobre 2025</li>
                  <li><strong>Orario:</strong> 23:30 – 04:30</li>
                  <li><strong>Luogo:</strong> Via Tortona, 27, 20144 Milano MI</li>
                </ul>
                <p className="mt-4 text-red-500 font-bold">
                  Data l'elevata affluenza, ti invitiamo a presentarti in anticipo per facilitare l’ingresso. Capienza limitata.
                </p>
              </div>
            </div>

            <p className="mb-12 mt-6 text-xs text-neutral-600 tracking-wide">
              Riceverai anche un link per aggiungere l’evento al tuo calendario.
            </p>
          </>
        ) : (
          <p className="mt-10 text-lg font-medium">Nessuna conferma trovata.</p>
        )}
      </div>
    </main>
  );
}
