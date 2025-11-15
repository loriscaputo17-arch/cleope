'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { motion } from 'framer-motion'

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [events, setEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [ticketLink, setTicketLink] = useState(null); 
  const [selectedMonth, setSelectedMonth] = useState("upcoming");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [showPopup, setShowPopup] = useState(false)
  const [showNewsletter, setShowNewsletter] = useState(false);

  useEffect(() => {
    // mostra popup solo la prima volta
    if (!localStorage.getItem("newsletterShown")) {
      setTimeout(() => setShowPopup(true), 1500) // delay di 1.5s
      localStorage.setItem("newsletterShown", "true")
    }
  }, [])

  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventsCol = collection(db, "events");
        const eventsSnapshot = await getDocs(eventsCol);

        const eventsList = eventsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(event => event.date) // solo se ha una data valida
          .sort((a, b) => new Date(a.date) - new Date(b.date)); // ordina per data

        setEvents(eventsList);
      } catch (error) {
        console.error("Errore nel recupero degli eventi:", error);
      } finally {
        setLoadingEvents(false);
      }
    }
    fetchEvents();
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSuccess(true)
        setFormData({ firstName: "", lastName: "", email: "", phone: "" })
      } else {
        alert("There was an error. Please try again.")
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleSubmitNewsletter = async (e) => {
  e.preventDefault()
  setLoading(true)
  try {
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setTimeout(() => {
        setShowNewsletter(false)
        setLoading(false)
        if (ticketLink) {
          // redirect nella stessa finestra
          window.location.href = ticketLink
        }
      }, 1000)
    } else {
      alert("There was an error. Please try again.")
    }
  } catch (err) {
    console.error(err)
    alert("Errore, riprova più tardi.")
  }
  setLoading(false)
}


  const handleGetTickets = (link) => {
    setTicketLink(link);
    setShowNewsletter(true); // mostra popup newsletter
  };

  return (
    <main className="relative w-full overflow-hidden text-white bg-black">

      {showPopup && (
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

              <form onSubmit={handleSubmitNewsletter} className="flex flex-col gap-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"                />
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full rounded-full bg-white text-black py-3 hover:bg-neutral-200 transition text-sm"
                >
                  {loading ? "Submitting..." : "Subscribe"}
                </button>
                {success && <p className="text-green-400 text-xs mt-2">Thanks for subscribing!</p>}
              </form>

              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 bg-black/50 text-white rounded-full px-3 py-1 text-sm hover:bg-black/80"
              >
                ✕
              </button>
            </div>
          </motion.div>
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

              <form onSubmit={handleSubmitNewsletter} className="flex flex-col gap-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60"                />
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full rounded-full bg-white text-black py-3 hover:bg-neutral-200 transition text-sm"
                >
                  {loading ? "Submitting..." : "Subscribe"}
                </button>
                {success && <p className="text-green-400 text-xs mt-2">Thanks for subscribing!</p>}
              </form>

              <button
                onClick={() => setShowNewsletter(false)}
                className="absolute top-3 right-3 bg-black/50 text-white rounded-full px-3 py-1 text-sm hover:bg-black/80"
              >
                ✕
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <section className="relative flex flex-col md:flex-row items-center justify-between text-left py-[8rem] min-h-[90vh] overflow-hidden">

        {/* GRID TEXTURE BG */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:140px_140px]" />
        </div>

        {/* BG IMAGE */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0507.JPG?alt=media&token=c4211af3-dbe5-474a-8459-65d3af342fb2"
            alt="CLEOPE background"
            fill
            className="object-cover object-center opacity-20 grayscale"
          />
        </div>

        {/* LEFT CONTENT */}
        <div className="z-20 max-w-xl text-center md:text-left px-6 md:ml-[8vw]">
          <p className="uppercase text-[10px] tracking-[0.3em] text-neutral-400 mb-4">Electronic Hub</p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight uppercase"
          >
            CLEOPE<br />
            <span className="text-neutral-500">Entertainment Hub</span>
          </motion.h1>

          <p className="mt-6 text-neutral-300 max-w-md text-sm md:text-base leading-relaxed">
            A creative collective merging <span className="text-white">music</span>, 
            <span className="text-white"> fashion</span> and 
            <span className="text-white"> experience design</span>.
            We redefine the culture of nightlife.
          </p>

          <Link
            href="/nextevents"
            className="inline-flex items-center gap-3 mt-8 bg-white text-black px-6 py-3 text-sm rounded-full hover:bg-neutral-200 transition"
          >
            Explore Next Events
            <svg xmlns="http://www.w3.org/2000/svg" fill="black" width="18px" height="18px" viewBox="0 0 640 640">
              <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/>
            </svg>
          </Link>
        </div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="z-20 md:mr-[8vw] mt-12 md:mt-0 relative overflow-hidden rounded-[2rem] border border-white/10 w-[80vw] h-[100vw] sm:w-[60vw] sm:h-[75vw] md:w-[35vw] md:h-[50vw]"
        >
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0520.JPG?alt=media&token=a8ee1067-51eb-415f-99be-ba02a4ac0ec4"
            alt="CLEOPE Visual"
            fill
            className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </motion.div>

      </section>

      {!loadingEvents && (
        <section className="w-full py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8">CLEOPE Events</h2>

            {/* Month Selector */}
            {events.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-10">
                {Array.from(
                  new Set(
                    events.map((e) =>
                      new Date(e.date).toLocaleString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    )
                  )
                )
                  .sort(
                    (a, b) =>
                      new Date(a).getTime() - new Date(b).getTime()
                  )
                  .map((month) => (
                    <button
                      key={month}
                      onClick={() => setSelectedMonth(month)}
                      className={`cursor-pointer uppercase text-xs tracking-wide px-5 py-2 rounded-full border transition-all duration-300 ${
                        selectedMonth === month
                          ? "bg-white text-black border-white"
                          : "border-white/20 text-white/70 hover:text-white hover:border-white/40"
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                <button
                  onClick={() => setSelectedMonth("upcoming")}
                  className={`cursor-pointer uppercase text-xs tracking-wide px-5 py-2 rounded-full border transition-all duration-300 ${
                    selectedMonth === "upcoming"
                      ? "bg-white text-black border-white"
                      : "border-white/20 text-white/70 hover:text-white hover:border-white/40"
                  }`}
                >
                  Upcoming
                </button>
              </div>
            )}

            {/* Filtered Events */}
            {(() => {
              const now = new Date();

              let filtered =
                selectedMonth === "upcoming"
                  ? events.filter((e) => new Date(e.date) >= now)
                  : events.filter(
                      (e) =>
                        new Date(e.date).toLocaleString("en-US", {
                          month: "long",
                          year: "numeric",
                        }) === selectedMonth
                    );

              if (filtered.length === 0)
                return <p className="text-neutral-400">No events for this month.</p>;

              return (
                <div className="grid md:grid-cols-3 gap-8">
                  {filtered.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative rounded-xl overflow-hidden group border border-white/10 cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <Image
                        src={event.img ?? "/fallback.jpg"}
                        alt={event.title}
                        width={800}
                        height={1000}
                        className="object-cover w-full h-[500px] grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-5 flex flex-col justify-end">
                        <span className="text-xs uppercase bg-white/10 px-3 py-1 rounded-full w-fit backdrop-blur-sm mb-2 tracking-widest">
                          {event.tag ?? "Event"}
                        </span>
                        <h4 className="text-xl font-bold mb-1">{event.title}</h4>
                        <p className="text-sm text-neutral-400 flex justify-between">
                          <span>{new Date(event.date).toLocaleDateString("it-IT")}</span>
                          <span>{event.time}</span>
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      <section className="w-full py-32 px-6 bg-black text-white overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col gap-24">

          <div className="relative group rounded-[24px] overflow-hidden border border-white/10 flex flex-col md:flex-row h-auto">
            {/* IMG SX */}
            <div className="relative w-full md:w-1/2 h-[40vh] md:h-full">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/locandine%2F11.11.png?alt=media&token=3e1e869b-70a4-4733-83c3-313c2af0f867"
                alt="Breakout 22.11"
                
                className="object-cover object-center"
              />
            </div>

            {/* TESTO DX */}
            <div className="relative flex flex-col justify-center items-start w-full md:w-1/2 p-8 md:p-14 text-left z-10 bg-gradient-to-b from-black via-neutral-950 to-black">
              <p className="uppercase mb-4 text-[11px] tracking-[0.25em] bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                CLEOPE SOUND
              </p>

              <h2 className="text-4xl font-extrabold mb-6 tracking-tight leading-tight">
                BREAKOUT 22.11 Milan
              </h2>

              <p className="text-neutral-300 leading-relaxed mb-8 text-[15px] max-w-lg">
                The city calls again. But this time <span className="text-white font-semibold">3 movements</span> are answering.
                <br /><br />
                
                <br /><br />
                <span className="text-white font-semibold">BREAKOUT</span> // Nov. 22th.<br />
                3 movements.<br />
                1 legendary night in the heart of Milan.
                <br /><br />
                4 main music players all together for one unique night.
                <br /><br />
                Don't lose the opportunity to live an <span className="text-white font-semibold">extraordinary djset.</span>
                <br /><br />
                🎫 RSVP now — limited access.
                <br /><br />
                Breakout is coming.<br />
                See y'all on <span className="text-white font-medium">Nov. 22th.</span>
                <br /><br />
                <span className="text-neutral-400 italic">Accesso solo su prenotazione — capienza limitata.</span>
              </p>


              <a
                href="https://breakoutpeople.com/formats/breakout"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-black px-8 py-3 text-sm rounded-full hover:bg-neutral-200 transition"
              >
                RSVP Open to Get Access
                <svg xmlns="http://www.w3.org/2000/svg" fill="black" width="18px" height="18px" viewBox="0 0 640 640">
                  <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            
            {/* LEFT CARD */}
            <div className="relative group h-[45vh] rounded-[24px] overflow-hidden border border-white/10">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0504.JPG?alt=media&token=006592a8-dad0-4293-b0dd-4264d4838517"
                alt="DJ Sets"
                fill
                className="object-cover object-center transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-700" />
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-8">
                <p className="uppercase text-[11px] tracking-[0.3em] bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  Highlights
                </p>
                <h3 className="text-3xl font-bold mb-3">DJ Sets & Booking</h3>
                <p className="text-neutral-300 text-sm max-w-sm">
                  Live performances with <span className="text-white font-semibold">international DJs</span>, 
                  curated lineups, and immersive club experiences.&nbsp;
                  <span className="italic">Follow the rhythm, feel the movement.</span>
                </p>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="relative group h-[45vh] rounded-[24px] overflow-hidden border border-white/10">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0520.JPG?alt=media&token=a8ee1067-51eb-415f-99be-ba02a4ac0ec4"
                alt="Event Production"
                fill
                className="object-cover object-center transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-700" />
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-8">
                <p className="uppercase text-[11px] tracking-[0.3em] bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  Exclusive
                </p>
                <h3 className="text-3xl font-bold mb-3">Event Production</h3>
                <p className="text-neutral-300 text-sm max-w-sm">
                  Full-service <span className="text-white font-semibold">production</span> — 
                  creative direction, sound, light & staging.  
                  Crafted for timeless nights.
                </p>
              </div>
            </div>
          </div>

          <div className="relative group rounded-[24px] overflow-hidden border border-white/10">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/22.jpg?alt=media&token=2e1d4838-e609-4af8-953c-832440de605d"
              alt="Community"
              fill
              className="object-cover object-center transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-700" />
            <div className="relative z-10 text-center max-w-2xl mx-auto py-24 px-6">
              <p className="uppercase mb-4 text-[11px] tracking-[0.3em] bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                Community
              </p>
              <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
                The Network
              </h2>
              <p className="text-neutral-300 leading-relaxed mb-10 text-[15px]">
                Beyond the beats and lights, CLEOPE is a <span className="text-white font-semibold">nationwide collective</span>  
                &nbsp;uniting creative souls across Italy.  
                Curated circles, exclusive guest lists, and shared inspiration —&nbsp;
                <span className="text-white font-medium">this is where culture connects.</span>
              </p>
              <Link
                href="/nextevents"
                className="inline-flex items-center gap-3 bg-white text-black px-8 py-3 text-sm rounded-full hover:bg-neutral-200 transition"
              >
                Join the Movement
                <svg xmlns="http://www.w3.org/2000/svg" fill="black" width="18px" height="18px" viewBox="0 0 640 640">
                  <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/>
                </svg>
              </Link>
            </div>
          </div>

          <div className="relative group rounded-[24px] overflow-hidden border border-white/10">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/33.jpg?alt=media&token=f9ee79ed-f732-4c47-b80e-c72f5906ef2d"
              alt="Aesthetic Parties"
              fill
              className="object-cover object-center transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-700" />
            <div className="relative z-10 text-center max-w-2xl mx-auto py-24 px-6">
              <p className="uppercase mb-4 text-[11px] tracking-[0.25em] bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                Features
              </p>
              <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
                Aesthetic Parties
              </h2>
              <p className="text-neutral-300 leading-relaxed mb-10 text-[15px]">
                Unconventional events where <span className="text-white font-semibold">fashion</span>,
                <span className="text-white font-semibold"> music</span>, and
                <span className="text-white font-semibold"> nightlife</span> merge into one immersive experience.  
                Each night sparks <span className="italic">creativity</span> and connection — 
                moments that linger long after the beat stops.
              </p>
              <Link
                href="/nextevents"
                className="inline-flex items-center gap-3 bg-white text-black px-8 py-3 text-sm rounded-full hover:bg-neutral-200 transition"
              >
                Explore Next Events
                <svg xmlns="http://www.w3.org/2000/svg" fill="black" width="18px" height="18px" viewBox="0 0 640 640">
                  <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="w-full py-24 px-6 bg-black">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60" />
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60" />
            </div>
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60" />
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="px-4 py-3 border-b border-white/20 bg-transparent focus:outline-none w-full uppercase text-sm placeholder-white/60" />
            <button type="submit" disabled={loading} 
              className="w-[fit-content] inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-[14px] rounded-full hover:bg-neutral-200 transition"
              >
              {loading ? "Submitting..." : "Subscribe"}
                <svg xmlns="http://www.w3.org/2000/svg" fill="black" width="20px" height="20px" viewBox="0 0 640 640">
                  <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/>
                </svg>
            </button>
            {success && <p className="text-green-400 text-xs mt-2">Thank you for subscribing!</p>}
          </form>

          <div>
            <h3 className="text-3xl md:text-5xl font-bold mb-4">Stay Connected</h3>
            <p className="text-neutral-300">
              Join our community for exclusive invites, updates, and news.
            </p>
          </div>
        </div>
      </section>

      {/* EVENT MODAL */}
      {selectedEvent && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="relative w-full max-w-5xl h-[90vh] bg-neutral-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row"
          >
            {/* LEFT: Event Poster */}
            <div className="relative w-full md:w-1/2 aspect-[4/5] md:aspect-auto">
              <Image
                src={selectedEvent.img || "/fallback.jpg"}
                alt={selectedEvent.title}
                fill
                className="object-cover"
              />
            </div>

            {/* RIGHT: Content */}
            <div className="flex-1 p-6 md:p-10 flex flex-col justify-between text-white overflow-y-auto">
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
                {selectedEvent.description && (
                  <p className="text-sm text-neutral-200 leading-relaxed mb-8">
                    {selectedEvent.description}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {new Date(selectedEvent.date) >= new Date() ? (
                  <>
                    <Link
                      href="/tables"
                      className="rounded-full bg-white text-black px-6 py-3 text-xs uppercase tracking-widest hover:bg-neutral-200 transition text-center"
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
                      className="rounded-full border border-white text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition text-center"
                    >
                      Get Tickets
                    </button>
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

              {/* Close button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white text-lg px-3 py-1 rounded-full"
              >
                ✕
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

    </main>
  )
}
