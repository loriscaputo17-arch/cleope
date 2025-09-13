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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [showPopup, setShowPopup] = useState(false)

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
        const eventsCol = collection(db, "events")
        const eventsSnapshot = await getDocs(eventsCol)

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const eventsList = eventsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(event => new Date(event.date) >= today)

        setEvents(eventsList)
      } catch (error) {
        console.error("Errore nel recupero degli eventi:", error)
      } finally {
        setLoadingEvents(false)
      }
    }
    fetchEvents()
  }, [])

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
      await addDoc(collection(db, "newsletter"), {
        email: formData.email,
        createdAt: new Date()
      })
      setSuccess(true)
      setFormData({ email: "" })
    } catch (err) {
      console.error(err)
      alert("Errore, riprova più tardi.")
    }
    setLoading(false)
  }

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
                <h3 className="text-2xl text-center md:text-3xl font-bold uppercase">
                  Be part of the coolest community in town.
                  </h3>
              </div>
            </div>

            {/* contenuto */}
            <div className="p-6 text-center">
              <p className="text-neutral-300 mb-4">
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

      {/* HERO */}
      <section className="relative flex flex-col md:flex-row items-center justify-between text-left pb-[6rem] pt-[6rem] md:pb-[10rem] md:pt-[10rem] min-h-[90vh]">

        {/* Finta griglia sopra */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:160px_160px]" />
        </div>

        {/* Static background image sotto il contenuto */}
        <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0507.JPG?alt=media&token=c4211af3-dbe5-474a-8459-65d3af342fb2"
            alt="CLEOPE background"
            fill
            sizes="100vw"
            quality={50}
            className="object-cover object-center opacity-20 blur-sm"
          />
        </div>

        {/* Content left */}
        <div className="z-20 max-w-xl text-center md:text-left px-6 md:ml-[8vw] mb-10 md:mb-0">
          <p className={`bg-[#0000ff47] text-[#8989ff] md:ml-0 ml-auto md:mr-0 mr-auto  border-[#8989ff] uppercase mb-4 text-[10px] tracking-widest mb-2 rounded-full py-2 px-4 border w-[fit-content]`}>
            Electronic Hub
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold">CLEOPE</h1>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4">ENTERTAINMENT HUB</h1>
          <p className="text-[14px] md:text-[16px] text-neutral-300 max-w-lg mx-auto md:mx-0 mb-6">
            A dynamic organization created to offer concrete support to brands and venues, 
            in a constantly evolving fashion and lifestyle landscape.
          </p>
          <Link
            href="/nextevents"
            className="inline-flex items-center gap-2 bg-white text-black pl-5 pr-2 py-1 text-[14px] rounded-full hover:bg-neutral-200 transition"
          >
            Explore Next Events
            <div className="bg-black m-1 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="20px" height="20px" viewBox="0 0 640 640">
                <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/>
              </svg>
            </div>
          </Link>
        </div>

        {/* Circle with video right */}
        <div className="z-20 flex items-center justify-center w-[60vw] h-[60vw] sm:w-[50vw] sm:h-[50vw] md:w-[40vw] md:h-[40vw] lg:w-[30vw] lg:h-[30vw] rounded-full overflow-hidden shadow-2xl border border-white/20 md:mr-[8vw]">
          <video
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/videocross.mp4?alt=media&token=08c66b8c-6d38-42df-a98c-b40c6f050835"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover rounded-full"
          />
        </div>

      </section>

      {/* UPCOMING EVENTS */}
      {loadingEvents && (
        <section className="w-full py-24 bg-gradient-to-b from-black to-blue-950 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Upcoming Events</h2>

            {events.length === 0 ? (
              <p>No upcoming events.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="relative rounded-lg overflow-hidden group shadow-lg cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <Image
                      src={event.img ?? "/fallback.jpg"}
                      alt={event.title}
                      width={800}
                      height={600}
                      className="object-cover w-full h-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                      <span className="text-xs bg-white/10 px-3 py-1 rounded-full w-fit backdrop-blur-sm">
                        {event.tag}
                      </span>
                      <h4 className="text-xl font-bold">{event.title}</h4>
                      <div className="text-sm text-neutral-300 flex justify-between">
                        <span>{new Date(event.date).toLocaleDateString("it-IT")}</span>
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="w-full py-20 px-6 bg-black text-white">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          {/* Riquadro grande */}
          <div className="relative rounded-[20px] overflow-hidden shadow-xl h-[60vh] flex items-center justify-center">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/33.jpg?alt=media&token=f9ee79ed-f732-4c47-b80e-c72f5906ef2d"
              alt="Aesthetic Parties"
              fill
              className="object-cover object-center blur-xs opacity-90"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 text-center max-w-lg px-6">
              <p className="uppercase mb-4 text-[10px] tracking-widest rounded-full py-2 px-4 border bg-[#ffffff47] text-[#fff] border-[#fff] w-fit mx-auto">
                Features
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Aesthetic Parties</h2>
              <p className="text-neutral-300 mb-6 leading-relaxed max-w-2xl">
                Unconventional events where <span className="text-white font-semibold">fashion</span>, 
                <span className="text-white font-semibold"> music</span>, and 
                <span className="text-white font-semibold"> nightlife</span> merge into one immersive experience.  
                Every party is designed to spark <span className="italic">creativity</span>,  
                connect unique communities, and create memories that last long after the night ends.  
                <br /><br />
                <span className="text-white font-medium">Step into a new era of entertainment</span> — where every detail is style, sound, and energy. 
              </p>

              <Link
            href="/nextevents"
            className="inline-flex items-center gap-2 bg-white text-black pl-5 pr-2 py-1 text-[14px] rounded-full hover:bg-neutral-200 transition"
          >
            Explore Next Events
            <div className="bg-black m-1 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="20px" height="20px" viewBox="0 0 640 640">
                <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/>
              </svg>
            </div>
          </Link>
            </div>
          </div>

          {/* Due riquadri piccoli affiancati */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative rounded-[20px] overflow-hidden shadow-lg h-[40vh] flex items-center justify-center">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0504.JPG?alt=media&token=006592a8-dad0-4293-b0dd-4264d4838517"
                alt="DJ Sets"
                fill
                className="object-cover object-center blur-xs opacity-90"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 text-center px-6">
                <p className="uppercase mb-4 text-[10px] tracking-widest rounded-full py-2 px-4 border bg-[#ffffff47] text-[#fff] border-[#fff] w-fit mx-auto">
                  Highlights
                </p>
                <h3 className="text-2xl md:text-3xl font-semibold mb-2">DJ Sets & Booking</h3>
               <p className="text-neutral-300 text-sm max-w-xs mx-auto leading-relaxed">
                Live performances with <span className="text-white font-semibold">international DJs</span>,  
                curated lineups, and unique vibes across Europe’s most iconic clubs.  
                <span className="italic">Feel the energy, follow the rhythm, and be part of the movement.</span>
              </p>
              </div>
            </div>

            <div className="relative rounded-[20px] overflow-hidden shadow-lg h-[40vh] flex items-center justify-center">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0520.JPG?alt=media&token=a8ee1067-51eb-415f-99be-ba02a4ac0ec4"
                alt="Booking"
                fill
                className="object-cover object-center blur-xs opacity-90"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 text-center px-6">
                <p className="uppercase mb-4 text-[10px] tracking-widest rounded-full py-2 px-4 border bg-[#ffffff47] text-[#fff] border-[#fff] w-fit mx-auto">
                  Exclusive
                </p>
                <h3 className="text-2xl md:text-3xl font-semibold mb-2">Events Producion</h3>
                <p className="text-neutral-300 text-sm max-w-xs mx-auto mb-4 leading-relaxed">
                  Full-service <span className="text-white font-semibold">event production</span>,  
                  from creative direction to staging, lights, and sound.  
                  We design unforgettable nights where every detail matters.
                </p>
              </div>
            </div>
          </div>

           <div className="relative rounded-[20px] overflow-hidden shadow-xl h-[70vh] flex items-center justify-center">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/22.jpg?alt=media&token=2e1d4838-e609-4af8-953c-832440de605d"
              alt="Aesthetic Parties"
              fill
              className="object-cover object-center blur-xs opacity-90"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 text-center max-w-lg px-6">
              <p className="uppercase mb-4 text-[10px] tracking-widest rounded-full py-2 px-4 border bg-[#ffffff47] text-[#fff] border-[#fff] w-fit mx-auto">
                Features
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Community</h2>
              <p className="text-neutral-300 mb-6 leading-relaxed max-w-2xl">
                Beyond the music and fashion, CLEOPE is a <span className="text-white font-semibold">nationwide community</span>  
                that connects people across Italy.  
                <br /><br />
                Our network is <span className="text-white font-semibold">targeted and curated by interests</span>,  
                giving members the chance to find their tribe and grow together.  
                With exclusive guest lists for the <span className="text-white font-semibold">best clubs, pop-ups, and events in the country</span>,  
                our community is your key to the most authentic nightlife experiences.  
              </p>


              <Link
            href="/nextevents"
            className="inline-flex items-center gap-2 bg-white text-black pl-5 pr-2 py-1 text-[14px] rounded-full hover:bg-neutral-200 transition"
          >
            Explore Next Events
            <div className="bg-black m-1 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="20px" height="20px" viewBox="0 0 640 640">
                <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/>
              </svg>
            </div>
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
            className="w-[fit-content] inline-flex items-center gap-2 bg-white text-black pl-5 pr-2 py-1 text-[14px] rounded-full hover:bg-neutral-200 transition"
            >
              {loading ? "Submitting..." : "Subscribe"}
              <div className="bg-black m-1 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="20px" height="20px" viewBox="0 0 640 640">
                <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/>
              </svg>
            </div>
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center px-4">
          <div className="relative w-full max-w-2xl bg-black rounded-lg overflow-hidden">
            <Image src={selectedEvent.img ?? "/fallback.jpg"} alt={selectedEvent.title} width={800} height={400} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{selectedEvent.title}</h3>
              <p className="text-sm text-neutral-300 mb-2">{selectedEvent.description}</p>
              <p className="text-sm text-neutral-400 mb-6">
                {new Date(selectedEvent.date).toLocaleDateString('it-IT')} — {selectedEvent.time}
              </p>
              <div className="flex gap-4">
                <Link href="/tables" className="bg-white text-black px-4 py-2 text-xs uppercase rounded hover:bg-neutral-200">Book Table</Link>
                <Link href={selectedEvent.entryLink ?? `/tickets?event=${selectedEvent.id}`} target="_blank" className="border border-white text-white px-4 py-2 text-xs uppercase rounded hover:bg-white hover:text-black transition">
                  Get Tickets
                </Link>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-white text-xl">✕</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
