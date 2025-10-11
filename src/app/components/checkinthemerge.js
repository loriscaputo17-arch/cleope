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
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import Papa from "papaparse";

export default function CheckinPage() {
  const searchParams = useSearchParams();
  const qrEmail = searchParams.get("email");
  const qrCode = searchParams.get("code");

  const [records, setRecords] = useState([]); // Firestore + Sheet
  const [checkins, setCheckins] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [checking, setChecking] = useState(null);
  const [popup, setPopup] = useState(null);

  const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vToPu9CltvMxaCjQNtJar6Fw2Z7o7vW6YwDdAmlR5lc38mRPxk-CzjVqOD82sHg1XVVWINo1LawjP4Q/pub?gid=1941734476&single=true&output=csv";

  // 🔹 Carica Firestore + Sheet
  useEffect(() => {
    async function fetchData() {
      try {
        // Firestore base
        const q1 = query(collection(db, "11oct_merge"), orderBy("createdAt", "desc"));
        const snap1 = await getDocs(q1);
        const bookingsData = snap1.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate
            ? d.data().createdAt.toDate()
            : null,
          source: "firestore",
        }));

        // Google Sheet
        const res = await fetch(SHEET_URL);
        const csvText = await res.text();
        const parsed = Papa.parse(csvText, { header: true });
        const sheetData = parsed.data
          .filter((r) => r["Mail"])
          .map((r, i) => ({
            id: `sheet-${i}`,
            firstName: r["Nome"] || "",
            lastName: r["Cognome"] || "",
            email: r["Mail"] || "",
            phone: r["Telefono"] || "",
            code: "",
            createdAt: r["Data di creazione"]
              ? new Date(r["Data di creazione"])
              : null,
            source: "sheet",
          }));

        // Check-in esistenti
        const q2 = query(collection(db, "11oct_merge_checkin"));
        const snap2 = await getDocs(q2);
        const checkinsData = snap2.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Unisci Firestore + Sheet
        const all = [...bookingsData, ...sheetData];

        // Rimuovi duplicati per email
        const uniqueMap = new Map();
        all.forEach((r) => {
          if (!uniqueMap.has(r.email)) uniqueMap.set(r.email, r);
        });
        const merged = Array.from(uniqueMap.values());

        setRecords(merged);
        setFiltered(merged);
        setCheckins(checkinsData);
      } catch (err) {
        console.error("Errore fetch:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 🔹 Filtro ricerca
  useEffect(() => {
    const term = search.toLowerCase();
    const results = records.filter(
      (r) =>
        r.firstName?.toLowerCase().includes(term) ||
        r.lastName?.toLowerCase().includes(term) ||
        r.email?.toLowerCase().includes(term) ||
        r.phone?.toLowerCase().includes(term) ||
        r.code?.toLowerCase().includes(term)
    );
    setFiltered(results);
  }, [search, records]);

  // 🔹 Check-in automatico da QR
  useEffect(() => {
    if (qrEmail && qrCode) {
      handleCheckin(qrEmail, qrCode, true);
    }
  }, [qrEmail, qrCode]);

  // 🔹 Esegui check-in
  async function handleCheckin(email, code, auto = false) {
    try {
      setChecking(email);

      const user =
        records.find((r) => r.email === email) || {
          firstName: "Guest",
          lastName: "",
          email,
          code: code || "cleope",
        };

      const already = checkins.find((c) => c.email === email);
      if (already) {
        setPopup({
          type: "error",
          text: `⚠️ ${user.firstName} ${user.lastName || ""} è già entrato!`,
        });
        return;
      }

      const newDoc = await addDoc(collection(db, "11oct_merge_checkin"), {
        firstName: user.firstName,
        lastName: user.lastName,
        email,
        code,
        createdAt: serverTimestamp(),
      });

      setPopup({
        type: "success",
        text: `✅ Check-in completato per ${user.firstName} ${user.lastName}`,
      });
      setCheckins((prev) => [...prev, { id: newDoc.id, email, code }]);
    } catch (err) {
      console.error("Errore checkin:", err);
      setPopup({ type: "error", text: "❌ Errore durante il check-in" });
    } finally {
      setChecking(null);
    }
  }

  // 🔹 Rimuovi check-in
  async function handleRemoveCheckin(email) {
    try {
      const q = query(collection(db, "11oct_merge_checkin"), where("email", "==", email));
      const snap = await getDocs(q);

      if (snap.empty) {
        setPopup({ type: "error", text: "Nessun check-in trovato da rimuovere." });
        return;
      }

      const docId = snap.docs[0].id;
      await deleteDoc(doc(db, "11oct_merge_checkin", docId));

      setCheckins((prev) => prev.filter((c) => c.email !== email));
      setPopup({ type: "success", text: `❎ Check-in rimosso per ${email}` });
    } catch (err) {
      console.error(err);
      setPopup({ type: "error", text: "Errore durante la rimozione del check-in." });
    }
  }

  // 🔹 Aggiungi manualmente
  async function handleAddNew(nameOrEmail) {
    try {
      setChecking(nameOrEmail);
      const [first, last] = nameOrEmail.split(" ");
      const newUser = {
        firstName: first || "Guest",
        lastName: last || "",
        email: nameOrEmail.includes("@")
          ? nameOrEmail
          : `${first?.toLowerCase() || "guest"}@noemail.com`,
        code: "manual",
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "11oct_merge_checkin"), newUser);
      setCheckins((prev) => [...prev, newUser]);
      setPopup({
        type: "success",
        text: `✅ Check-in aggiunto manualmente per ${nameOrEmail}`,
      });
    } catch (err) {
      console.error(err);
      setPopup({ type: "error", text: "Errore durante l'aggiunta manuale" });
    } finally {
      setChecking(null);
    }
  }

  function formatDate(date) {
    if (!date) return "-";
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const totalRecords = records.length;
  const totalCheckins = checkins.length;
  const totalMissing = totalRecords - totalCheckins;

  return (
    <main className="min-h-screen w-full bg-black text-white px-4 pt-24 pb-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Check-in – THE MERGE</h1>

        <p className="text-white/70 mb-6">
          Totale prenotati:{" "}
          <span className="font-semibold text-white">{totalRecords}</span> ·
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

        {/* Nessun risultato */}
        {!loading && filtered.length === 0 && search && (
          <div className="text-center mt-8">
            <p className="mb-4 text-white/70">
              Nessun risultato per <strong>{search}</strong>
            </p>
            <button
              onClick={() => handleAddNew(search)}
              className="px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition"
            >
              ➕ Aggiungi e checka ora
            </button>
          </div>
        )}

        {/* Tabella */}
        {loading ? (
          <p>Caricamento dati...</p>
        ) : (
          filtered.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Cognome</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Codice</th>
                    <th className="px-4 py-3">Origine</th>
                    <th className="px-4 py-3">Stato</th>
                    <th className="px-4 py-3">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const recordCheck = checkins.find((c) => c.email === r.email);
                    const isChecked = !!recordCheck;

                    return (
                      <tr
                        key={r.id}
                        className="border-t border-white/10 hover:bg-white/5 transition"
                      >
                        <td className="px-4 py-3">{formatDate(r.createdAt)}</td>
                        <td className="px-4 py-3">{r.firstName}</td>
                        <td className="px-4 py-3">{r.lastName}</td>
                        <td className="px-4 py-3">{r.email}</td>
                        <td className="px-4 py-3 font-mono">{r.code}</td>
                        <td className="px-4 py-3">{r.source}</td>
                        <td className="px-4 py-3">
                          {isChecked ? (
                            <span className="text-green-400 font-semibold">
                              ✔ Entrato
                            </span>
                          ) : (
                            <span className="text-red-400">✘ Non entrato</span>
                          )}
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          {!isChecked ? (
                            <button
                              onClick={() => handleCheckin(r.email, r.code)}
                              disabled={checking === r.email}
                              className="px-3 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 disabled:opacity-50"
                            >
                              {checking === r.email ? "..." : "Check-in"}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRemoveCheckin(r.email)}
                              className="px-3 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600"
                            >
                              🗑️ Rimuovi
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </main>
  );
}
