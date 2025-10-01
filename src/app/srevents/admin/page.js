// /app/book/page.jsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function BookPage() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(collection(db, "srevents_courmayeur_2025"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : null,
          };
        });

        // 🔹 Rimuove duplicati in base all'email
        const uniqueMap = new Map();
        data.forEach((r) => {
          if (!uniqueMap.has(r.email)) {
            uniqueMap.set(r.email, r);
          }
        });
        const uniqueRecords = Array.from(uniqueMap.values());

        setRecords(uniqueRecords);
        setFiltered(uniqueRecords);
      } catch (err) {
        console.error("Errore fetch dati:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      records.filter(
        (r) =>
          r.firstName?.toLowerCase().includes(term) ||
          r.lastName?.toLowerCase().includes(term) ||
          r.email?.toLowerCase().includes(term) ||
          r.phone?.toLowerCase().includes(term) ||
          r.option?.toLowerCase().includes(term)
      )
    );
  }, [search, records]);

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

  async function copyNames() {
    const allNames = records.map((r) => `${r.firstName} ${r.lastName}`).join("\n");
    try {
      await navigator.clipboard.writeText(allNames);
      alert("Nomi copiati negli appunti!");
    } catch (err) {
      console.error("Errore copia:", err);
    }
  }

  return (
    <main className="min-h-screen w-full bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto mt-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Lista Prenotazioni Courmayeur 12-14 Dicembre 2025</h1>

        {/* Contatore */}
        <p className="text-white/70 mb-6">
          Totale unici:{" "}
          <span className="font-semibold text-white">{records.length}</span> record{" "}
          {search && (
            <>
              · Risultati ricerca:{" "}
              <span className="font-semibold text-white">{filtered.length}</span>
            </>
          )}
        </p>

        {/* Barra di ricerca + Bottone copia */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Cerca per nome, email, telefono, opzione..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:outline-none focus:border-white/40 placeholder-white/60 text-sm"
          />
          <button
            onClick={copyNames}
            className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition"
          >
            Copia Nomi
          </button>
        </div>

        {loading ? (
          <p>Caricamento dati...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm md:text-base">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 text-left">Data</th>
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">Cognome</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Telefono</th>
                  <th className="px-4 py-3 text-left">Opzione</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="px-4 py-3">{formatDate(r.createdAt)}</td>
                      <td className="px-4 py-3">{r.firstName}</td>
                      <td className="px-4 py-3">{r.lastName}</td>
                      <td className="px-4 py-3">{r.email}</td>
                      <td className="px-4 py-3">{r.phone}</td>
                      <td className="px-4 py-3 uppercase">{r.option}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-white/60">
                      Nessun risultato trovato
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
