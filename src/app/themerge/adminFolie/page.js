"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Papa from "papaparse";

export default function BookPage() {
  const [sheetRecords, setSheetRecords] = useState([]);
  const [sheetFiltered, setSheetFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(null);

  const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vToPu9CltvMxaCjQNtJar6Fw2Z7o7vW6YwDdAmlR5lc38mRPxk-CzjVqOD82sHg1XVVWINo1LawjP4Q/pub?gid=1941734476&single=true&output=csv";

  // 🔹 Fetch Google Sheet CSV
  useEffect(() => {
    async function fetchSheet() {
      try {
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();

        const parsed = Papa.parse(csvText, { header: true });
        const data = parsed.data
          .map((row, idx) => ({
            id: idx,
            createdAt: row["Data di creazione"]
              ? new Date(row["Data di creazione"])
              : null,
            firstName: row["Nome"] || "",
            lastName: row["Cognome"] || "",
            email: row["Mail"] || "",
            phone: row["Telefono"] || "",
            code:
              Math.random().toString(36).substring(2, 8).toUpperCase(), // 🔹 Genera codice unico
          }))
          .filter((r) => r.email);

        setSheetRecords(data);
        setSheetFiltered(data);
      } catch (err) {
        console.error("Errore fetch sheet:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSheet();
  }, []);

  // 🔹 Filtro ricerca
  useEffect(() => {
    const term = search.toLowerCase();
    setSheetFiltered(
      sheetRecords.filter(
        (r) =>
          r.firstName?.toLowerCase().includes(term) ||
          r.lastName?.toLowerCase().includes(term) ||
          r.email?.toLowerCase().includes(term) ||
          r.phone?.toLowerCase().includes(term)
      )
    );
  }, [search, sheetRecords]);

  // 🔹 Importa su Firestore
  async function importSheetToFirestore() {
    try {
      for (const row of sheetRecords) {
        await addDoc(collection(db, "11oct_merge_sheet"), {
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email,
          phone: row.phone,
          code: row.code,
          createdAt: row.createdAt || serverTimestamp(),
          confirmed: false,
        });
      }
      alert("✅ Dati importati su Firestore!");
    } catch (err) {
      console.error("Errore importazione:", err);
      alert("❌ Errore durante l'importazione");
    }
  }

  // 🔹 Invia invito con QR
  async function sendInvite(r) {
    try {
      setSending(r.id);
      const res = await fetch("/api/send_invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: r.email,
          name: `${r.firstName} ${r.lastName}`,
          code: r.code,
        }),
      });

      if (!res.ok) throw new Error("Errore invio");
      alert(`✅ Invito inviato a ${r.email}`);
    } catch (err) {
      console.error("Errore invio email:", err);
      alert("❌ Errore durante l'invio dell'invito");
    } finally {
      setSending(null);
    }
  }

  return (
    <main className="min-h-screen w-full bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto mt-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Lista Invitati THE MERGE – 11 Ott 2025
        </h1>

        {/* 🔍 Barra di ricerca */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Cerca per nome, email o telefono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:outline-none focus:border-white/40 placeholder-white/60 text-sm"
          />
          <button
            onClick={importSheetToFirestore}
            className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
          >
            Importa in Firestore
          </button>
        </div>

        {/* 🔹 Tabella unica da Google Sheets */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Cognome</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Telefono</th>
                <th className="px-4 py-3 text-left">Codice</th>
                <th className="px-4 py-3 text-left">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-white/60 py-6"
                  >
                    Caricamento dati...
                  </td>
                </tr>
              ) : sheetFiltered.length > 0 ? (
                sheetFiltered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3">{r.firstName}</td>
                    <td className="px-4 py-3">{r.lastName}</td>
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">{r.phone}</td>
                    <td className="px-4 py-3 font-mono">{r.code}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => sendInvite(r)}
                        disabled={sending === r.id}
                        className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition disabled:opacity-50"
                      >
                        {sending === r.id ? "Invio..." : "Invia Invito"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-white/60 py-6"
                  >
                    Nessun risultato trovato
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
