"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import Papa from "papaparse";

export default function BookPage() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(null);

  // 🔹 Stati per la seconda tabella (Google Sheets)
  const [sheetRecords, setSheetRecords] = useState([]);
  const [sheetFiltered, setSheetFiltered] = useState([]);
  const [loadingSheet, setLoadingSheet] = useState(true);

  const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vToPu9CltvMxaCjQNtJar6Fw2Z7o7vW6YwDdAmlR5lc38mRPxk-CzjVqOD82sHg1XVVWINo1LawjP4Q/pub?gid=1941734476&single=true&output=csv";

  // 🔹 Fetch Firestore
  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(collection(db, "11oct_merge"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : null,
          };
        });

        // Rimuove duplicati per email
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
        console.error("Errore fetch dati Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
            code: "", // non esiste nel CSV
          }))
          .filter((r) => r.email);

        setSheetRecords(data);
        setSheetFiltered(data);
      } catch (err) {
        console.error("Errore fetch sheet:", err);
      } finally {
        setLoadingSheet(false);
      }
    }
    fetchSheet();
  }, []);

  // 🔹 Filtro ricerca per Firestore
  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      records.filter(
        (r) =>
          r.firstName?.toLowerCase().includes(term) ||
          r.lastName?.toLowerCase().includes(term) ||
          r.email?.toLowerCase().includes(term) ||
          r.phone?.toLowerCase().includes(term) ||
          r.code?.toLowerCase().includes(term)
      )
    );
  }, [search, records]);

  // 🔹 Filtro ricerca per Sheet
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

  async function sendEmail(r) {
    try {
      setSending(r.id);
      await fetch("/api/send_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: r.email,
          subject: "Your RSVP for THE MERGE – Secret Party",
          name: `${r.firstName} ${r.lastName}`,
          phone: r.phone,
          optionLabel: "THE MERGE – Secret Party (Early Access)",
          code: r.code || undefined,
        }),
      });
      alert(`Email inviata a ${r.email}`);
    } catch (err) {
      console.error("Errore invio email:", err);
      alert("Errore durante l'invio dell'email");
    } finally {
      setSending(null);
    }
  }

    async function importSheetToFirestore() {
  try {
    for (const row of sheetRecords) {
      await addDoc(collection(db, "11oct_merge_sheet"), {
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        phone: row.phone,
        code: row.code || "",
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

  // 🔹 UI Table component (riusabile)
  const Table = ({ title, data, loading, totalCount }) => (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <p className="text-white/70 mb-4">
        Totale:{" "}
        <span className="font-semibold text-white">{totalCount}</span> record{" "}
        {search && (
          <>
            · Risultati ricerca:{" "}
            <span className="font-semibold text-white">{data.length}</span>
          </>
        )}
      </p>
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
                <th className="px-4 py-3 text-left">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3">{r.firstName}</td>
                    <td className="px-4 py-3">{r.lastName}</td>
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">{r.phone}</td>
                    <td className="px-4 py-3 uppercase">{r.code}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => sendEmail(r)}
                        disabled={sending === r.id}
                        className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition disabled:opacity-50"
                      >
                        {sending === r.id ? "Invio..." : "Invia Email"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-white/60">
                    Nessun risultato trovato
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen w-full bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto mt-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Lista Prenotazioni 11 Ott 2025</h1>

        {/* Barra di ricerca */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Cerca per nome, email, telefono, opzione..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:outline-none focus:border-white/40 placeholder-white/60 text-sm"
          />
        </div>

        {/* 🔹 Tabella Firestore */}
        <Table
          title="Prenotazioni da Firestore"
          data={filtered}
          loading={loading}
          totalCount={records.length}
        />

        <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-bold">Prenotazioni da Google Sheets</h2>
  <button
    onClick={importSheetToFirestore}
    className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
  >
    Importa in Firestore
  </button>
</div>

        {/* 🔹 Tabella Google Sheets */}
        <Table
          title="Prenotazioni da Google Sheets"
          data={sheetFiltered}
          loading={loadingSheet}
          totalCount={sheetRecords.length}
        />
      </div>
    </main>
  );
}
