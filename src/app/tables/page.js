'use client'

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";              // Importa db
import { collection, getDocs } from "firebase/firestore";  // Importa getDocs e collection
import Image from 'next/image'

export default function TablePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState("");
  
  // Stato per evento selezionato
  const [event, setEvent] = useState("");

  // Stati per i campi form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [guests, setGuests] = useState("");
  const [comment, setComment] = useState("");
  
  // Stati per eventi, caricamento ed errore
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        setError("");
        const snapshot = await getDocs(collection(db, "events"));
        const eventsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsList);
      } catch (err) {
        setError("Failed to load events.");
        console.error(err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTime(now);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!event) {
      alert("Please select an event.");
      return;
    }

    // Crea messaggio whatsapp
    const message = 
      `Richiesta Tavolo VIP\n` +
      `Evento: ${events.find(ev => ev.id === event)?.title || "N/A"}\n` +
      `Nome: ${firstName}\n` +
      `Cognome: ${lastName}\n` +
      `Email: ${email}\n` +
      `Telefono: ${phone}\n` +
      `Età stimata: ${age}\n` +
      `Numero ospiti: ${guests}\n` +
      `Commento: ${comment}`;

    const encodedMessage = encodeURIComponent(message);
    const waNumber = "+393513895086";
    const waLink = `https://wa.me/${waNumber.replace(/\D/g, "")}?text=${encodedMessage}`;
    window.open(waLink, "_blank");
  };

  return (
    <main className="w-full bg-black text-white">
      {/* HERO SECTION */}
      <section className="relative w-full h-screen">
        <Image
          width={1000} height={1000}
          src="/images/IMG_0506.jpg"
          alt="Table"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold uppercase text-white">Book a Table</h1>
          <p className="text-neutral-200 mt-4 max-w-xl">
            Request a VIP table for our next events. Enjoy the best spots and exclusive service.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="mt-6 rounded-md bg-white text-black px-6 py-3 uppercase text-xs tracking-widest hover:bg-neutral-200 transition cursor-pointer"
          >
            Request Table
          </button>
        </div>
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="relative ml-auto bg-[#a6a6a62e] text-white w-full md:w-[40vw] max-w-full h-full overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-4 uppercase">Request Table</h2>

            {loadingEvents ? (
              <p>Loading events...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
                <label className="text-xs uppercase font-semibold mt-4">Event</label>
                <select
                  className="border-b border-neutral-400 p-2"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  required
                >
                  <option value="">-- Select an event --</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title || ev.id}
                    </option>
                  ))}
                </select>

                <div className="md:flex gap-4 mt-4">
                  <div className="w-full md:w-1/2">
                    <label className="text-xs uppercase font-semibold">First Name</label>
                    <input
                      type="text"
                      className="border-b border-neutral-400 p-2 w-full"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="w-full md:w-1/2">
                    <label className="text-xs uppercase font-semibold">Last Name</label>
                    <input
                      type="text"
                      className="border-b border-neutral-400 p-2 w-full"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <label className="text-xs uppercase font-semibold mt-4">Email Address</label>
                <input
                  type="email"
                  className="border-b border-neutral-400 p-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label className="text-xs uppercase font-semibold mt-4">Phone Number</label>
                <input
                  type="tel"
                  className="border-b border-neutral-400 p-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <label className="text-xs uppercase font-semibold mt-4">Estimated Age</label>
                <input
                  type="number"
                  className="border-b border-neutral-400 p-2"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />

                <label className="text-xs uppercase font-semibold mt-4">Number of Guests</label>
                <input
                  type="number"
                  className="border-b border-neutral-400 p-2"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  required
                />

                <label className="text-xs uppercase font-semibold mt-4">Comment</label>
                <textarea
                  className="border-b border-neutral-400 p-2"
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>

                <button
                  type="submit"
                  className="mt-4 rounded-md bg-white text-black px-6 py-3 uppercase text-xs tracking-widest hover:bg-neutral-800 transition w-fit cursor-pointer"
                >
                  Send
                </button>
              </form>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-8 text-white text-3xl cursor-pointer"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
