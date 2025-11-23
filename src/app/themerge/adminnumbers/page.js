"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function BookPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(collection(db, "11oct_merge"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            firstName: d.firstName || "",
            lastName: d.lastName || "",
            phone: d.phone || "",
            email: d.email || "",
          };
        });

        // 🔹 Rimuove duplicati per email o telefono (a seconda della tua preferenza)
        const unique = Array.from(
          new Map(data.map((r) => [r.email || r.phone, r])).values()
        ).filter((r) => r.email || r.phone);

        setRecords(unique);
      } catch (err) {
        console.error("Errore fetch dati Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 🔹 Copia tutti i numeri (opzionale)
  const copyAllPhones = async () => {
    try {
      const text = records.map((r) => r.phone).join("\n");
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Errore copia:", err);
      alert("Errore durante la copia dei numeri");
    }
  };

  // 🔹 Scarica CSV
  const downloadCSV = () => {
    const header = ["First Name", "Last Name", "Phone", "Email"];
    const rows = records.map((r) => [
      r.firstName,
      r.lastName,
      r.phone,
      r.email,
    ]);

    // Costruisci CSV
    const csvContent =
      [header, ...rows]
        .map((row) =>
          row
            .map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "contatti_11ott2025.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen w-full bg-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto mt-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          📇 Contatti – Lista 11 Ott 2025
        </h1>

        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <p className="text-white/70">
            Totale contatti:{" "}
            <span className="font-semibold text-white">{records.length}</span>
          </p>

          <div className="flex gap-3">
            <button
              onClick={copyAllPhones}
              disabled={loading || records.length === 0}
              className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition disabled:opacity-50"
            >
              {copied ? "✅ Copiato!" : "Copia numeri"}
            </button>

            <button
              onClick={downloadCSV}
              disabled={loading || records.length === 0}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition disabled:opacity-50"
            >
              ⬇️ Scarica CSV
            </button>
          </div>
        </div>

        {loading ? (
          <p>Caricamento contatti...</p>
        ) : records.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm md:text-base">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 text-left w-16">#</th>
                  <th className="px-4 py-3 text-left">First Name</th>
                  <th className="px-4 py-3 text-left">Last Name</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, idx) => (
                  <tr
                    key={r.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{r.firstName}</td>
                    <td className="px-4 py-3">{r.lastName}</td>
                    <td className="px-4 py-3">{r.phone}</td>
                    <td className="px-4 py-3">{r.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white/60 mt-6 text-center">
            Nessun contatto trovato
          </p>
        )}
      </div>
    </main>
  );
}
