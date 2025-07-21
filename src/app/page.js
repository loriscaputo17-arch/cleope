'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";              // Importa db
import { collection, getDocs } from "firebase/firestore";

export default function Home() {

 const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [time, setTime] = useState("");

  useEffect(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTime(now);
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventsCol = collection(db, "events");
        const eventsSnapshot = await getDocs(eventsCol);

        const today = new Date();
        today.setHours(0, 0, 0, 0); // azzera ore/minuti/secondi

        const eventsList = eventsSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today;
            
          });

        setEvents(eventsList);
      } catch (error) {
        console.error("Errore nel recupero degli eventi:", error);
      } finally {
        setLoadingEvents(false);
      }
    }

    fetchEvents();
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ firstName: "", lastName: "", email: "", phone: "" });
      } else {
        alert("There was an error. Please try again.");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <main className="relative w-full overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">

        <div className="grid grid-cols-2 grid-rows-1 gap-4 w-full max-w-5xl z-10 mt-[5rem] mb-4">
          <div>
            <p className="text-[12px] mt-12 font-light text-left">
              Events. Brands. Music.
            </p>
            <Link
              href="/nextevents"
              className="text-[12px] uppercase font-bold hover:underline text-left block"
            >
              An Entertainment Hub.
            </Link>
          </div>

          <div>
            <p className="text-[12px] mt-12 font-light text-right">
              ITALY // SUMMER TOUR 2025 - STARTED.
            </p>
            <Link
              href="/nextevents"
              className="text-[12px] uppercase font-bold hover:underline text-right block"
            >
              Book your table here
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-4 grid-rows-2 gap-4 w-full max-w-5xl z-10">
          <img width={1000} height={1000} src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0509.JPG?alt=media&token=317eda7e-cf65-41af-8ae9-dea6bdfd38eb" alt="Club crowd" className="object-cover w-full h-64 col-span-2 row-span-2 rounded-lg" />
          <img width={1000} height={1000} src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0520.JPG?alt=media&token=a8ee1067-51eb-415f-99be-ba02a4ac0ec4" alt="Party scene" className="object-cover w-full h-64 col-span-2 row-span-2 rounded-lg" />
          <img width={1000} height={1000} src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0526.JPG?alt=media&token=588bd0c9-14df-462c-ad0e-e40162f9947b" alt="Fashion detail" className="object-cover w-full h-64 col-span-2 row-span-1 rounded-lg" />
          <img width={1000} height={1000} src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0513.JPG?alt=media&token=d2d16b06-82b1-4fe2-ad13-d10c4ccd8d7d" alt="DJ performing" className="object-cover w-full h-64 md:col-span-1 col-span-2 row-span-1 rounded-lg" />
          <img width={1000} height={1000} src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0514.JPG?alt=media&token=4a19fb40-4f3b-41e2-9f4e-e437b29afc6e" alt="Neon lights" className="object-cover w-full h-64 md:col-span-1 col-span-4 row-span-1 rounded-lg" />
        </div>
      </section>

      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <video
          className="w-full h-full object-cover"
          src="/logo/videocross.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <section className="relative w-full py-20 ml-auto mr-auto md:max-w-[80vw] max-w-[90vw]">
        <h2 className="shrink-0 text-white text-3xl md:text-5xl font-bold mb-4">
          | Upcoming Events
        </h2>

        {loadingEvents ? (
          <p className="text-white">Loading events...</p>
        ) : (
          <div className="flex gap-10 w-max overflow-x-auto pb-4 md:max-w-[80vw] max-w-[90vw] mt-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="relative min-w-[250px] md:min-w-[300px] rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-105 transition"
                onClick={() => setSelectedEvent(event)}
              >
                <img
                  src={event.img ? event.img : "https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0500.JPG?alt=media&token=77c85fc7-766b-43fe-be1e-cfb36bf82dea"}

                  alt={event.title}
                  width={300}
                  height={200}
                  className="h-[70vh] object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col gap-2">
                  <span className="text-[12px] inline-block bg-white/10 text-white text-xs px-3 py-1 rounded-full w-fit backdrop-blur-sm">
                    {event.tag}
                  </span>
                  <h4 className="text-white text-[24px] font-extrabold">{event.title}</h4>
                  <div className='flex items-center text-[9px] text-white font-light uppercase tracking-wider'>
                    <h6 className="text-white text-[14px]">{new Date(event.date).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</h6>
                    <h6 className="ml-auto text-white text-[14px]">{event.time}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="relative w-full py-20 ml-auto mr-auto md:max-w-[80vw] max-w-[90vw]">
        <h2 className="shrink-0 text-white text-3xl md:text-5xl font-bold mb-4">
          | The Hub
        </h2>

        <div className="flex gap-10 w-max scroll overflow-x-auto pb-4md:ml-auto md:mr-auto md:max-w-[80vw] max-w-[90vw] mt-8">
          {[
            { title: 'Events', desc: 'Exclusive shows and experiences that bring together the best Afrohouse music and incredible DJs, creating unforgettable nights filled with energy, creativity, and unique moments.', note: 'Explore' },
            { title: 'DJ Sets', desc: 'Connecting the right DJs with the perfect venues, building a strong network of musicians to collaborate and perform across multiple locations.', note: 'Discover' },
            { title: 'Aesthetic Parties', desc: 'Unconventional events where brands, models, and DJs unite under one roof. Featuring curated brand exhibitions, runway shows with top modeling agencies, and a lineup of diverse DJ sets throughout the night.', note: 'Join' },
            { title: 'Booking', desc: 'Reserve tables and VIP access effortlessly through our platform. By booking, you gain entry to a network of exclusive events across the country with special privileges.', note: 'Reserve' },
            { title: 'Creative Hub', desc: 'CLEOPE HUB develops innovative projects that blend music, fashion, and professional networking through thoughtfully curated events designed to generate real value.', note: 'Connect' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative min-w-[300px] md:min-w-[400px] bg-black/10 backdrop-blur-lg border-2 border-white/20 p-6 rounded-[12px] flex flex-col justify-between"
            >
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-300">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POPUP MODAL */}
      {selectedEvent && (
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
                <span>
                   {new Date(selectedEvent.date).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
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
                onClick={() => setSelectedEvent(null)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative w-full py-40 md:px-6 flex items-end justify-between md:max-w-[80vw] max-w-[90vw] mx-auto rounded-md">
        {/* Sfondo immagine */}
        <div className="absolute inset-0">
          <img 
          width={1000} height={1000}
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0504.JPG?alt=media&token=006592a8-dad0-4293-b0dd-4264d4838517"
            alt="Tables & Access"
            className="w-full h-full object-cover rounded-md"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Contenuto */}
        <div className="relative z-10 flex flex-col md:flex-row w-full justify-between items-end md:mr-0 mr-6">
          {/* Titolo a sx */}
          <h3 className="text-4xl md:text-6xl font-bold text-white max-w-sm">
            Tables & Access
          </h3>

          {/* Descrizione + CTA a dx */}
          <div className="mt-6 md:mt-0 text-right max-w-md">
            <p className="text-neutral-100 mb-4 md:w-full w-80">
              Reserve exclusive tables, VIP areas and backstage passes for an unforgettable experience.
            </p>
            <Link
              href="/tables"
              className="inline-block bg-white text-black px-6 py-3 rounded-md uppercase text-xs tracking-widest hover:bg-neutral-200 transition"
            >
              Reserve Now
            </Link>
          </div>
        </div>
      </section>


      {/* CONTACT */}
      <section className="relative w-full py-20 md:px-6 md:max-w-[80vw] max-w-[90vw] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
        {/* Form a sx */}
        <form
  onSubmit={handleSubmit}
  className="flex flex-col gap-4 w-full md:w-1/2"
>
  <div className="flex flex-col md:flex-row gap-4">
    <input
      type="text"
      name="firstName"
      placeholder="First Name"
      value={formData.firstName}
      onChange={handleChange}
      className="px-4 py-3 border-b border-neutral-300 bg-transparent focus:outline-none w-full uppercase text-[10px]"
    />
    <input
      type="text"
      name="lastName"
      placeholder="Last Name"
      value={formData.lastName}
      onChange={handleChange}
      className="px-4 py-3 border-b border-neutral-300 bg-transparent focus:outline-none w-full uppercase text-[10px]"
    />
  </div>
  <input
    type="email"
    name="email"
    placeholder="Email Address"
    value={formData.email}
    onChange={handleChange}
    className="px-4 py-3 border-b border-neutral-300 bg-transparent focus:outline-none w-full uppercase text-[10px]"
  />
  <input
    type="tel"
    name="phone"
    placeholder="Phone Number"
    value={formData.phone}
    onChange={handleChange}
    className="px-4 py-3 border-b border-neutral-300 bg-transparent focus:outline-none w-full uppercase text-[10px]"
  />
  <button
    type="submit"
    disabled={loading}
    className="rounded-md bg-white text-black px-6 py-3 uppercase text-xs tracking-widest hover:bg-neutral-200 transition w-fit cursor-pointer"
  >
    {loading ? "Submitting..." : "Subscribe"}
  </button>
  {success && (
    <p className="text-green-400 text-xs mt-2">Thank you for subscribing!</p>
  )}
</form>


        {/* Titolo a dx */}
        <div className="w-full md:w-1/2 text-left md:text-right">
          <h3 className="text-2xl md:text-4xl font-bold mb-4 text-white">Stay Connected</h3>
          <p className="text-neutral-200 max-w-md md:ml-auto">
            Join our mailing list for exclusive access, invites, and updates.
          </p>
        </div>
      </section>

    </main>
  )
}

