'use client'

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

export default function CalendarPage() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [events, setEvents] = useState([]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(fetched);
    };
    fetchEvents();
  }, []);

  // Filter by month/year
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    if (
      eventDate.getMonth() === selectedMonth &&
      eventDate.getFullYear() === selectedYear
    ) {
      // Se il mese è quello attuale → mostra solo futuri
      if (selectedMonth === currentMonth && selectedYear === currentYear) {
        return eventDate >= currentDate;
      }
      return true;
    }
    return false;
  });

  return (
    <main className="md:max-w-[80vw] max-w-[90vw] mx-auto min-h-screen bg-black text-white px-4 py-16 md:px-12">
      
      {/* HEADER */}
      <div className="text-center mb-12 mt-12">
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest">
          Event Calendar
        </h1>
        <p className="text-neutral-400 mt-2 text-sm md:text-base">
          Browse upcoming and past events — find your night.
        </p>
      </div>

      {/* MONTHS + YEAR */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {months.map((month, idx) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(idx)}
            className={`cursor-pointer px-4 py-2 text-xs md:text-sm rounded-full uppercase tracking-widest transition ${
              idx === selectedMonth
                ? "bg-white text-black font-semibold"
                : "bg-white/10 hover:bg-white/20 text-neutral-300"
            }`}
          >
            {month}
          </button>
        ))}

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="ml-4 bg-transparent border border-neutral-600 px-4 py-2 text-xs uppercase tracking-widest rounded-md"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <option
              key={i}
              value={currentYear + i}
              className="bg-black text-white"
            >
              {currentYear + i}
            </option>
          ))}
        </select>
      </div>

      {/* LAYOUT */}
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* EVENTS TABLE */}
        <div className="w-full md:w-2/5">
          {filteredEvents.length > 0 ? (
            <ul className="divide-y divide-neutral-800 border-t border-neutral-800">
              {filteredEvents.map(event => (
                <li
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event);
                    if (window.innerWidth < 768) {  // breakpoint "md"
                      setShowPopup(true);
                    }
                  }}

                  className="flex items-center justify-between py-4 cursor-pointer hover:bg-white/5 px-2 rounded-md transition"
                >
                  <div>
                    <p className="text-sm text-neutral-400">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                      })}
                    </p>
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                  </div>
                  <span className="text-xs uppercase bg-white/10 px-3 py-1 rounded-full">
                    {event.tag}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500 text-center py-12">
              No events for this month.
            </p>
          )}
        </div>

        {/* EVENT PREVIEW */}
        <div className="w-full md:w-3/5">
          {selectedEvent ? (
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-lg flex flex-col gap-4">
              <div className="relative w-full h-100 rounded-lg overflow-hidden">
                <Image
                  src={
                    selectedEvent.img ||
                    "https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0500.JPG?alt=media"
                  }
                  alt={selectedEvent.title}
                  fill
                  sizes="100%"
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
              <p className="text-sm text-neutral-300">
                {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                • {selectedEvent.time}
              </p>
              <p className="text-xs text-neutral-400 uppercase">{selectedEvent.tag}</p>
              <button
                className="cursor-pointer mt-2 bg-white text-black px-4 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-neutral-200 transition"
                onClick={() => setShowPopup(true)}
              >
                View Details
              </button>
            </div>
          ) : (
            <div className="text-neutral-500 text-center py-12 border border-dashed border-neutral-700 rounded-xl">
              Select an event to see details
            </div>
          )}
        </div>
      </div>

      {/* POPUP MODAL */}
      {showPopup && selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="relative w-full max-w-2xl bg-black rounded-2xl overflow-hidden shadow-2xl md:h-auto h-[50%] md:overflow-y-auto overflow-y-scroll">
            
            {/* IMG */}
            <div className="relative w-full h-64">
              <Image
                src={
                  selectedEvent.img ||
                  "https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0500.JPG?alt=media"
                }
                alt={selectedEvent.title}
                fill
                sizes="100%"
                className="object-cover"
              />
              <button
                className="cursor-pointer absolute top-4 right-4 bg-black/60 text-white text-lg px-3 py-1 rounded-full hover:bg-black/80"
                onClick={() => setShowPopup(false)}
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 text-white">
              <span className="inline-block bg-white/10 text-xs px-3 py-1 rounded-full backdrop-blur-sm mb-3">
                {selectedEvent.tag}
              </span>
              <h3 className="text-2xl font-bold mb-2">{selectedEvent.title}</h3>
              <p className="text-sm text-neutral-300 mb-4">
                {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                — {selectedEvent.time}
              </p>
              <p className="text-sm text-neutral-200 mb-6">
                {selectedEvent.description}
              </p>
              <div className="flex gap-4">
                <Link
                  href="/tables"
                  className="rounded-full bg-white text-black px-4 py-2 text-xs uppercase tracking-widest hover:bg-neutral-200 transition"
                >
                  Book Table
                </Link>

                <Link
                  href={
                    selectedEvent.entryLink
                      ? selectedEvent.entryLink
                      : `/tickets?event=${encodeURIComponent(selectedEvent.id)}`
                  }
                  target="_blank"
                  className="rounded-full border border-white text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
                >
                  Get Tickets
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
