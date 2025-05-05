"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button, Input } from "@/once-ui/components";
import Link from "next/link";

export default function Events() {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", surname: "", phone: "", email: "" });

  const events = [
    { id: 1, name: "CLEOPE x VOLT Club Milan", date: "27th Mar 2025", type: "volt", special: true },
    { id: 2, name: "INSOMNIA X CLEOPE The Flat by Macan", date: "29th Mar 2025", type: "standard", ticket: "https://www.eventbrite.it/e/insomnia-x-cleope-the-flat-by-macan-tickets-1295655894659?aff=Cleope" },
    { id: 3, name: "Aesthetica Roma", date: "03rd Apr 2025", type: "aesthetica", special: true },
    { id: 4, name: "CLEOPE x VOLT Club Milan", date: "3rd Apr 2025", type: "volt", special: true },
    { id: 5, name: "CLEOPE X BLUE GROOVE ARCA Milano", date: "04th Apr 2025", type: "standard", ticket: "https://dice.fm/event/92yk7n-cleope-x-blue-groove-4th-apr-arca-milano-tickets?lng=it" },
    { id: 6, name: "CLEOPE x VOLT Club Milan", date: "10th Apr 2025", type: "volt", special: true },
    { id: 7, name: "Afrodite x Cleope Downtown Milan", date: "12th Apr 2025", type: "Downtown April 12th", special: true },
    { id: 8, name: "CLEOPE x VOLT Club Milan", date: "17th Apr 2025", type: "Volt 17.04", special: true },
    { id: 9, name: "CLEOPE x Cvlture Salerno", date: "19th Apr 2025", type: "Cleope Fashion Party 19.04", special: true },
    { id: 10, name: "CLEOPE x VOLT Club Milan", date: "24th Apr 2025", type: "Volt 24.04", special: true },
    { id: 11, name: "Aesthetica Roma", date: "26th Apr 2025", type: "Aesthetica 26.04", special: true },
    { id: 12, name: "Afrodite x CLEOPE Downtown Milano", date: "26th Apr 2025", type: "Downtown 26.04", special: true },
    { id: 13, name: "CLEOPE x VOLT Club Milan", date: "1st May 2025", type: "Volt 01.05", special: true },
    { id: 14, name: "Afrodite x CLEOPE Downtown Milano", date: "3rd May 2025", type: "Downtown 03.05", special: true },
    { id: 15, name: "Cleope at Caffe Pascucci Ibiza", date: "3rd May 2025", type: "Pascucci Ibiza 03.05", special: true },
    { id: 16, name: "CLEOPE x Tantra Ibiza", date: "4th May 2025", type: "Tantra Ibiza 04.05", special: true },
    { id: 17, name: "CLEOPE X BLUE GROOVE ARCA Milano", date: "10th May 2025", type: "standard", ticket: "https://dice.fm/event/pyexrl-cleope-x-blue-groove-10th-may-arca-milano-tickets" },
    { id: 18, name: "Afrodite x CLEOPE Downtown Milano", date: "10th May 2025", type: "Downtown 10.05", special: true },
    { id: 19, name: "CLEOPE x VOLT Club Milan", date: "8th May 2025", type: "Volt 08.05", special: true },


  ];

  const getFilteredEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    return events.filter(event => {
      const eventDate = new Date(Date.parse(event.date.replace(/(\d+)(st|nd|rd|th)/, "$1"))); 
      eventDate.setHours(0, 0, 0, 0);

      return eventDate >= today;
    });
  };

  const filteredEvents = getFilteredEvents();

  const handleRegister = async (eventType: string) => {
    if (!formData.name || !formData.surname || !formData.phone) {
      alert("Inserisci tutti i dati richiesti.");
      return;
    }

    try {
      await addDoc(collection(db, "eventRegistrations"), {
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        eventType,
        createdAt: serverTimestamp(),
      });

      alert("Registrazione completata! Ora verrai reindirizzato su WhatsApp.");
      window.location.href = `https://api.whatsapp.com/send/?phone=%2B393513895086&text=Salve!%20Mi%20sono%20registrato%20per%20l'evento%20${encodeURIComponent(eventType)}.%20Ecco%20i%20miei%20dati:%20${encodeURIComponent(formData.name)}%20${encodeURIComponent(formData.surname)},%20${encodeURIComponent(formData.phone)}&type=phone_number&app_absent=0`;
    } catch (error) {
      console.error("Errore:", error);
      alert("Errore durante la registrazione.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Logo */}
      <div className="flex justify-center mb-24">
        <img src="/logo.svg" alt="Logo" className="h-24 w-auto" width={"90px"} height={"90px"} style={{ margin: "auto" }} />
      </div>

      {/* Titolo */}
      <h1 className="text-center text-2xl font-bold mb-24 mt-12">Next Events by CLEOPE</h1>

      {/* Griglia eventi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="bg-gray-800 p-4 rounded-lg text-center" style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
                <p className="text-lg font-semibold mb-2">{event.date}</p>
              </div>

              {event.special ? (
                <Button className="font-regular mb-2" style={{ marginLeft: "auto" }} onClick={() => setActiveEvent(event.type)}>
                  Register
                </Button>
              ) : (
                <a href={event.ticket} target="_blank">
                  <Button>More Info</Button>
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-lg">No upcoming events.</p>
        )}
      </div>

      {/* Popup Registrazione */}
      {activeEvent && (
        <div style={{ position: "fixed", inset: "0", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="bg-gray-900 p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-4" style={{ marginBottom: "1rem" }}>
              Registrazione per {activeEvent}
            </h2>

            <div style={{ marginBottom: "1rem" }}>
              <Input
                formNoValidate
                labelAsPlaceholder
                id="mce-nome"
                name="NOME"
                type="nome"
                label="Nome"
                placeholder="Nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Input
                formNoValidate
                labelAsPlaceholder
                id="mce-cognome"
                name="COGNOME"
                type="cognome"
                label="Cognome"
                placeholder="Cognome"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                className="mb-3"
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Input
                formNoValidate
                labelAsPlaceholder
                id="mce-phone"
                name="PHONE"
                type="phone"
                label="Phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mb-3"
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Input
                formNoValidate
                labelAsPlaceholder
                id="mce-email"
                name="EMAIL"
                type="email"
                label="Email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mb-3"
              />
            </div>

            <div className="flex justify-between" style={{ gap: "1rem" }}>
              <Button onClick={() => setActiveEvent(null)} className="mr-2">
                Annulla
              </Button>
              <Button onClick={() => handleRegister(activeEvent)}>Invia</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
