'use client'

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Mail, User, Phone, GraduationCap } from "lucide-react";

export default function FormPage() {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    cdl: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await addDoc(collection(db, "srevents_courmayeur_2025"), {
        ...formData,
        createdAt: Timestamp.now(),
      });
      setSuccess(true);
      setFormData({
        nome: "",
        cognome: "",
        email: "",
        telefono: "",
        cdl: "",
      });
    } catch (err) {
      console.error("Errore durante il salvataggio:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-gradient-to-br from-black via-neutral-900 to-black">
      {/* sfondo animato con sfumature */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl top-10 left-10 animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse" />
      </div>

      {/* card effetto vetro */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-white">
        <div className="w-24 h-24 mb-4 rounded-full overflow-hidden shadow-lg mx-auto">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/logos%2Flogosrevents.jpg?alt=media&token=a71acccc-fdf4-4d7c-a791-9079575bd98f" // metti il tuo file qui
            alt="Logo Courmayeur"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-3xl text-center mb-6"><strong>COURMAYEUR</strong> <span className="italic">2025</span></h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 focus-within:ring-2 focus-within:ring-blue-500">
            <User size={20} className="text-neutral-400" />
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent outline-none text-white placeholder-neutral-400"
            />
          </div>

          {/* Cognome */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 focus-within:ring-2 focus-within:ring-blue-500">
            <User size={20} className="text-neutral-400" />
            <input
              type="text"
              name="cognome"
              placeholder="Cognome"
              value={formData.cognome}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent outline-none text-white placeholder-neutral-400"
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 focus-within:ring-2 focus-within:ring-blue-500">
            <Mail size={20} className="text-neutral-400" />
            <input
              type="email"
              name="email"
              placeholder="@E-mail"
              value={formData.email}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent outline-none text-white placeholder-neutral-400"
            />
          </div>

          {/* Telefono */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 focus-within:ring-2 focus-within:ring-blue-500">
            <Phone size={20} className="text-neutral-400" />
            <input
              type="tel"
              name="telefono"
              placeholder="Numero di telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent outline-none text-white placeholder-neutral-400"
            />
          </div>

          {/* CdL */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 focus-within:ring-2 focus-within:ring-blue-500">
            <GraduationCap size={20} className="text-neutral-400" />
            <input
              type="text"
              name="cdl"
              placeholder="CdL di appartenenza"
              value={formData.cdl}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent outline-none text-white placeholder-neutral-400"
            />
          </div>

          {/* bottone */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-500/80 hover:bg-blue-600 transition font-semibold text-white shadow-md disabled:opacity-50"
          >
            {loading ? "Invio..." : "Invia"}
          </button>
        </form>

        {success && (
          <p className="text-green-400 text-center mt-4">
            ✅ Registrazione completata! Ci vediamo a Courma.
          </p>
        )}
      </div>
    </main>
  );
}
