'use client'

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

export default function CalendarPage() {
  const currentYear = new Date().getFullYear();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [events, setEvents] = useState([]);

useEffect(() => {
  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const fetchedEvents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Ordina per data decrescente (più recente prima)
    fetchedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    console.log(fetchedEvents);
    setEvents(fetchedEvents);
  };

  fetchEvents();
}, []);


  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getMonth() === selectedMonth &&
      eventDate.getFullYear() === selectedYear
    );
  });

  return (
    <main className="md:max-w-[80vw] max-w-[90vw] mx-auto min-h-screen bg-black text-white px-4 py-12 md:px-12">
      {/* Tabs Mesi & Tendina Anno */}
      <div className="flex flex-wrap items-center gap-4 mb-8 mt-12">
        {months.map((month, idx) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(idx)}
            className={`px-4 py-2 uppercase text-xs tracking-widest border-b-2 ${
              idx === selectedMonth ? "border-white" : "border-transparent"
            } hover:border-white transition cursor-pointer`}
          >
            {month}
          </button>
        ))}

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="bg-black border border-neutral-600 px-4 py-2 uppercase text-xs tracking-widest cursor-pointer"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <option key={i} value={currentYear + i}>
              {currentYear + i}
            </option>
          ))}
        </select>
      </div>

      {/* Contenuto Calendar */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Tabella Giorni/Eventi */}
        <div className="w-full md:w-2/3">
          <table className="w-full text-left border-t border-neutral-700">
            <thead>
              <tr className="uppercase text-xs text-neutral-400 border-b border-neutral-700">
                <th className="py-2">Date</th>
                <th>Event</th>
                <th>Tag</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <tr
                    key={event.id}
                    className="border-b border-neutral-700 cursor-pointer hover:bg-neutral-900 transition"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <td className="py-4">
                      {new Date(event.date).toLocaleDateString("it-IT", {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                      })}
                    </td>
                    <td className="font-bold">{event.title}</td>
                    <td>{event.tag}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-neutral-400">
                    No events for this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pannello Anteprima */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg">
          {selectedEvent ? (
            <div className="flex flex-col gap-2">
              <img
                src={selectedEvent.img ? selectedEvent.img : "https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0500.JPG?alt=media&token=77c85fc7-766b-43fe-be1e-cfb36bf82dea"}

                alt={selectedEvent.title}
                className="w-full h-80 object-cover rounded-md"
              />
              <h3 className="text-xl text-black font-bold">{selectedEvent.title}</h3>
                <p className="text-black text-md">
                  {new Date(selectedEvent.date).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              <p className="text-xs text-black uppercase">{selectedEvent.tag}</p>
              <button
                className="mt-4 bg-black text-white px-4 py-2 uppercase text-xs tracking-widest cursor-pointer rounded-md"
                onClick={() => setShowPopup(true)}
              >
                Book Now
              </button>
            </div>
          ) : (
            <p className="text-neutral-400">Select an event to see details.</p>
          )}
        </div>
      </div>

      {showPopup && selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur flex items-center justify-center px-4">
          <div className="relative w-full max-w-2xl bg-black rounded-lg overflow-hidden">
            <img
              src={selectedEvent.img ? selectedEvent.img : "https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0500.JPG?alt=media&token=77c85fc7-766b-43fe-be1e-cfb36bf82dea"}
              alt={selectedEvent.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 text-white">
              <span className="inline-block bg-white/10 text-xs px-3 py-1 rounded-full backdrop-blur-sm mb-4">
                {selectedEvent.tag}
              </span>
              <h3 className="text-2xl font-bold mb-2">{selectedEvent.title}</h3>
              <div className="flex items-center text-sm mb-4">
                <p className="text-white text-md">
                  {new Date(selectedEvent.date).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>

                <span className="ml-auto">{selectedEvent.time}</span>
              </div>
              <p className="text-sm mb-6">{selectedEvent.description}</p>
              <div className="flex gap-4">
                <Link href="/tables" className="rounded-md inline-block bg-white text-black px-4 py-2 text-xs uppercase tracking-widest hover:bg-neutral-200 transition">
                  Book Table
                </Link>

                {selectedEvent.entryLink && 
                  <Link 
                    href={selectedEvent.entryLink}
                    target="blank" 
                    className="rounded-md inline-block border border-white text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
                  >
                    Get Tickets
                  </Link>
                }

                {!selectedEvent.entryLink && 
                  <Link 
                    href={`/tickets?event=${encodeURIComponent(selectedEvent.id)}`} 
                    className="rounded-md inline-block border border-white text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
                  >
                    Get Tickets
                  </Link>
                }
              </div>
              <button
                className="absolute top-4 right-4 text-white text-xl cursor-pointer"
                onClick={() => setShowPopup(false)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
