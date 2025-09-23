'use client'

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [ticketLink, setTicketLink] = useState(null); 

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [events, setEvents] = useState([]);
  const router = useRouter();

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

  // Filter by month/year (fix per includere anche gli eventi di oggi)
  const filteredEvents = events.filter(event => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    if (
      eventDate.getMonth() === selectedMonth &&
      eventDate.getFullYear() === selectedYear
    ) {
      if (selectedMonth === currentMonth && selectedYear === currentYear) {
        return eventDate >= today;
      }
      return true;
    }
    return false;
  });

  // Gestione newsletter
  const handleGetTickets = (link) => {
    setTicketLink(link);
    setShowNewsletter(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewsletterSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    if (res.ok) {
      setTimeout(() => {
        setShowNewsletter(false);
        setLoading(false);
        if (ticketLink) {
          // redirect nella stessa finestra (compatibile mobile)
          window.location.href = ticketLink;
        }
      }, 1000);
    } else {
      alert("There was an error. Please try again.")
    }
  } catch (err) {
    console.error(err)
    alert("Errore, riprova più tardi.")
  }
};

  const handleSkip = () => {
    setShowNewsletter(false);
    if (ticketLink) {
      window.open(ticketLink, "_blank");
    }
  };

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
                    if (window.innerWidth < 768) {
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

                <button
                  onClick={() =>
                    handleGetTickets(
                      selectedEvent.entryLink
                        ? selectedEvent.entryLink
                        : `/tickets?event=${encodeURIComponent(selectedEvent.id)}`
                    )
                  }
                  className="rounded-full border border-white text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition"
                >
                  Get Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewsletter && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full"
          >
            {/* img sopra */}
            <div className="relative w-full h-40">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0523.JPG?alt=media&token=ce2b3ad8-eb40-4fca-8814-95bb549adbd2"
                alt="Newsletter background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h3 className="text-2xl text-center md:text-3xl font-bold uppercase w-[60%]">
                  Be part of the coolest community in town. 
                </h3>
              </div>
            </div>

            {/* contenuto */}
            <div className="p-6 text-center">
              <p className="text-neutral-300 mb-4 w-[70%] ml-auto mr-auto">
                Exclusive brand collaborations, immersive pop-ups, and a community redefining nightlife.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full rounded-full bg-white text-black py-3 hover:bg-neutral-200 transition text-sm"
                >
                  {loading ? "Submitting..." : "Subscribe"}
                </button>
                {success && (
                  <p className="text-green-400 text-xs mt-2">
                    Thanks for subscribing!
                  </p>
                )}
              </form>

              <button
                onClick={handleSkip}
                className="mt-4 text-neutral-400 underline text-sm cursor-pointer"
              >
                No thanks, continue to tickets →
              </button>

              <button
                onClick={() => setShowNewsletter(false)}
                className="absolute top-3 right-3 bg-black/50 text-white rounded-full px-3 py-1 text-sm hover:bg-black/80 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
