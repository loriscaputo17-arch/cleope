"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  orderBy,
} from "firebase/firestore";

export default function CheckinPage() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [beforeCount, setBeforeCount] = useState(0);
  const [afterCount, setAfterCount] = useState(0);

  useEffect(() => {
    async function fetchCheckins() {
      try {
        const q = query(collection(db, "11oct_merge_checkin"), orderBy("createdAt", "asc"));
        const snap = await getDocs(q);

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate() : null,
        }));

        setCheckins(data);

        // 🔹 Calcolo "prima e dopo l'una"
        const cutoff = new Date("2025-10-12T01:00:00+02:00"); // 12 ottobre 2025 ore 01:00 (UTC+2)
        let before = 0;
        let after = 0;

        data.forEach((c) => {
          if (c.createdAt) {
            if (c.createdAt < cutoff) before++;
            else after++;
          }
        });

        setBeforeCount(before);
        setAfterCount(after);
      } catch (err) {
        console.error("Errore nel caricamento check-in:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCheckins();
  }, []);

  function formatDate(date) {
    if (!date) return "-";
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return (
    <main className="min-h-screen w-full bg-black text-white px-4 pt-24 pb-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Check-in – THE MERGE</h1>

        {loading ? (
          <p>Caricamento dati...</p>
        ) : (
          <>
            <p className="text-white/70 mb-6">
              Totale check-in:{" "}
              <span className="font-semibold text-green-400">{checkins.length}</span> ·{" "}
              Prima dell'una:{" "}
              <span className="font-semibold text-blue-400">{beforeCount}</span> ·{" "}
              Dopo l'una:{" "}
              <span className="font-semibold text-yellow-400">{afterCount}</span>
            </p>

            {checkins.length === 0 ? (
              <p>Nessun check-in trovato.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm md:text-base">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3">Nome</th>
                      <th className="px-4 py-3">Cognome</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Codice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkins.map((c) => (
                      <tr
                        key={c.id}
                        className="border-t border-white/10 hover:bg-white/5 transition"
                      >
                        <td className="px-4 py-3">{formatDate(c.createdAt)}</td>
                        <td className="px-4 py-3">{c.firstName}</td>
                        <td className="px-4 py-3">{c.lastName}</td>
                        <td className="px-4 py-3">{c.email}</td>
                        <td className="px-4 py-3 font-mono">{c.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
