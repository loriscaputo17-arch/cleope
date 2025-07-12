'use client'

import { useEffect, useState } from "react";

export default function AboutPage() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTime(now);
  }, []);

  return (
    <main className="w-full bg-black text-white">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/hero-bg.mp4"
          autoPlay
          muted
          loop
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-widest mb-4">
            The Hub
          </h1>
          <p className="max-w-xl mx-auto text-base md:text-lg tracking-wide">
            An Entertainment Idea. Milan Based.
          </p>
        </div>
      </section>

      {/* SECTION */}
      <section className="relative py-20 px-4 text-center border-t border-neutral-700">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-white"></div>
        <h2 className="text-3xl md:text-4xl font-bold uppercase mb-4 tracking-widest">
          | Our Mission |
        </h2>
        <p className="max-w-2xl mx-auto text-neutral-200 leading-relaxed text-sm md:text-base">
          At CLEOPE HUB, we blend music, fashion, and connections through carefully curated nights and collaborations. Our events create real value for artists, brands, and communities. We build spaces for new ideas to meet, grow and inspire.
        </p>
      </section>

      {/* IMAGE + TEXT */}
      <section className="relative flex flex-col md:flex-row items-center gap-10 py-20 px-4 md:px-12 mr-auto ml-auto md:max-w-[80vw] max-w-[90vw]">
        <div className="w-full md:w-1/2">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0523.JPG?alt=media&token=ce2b3ad8-eb40-4fca-8814-95bb549adbd2"
            alt="Team"
            className="w-full rounded-md object-cover shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2 text-left md:text-right space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wider">
            Who We Are |
          </h3>
          <p className="text-neutral-200 text-sm md:text-base leading-relaxed">
            CLEOPE HUB is a creative collective that connects music, fashion, and people. Every event is more than entertainment — it’s a curated space where sound, style, and ideas merge. We stand for quality, creativity, and a fresh way to live culture together.
          </p>
        </div>
        {/* Decorative Line */}
      </section>

      {/* QUOTE SECTION */}
      <section className="relative py-20 px-4 md:px-12 text-center border-t border-neutral-700 overflow-hidden bg-black">
        {/* Testo */}
        <p className="max-w-3xl mx-auto text-lg md:text-2xl uppercase tracking-[0.3em] font-semibold mt-8 text-white">
          From club nights to showcases, each project builds visibility, connections and lasting stories.
        </p>
        
        {/* Linea centrale */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-neutral-700"></div>

        {/* Cerchio decorativo */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white rounded-full"></div>

        {/* Quadrato ruotato */}
        <div className="absolute bottom-8 left-[15%] w-10 h-10 border-2 border-white rotate-45"></div>

        {/* Triangolo */}
        <div className="absolute bottom-8 right-[15%] w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[34px] border-t-white"></div>

        {/* Linee diagonali sottili */}
        <div className="absolute top-0 left-0 w-32 h-px bg-neutral-700 rotate-45 origin-top-left"></div>
        <div className="absolute top-0 right-0 w-32 h-px bg-neutral-700 -rotate-45 origin-top-right"></div>
      </section>

      {/* TEAM SECTION */}
      <section className="relative py-20 px-4 md:px-12 text-center border-t border-neutral-700">
        <h2 className="text-3xl md:text-4xl font-bold uppercase mb-4 tracking-widest">
          | Meet the Vision |
        </h2>
        <p className="max-w-2xl mx-auto text-neutral-200 leading-relaxed text-sm md:text-base mb-12">
          Behind CLEOPE HUB is a diverse group of creatives, artists, and visionaries shaping Milan’s nightlife and culture.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <h4 className="font-bold uppercase tracking-wide">Events</h4>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-bold uppercase tracking-wide">Dj sets</h4>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-bold uppercase tracking-wide">Aesthetic Parties</h4>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-bold uppercase tracking-wide">Booking</h4>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-bold uppercase tracking-wide">Creative Hub</h4>
          </div>
        </div>
      </section>

<section className="relative flex flex-col md:flex-row items-center gap-10 py-20 px-4 md:px-12 mr-auto ml-auto md:max-w-[80vw] max-w-[90vw]">
        <div className="w-full md:w-1/2 text-left md:text-left space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wider">
            | Why Cleope?
          </h3>
          <p className="text-neutral-200 text-sm md:text-base leading-relaxed">
            Venues choose us for the network that we bring, focused visibility, all-in-one production and services, high-quality performances.
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0507.JPG?alt=media&token=c4211af3-dbe5-474a-8459-65d3af342fb2"
            alt="Team"
            className="w-full rounded-md object-cover shadow-lg"
          />
        </div>
        
        {/* Decorative Line */}
      </section>

      {/* FOOTER */}
      
    </main>
  );
}
