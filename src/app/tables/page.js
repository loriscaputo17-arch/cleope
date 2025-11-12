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
          src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0506.JPG?alt=media&token=7770406e-cb0b-4e84-bff7-518b713297ad"
                    alt="CLEOPE background"
                    fill
                    sizes="100vw"
                    quality={50}
                    className="object-cover object-center opacity-50 blur-sm"
                  />

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold uppercase text-white">Book a Table</h1>
          <p className="text-neutral-200 mt-4 max-w-xl">
            Request a VIP table for our next events. Enjoy the best spots and exclusive service.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className=" mt-4 cursor-pointer inline-flex items-center gap-2 bg-white text-black pl-5 pr-2 py-1 text-[14px] rounded-full hover:bg-neutral-200 transition"
          >
            Request Table

            <div className="bg-white m-1 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="black" width="20px" height="20px" viewBox="0 0 640 640">
                <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/>
              </svg>
            </div>
          </button>

        </div>
      </section>

<section className="w-full py-20 px-6">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
      Atmosphere
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {[
    "https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0523.JPG?alt=media&token=ce2b3ad8-eb40-4fca-8814-95bb549adbd2",
    "https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0509.JPG?alt=media&token=317eda7e-cf65-41af-8ae9-dea6bdfd38eb",
    "https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0506.JPG?alt=media&token=7770406e-cb0b-4e84-bff7-518b713297ad",
  ].map((src, idx) => (
    <div
      key={idx}
      className="relative overflow-hidden rounded-2xl aspect-[3/4] w-full"
    >
      <Image
        src={src}
        alt={`Gallery ${idx + 1}`}
        fill
        quality={60}
        className="object-cover object-center transition-transform duration-700 hover:scale-105"
      />
    </div>
  ))}
</div>

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
                <select
                  className="px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"
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


                <div className="md:flex gap-4 mt-6 mb-8">
                  <div className="w-full md:w-1/2">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="md:mb-0 mb-8 px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="w-full md:w-1/2">
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <input
                  type="email"
                  placeholder="Email Address"
                  className="mb-8 px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="mb-8 px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <input
                  type="number"
                  placeholder="Estimated Age"
                  className="mb-8 px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Number of Guests"
                  className="mb-8 px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  required
                />

                <textarea
                  placeholder="Comment"
                  className="mb-8 px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>

                <button
                  type="submit"
                  className="mt-4 rounded-full bg-white text-black px-6 py-3 uppercase text-xs tracking-widest hover:bg-neutral-200 transition w-fit cursor-pointer"
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
