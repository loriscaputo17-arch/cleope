'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarPage() {
  const currentDate = new Date();
  const [events, setEvents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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

  const today = new Date();

  // Filtra eventi per mese e anno selezionati
  const filteredEvents = events.filter(event => {
    const date = new Date(event.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  return (
    <main className="bg-black text-white min-h-screen px-6 md:px-12 py-16">
      {/* HEADER */}
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold uppercase mt-16"
        >
          Event Calendar
        </motion.h1>
        <p className="text-neutral-400 mt-3 text-sm md:text-base tracking-wide">
          One timeline — all nights, past and upcoming.
        </p>
      </div>

      {/* MONTH + YEAR SELECTOR */}
      <div className="flex flex-wrap justify-center items-center gap-3 mb-14">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-2 pb-2">
          {months.map((month, idx) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(idx)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm uppercase tracking-widest transition-all duration-300 border ${
                idx === selectedMonth
                  ? "bg-white text-black font-bold border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "border-white/10 text-neutral-400 hover:text-white hover:border-white/40"
              }`}
            >
              {month}
            </button>
          ))}
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-transparent border border-white/20 text-white text-sm rounded-full px-4 py-2 uppercase tracking-widest focus:outline-none hover:border-white/50 transition"
        >
          {Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i).map((year) => (
            <option key={year} value={year} className="bg-black text-white">
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* EVENTS GRID */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredEvents
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(event => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < today;

              return (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 cursor-pointer group"
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowPopup(true);
                  }}
                >
                  {/* Poster */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <Image
                      src={event.img || "/default-event.jpg"}
                      alt={event.title}
                      fill
                      className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-lg font-bold uppercase tracking-wider mb-1">
                          {event.title}
                        </h3>
                        <p className="text-xs text-neutral-400 uppercase tracking-wide">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          • {event.time}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] uppercase px-3 py-1 rounded-full tracking-widest ${
                          isPast
                            ? "bg-white/10 text-neutral-400"
                            : "bg-white text-black font-semibold"
                        }`}
                      >
                        {isPast ? "Past" : "Upcoming"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      ) : (
        <p className="text-neutral-600 text-sm italic text-center mt-10">
          No events for this month.
        </p>
      )}

      {/* POPUP */}
      <AnimatePresence>
        {showPopup && selectedEvent && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="relative w-full h-[90vh] max-w-5xl bg-neutral-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row"
            >
              {/* LEFT: Poster */}
              <div className="relative w-full md:w-1/2 aspect-[4/5] md:aspect-auto">
                <Image
                  src={selectedEvent.img || "/default-event.jpg"}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* RIGHT: Content */}
              <div className="flex-1 p-6 md:p-10 flex flex-col justify-between text-white overflow-y-scroll">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold uppercase mb-3 tracking-wide">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-sm text-neutral-400 mb-5 uppercase tracking-wide">
                    {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    • {selectedEvent.time}
                  </p>
                  <p className="text-sm text-neutral-200 leading-relaxed mb-8">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {new Date(selectedEvent.date) >= today ? (
                    <>
                      <Link
                        href="/tables"
                        className="rounded-full bg-white text-black px-6 py-3 text-xs uppercase tracking-widest hover:bg-neutral-200 transition text-center"
                      >
                        Book Table
                      </Link>
                      <a
                        href={
                          selectedEvent.entryLink ||
                          `/tickets?event=${encodeURIComponent(selectedEvent.id)}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-white text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition text-center"
                      >
                        Get Tickets
                      </a>
                    </>
                  ) : (
                    <>
                      <button
                        disabled
                        className="rounded-full bg-white/10 text-neutral-500 px-6 py-3 text-xs uppercase tracking-widest cursor-not-allowed text-center"
                      >
                        Book Table
                      </button>
                      <button
                        disabled
                        className="rounded-full border border-white/20 text-neutral-500 px-6 py-3 text-xs uppercase tracking-widest cursor-not-allowed text-center"
                      >
                        Get Tickets
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white text-lg px-3 py-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
