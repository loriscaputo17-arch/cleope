"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

export default function CheckinPage() {
  const searchParams = useSearchParams();
  const qrEmail = searchParams.get("email");
  const qrCode = searchParams.get("code");

  const [bookings, setBookings] = useState([]); 
  const [checkins, setCheckins] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [checking, setChecking] = useState(null);
  const [popup, setPopup] = useState(null);

  // Carica prenotazioni + check-in
  useEffect(() => {
    async function fetchData() {
      try {
        const q1 = query(collection(db, "11oct_merge"), orderBy("createdAt", "desc"));
        const snap1 = await getDocs(q1);
        const bookingsData = snap1.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate() : null,
        }));

        const q2 = query(collection(db, "11oct_merge_checkin"));
        const snap2 = await getDocs(q2);
        const checkinsData = snap2.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setBookings(bookingsData);
        setCheckins(checkinsData);
        setFiltered(bookingsData);
      } catch (err) {
        console.error("Errore fetch:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filtro ricerca
  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      bookings.filter(
        (r) =>
          r.firstName?.toLowerCase().includes(term) ||
          r.lastName?.toLowerCase().includes(term) ||
          r.email?.toLowerCase().includes(term) ||
          r.phone?.toLowerCase().includes(term) ||
          r.code?.toLowerCase().includes(term)
      )
    );
  }, [search, bookings]);

  // Auto check-in da QR
  useEffect(() => {
    if (qrEmail && qrCode) {
      handleCheckin(qrEmail, qrCode, true);
    }
  }, [qrEmail, qrCode]);

  // Funzione di check-in
  async function handleCheckin(email, code, auto = false) {
    try {
      setChecking(email);
      const q = query(collection(db, "11oct_merge"), where("email", "==", email));
      const snap = await getDocs(q);
      if (snap.empty) {
        setPopup({ type: "error", text: "❌ Nessun utente trovato" });
        return;
      }

      const user = snap.docs[0].data();
      const already = checkins.find((c) => c.email === email);
      if (already) {
        setPopup({ type: "error", text: `⚠️ ${user.firstName} ${user.lastName} è già entrato!` });
        return;
      }

      await addDoc(collection(db, "11oct_merge_checkin"), {
        firstName: user.firstName,
        lastName: user.lastName,
        email,
        code,
        createdAt: serverTimestamp(),
      });

      setPopup({ type: "success", text: `✅ Check-in completato per ${user.firstName} ${user.lastName}` });
      setCheckins((prev) => [...prev, { email, code }]);
    } catch (err) {
      console.error("Errore checkin:", err);
      setPopup({ type: "error", text: "❌ Errore durante il check-in" });
    } finally {
      setChecking(null);
    }
  }

  function formatDate(date) {
    if (!date) return "-";
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  const totalBookings = bookings.length;
  const totalCheckins = checkins.length;
  const totalMissing = totalBookings - totalCheckins;

  return (
    <main className="min-h-screen w-full bg-black text-white px-4 pt-24 pb-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Check-in – THE MERGE</h1>

        {/* Totali */}
        <p className="text-white/70 mb-6">
          Totale prenotati:{" "}
          <span className="font-semibold text-white">{totalBookings}</span> ·
          Checkati:{" "}
          <span className="font-semibold text-green-400">{totalCheckins}</span> ·
          Mancanti:{" "}
          <span className="font-semibold text-red-400">{totalMissing}</span>
        </p>

        {/* Popup */}
        {popup && (
          <div
            className={`mb-6 p-4 rounded-lg font-semibold ${
              popup.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {popup.text}
            <button className="ml-4 underline" onClick={() => setPopup(null)}>
              Chiudi
            </button>
          </div>
        )}

        {/* Ricerca */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Cerca per nome, email o codice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/15 placeholder-white/60 text-sm"
          />
        </div>

        {loading ? (
          <p>Caricamento dati...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm md:text-base">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3">Data Prenotazione</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Cognome</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Telefono</th>
                  <th className="px-4 py-3">Codice</th>
                  <th className="px-4 py-3">Stato</th>
                  <th className="px-4 py-3">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const isChecked = checkins.some((c) => c.email === r.email);
                  return (
                    <tr key={r.id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="px-4 py-3">{formatDate(r.createdAt)}</td>
                      <td className="px-4 py-3">{r.firstName}</td>
                      <td className="px-4 py-3">{r.lastName}</td>
                      <td className="px-4 py-3">{r.email}</td>
                      <td className="px-4 py-3">{r.phone}</td>
                      <td className="px-4 py-3 font-mono">{r.code}</td>
                      <td className="px-4 py-3">
                        {isChecked ? (
                          <span className="text-green-400 font-semibold">✔ Entrato</span>
                        ) : (
                          <span className="text-red-400">✘ Non entrato</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {!isChecked && (
                          <button
                            onClick={() => handleCheckin(r.email, r.code)}
                            disabled={checking === r.email}
                            className="px-4 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 disabled:opacity-50"
                          >
                            {checking === r.email ? "Checking..." : "Check-in"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
