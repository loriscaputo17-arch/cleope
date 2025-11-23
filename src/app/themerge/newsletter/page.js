"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function NewsletterPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carica dati da Firestore
  useEffect(() => {
    async function fetchNewsletter() {
      try {
        const q = query(collection(db, "newsletter"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        const data = snap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : null,
            email: d.email || "",
            firstName: d.firstName || "",
            lastName: d.lastName || "",
            phone: d.phone || "",
          };
        });

        // 🔹 Rimuove duplicati per email
        const uniqueMap = new Map();
        data.forEach((r) => {
          if (r.email && !uniqueMap.has(r.email)) {
            uniqueMap.set(r.email, r);
          }
        });

        setRecords(Array.from(uniqueMap.values()));
      } catch (err) {
        console.error("Errore fetch newsletter:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNewsletter();
  }, []);

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

  // 🔹 Funzione per scaricare CSV
  function downloadCSV() {
    if (records.length === 0) return;

    // intestazioni
    const headers = ["Email", "FirstName", "LastName", "Phone"];
    const rows = records.map((r) => [r.email, r.firstName, r.lastName, r.phone]);

    const csvContent =
      [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "newsletter_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <main className="min-h-screen w-full bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto mt-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Iscritti Newsletter</h1>

        <p className="text-white/70 mb-4">
          Totale unici:{" "}
          <span className="font-semibold text-white">{records.length}</span>
        </p>

        <button
          onClick={downloadCSV}
          className="mb-6 px-6 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
        >
          Scarica CSV per Brevo
        </button>

        {loading ? (
          <p>Caricamento dati...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm md:text-base">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 text-left">Data</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">Cognome</th>
                  <th className="px-4 py-3 text-left">Telefono</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">{r.firstName}</td>
                    <td className="px-4 py-3">{r.lastName}</td>
                    <td className="px-4 py-3">{r.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
