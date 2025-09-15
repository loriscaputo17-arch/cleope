'use client'

import { useEffect, useState } from "react";
import Image from 'next/image';

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:120px_120px]" />
        
        <div className="relative z-10 px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-widest mb-4">
            The Hub
          </h1>
          <p className="max-w-xl mx-auto text-lg md:text-xl text-neutral-300">
            An Entertainment Idea. With Made in Italy Culture.
          </p>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="relative py-24 px-6 text-center border-t border-neutral-800">
        <h2 className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-4">
          Features
        </h2>
        <h3 className="text-4xl md:text-5xl font-bold uppercase mb-6">
          Our Mission
        </h3>
        <p className="max-w-3xl mx-auto text-neutral-300 leading-relaxed text-base md:text-lg">
          At CLEOPE HUB, we blend music, fashion, and connections through carefully curated nights and collaborations. 
          Our events create value for artists, brands, and communities, building spaces for new ideas to meet, grow and inspire.
        </p>
      </section>

      <section className="relative flex flex-col md:flex-row items-center gap-12 py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="w-full md:w-1/2 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0523.JPG?alt=media&token=ce2b3ad8-eb40-4fca-8814-95bb549adbd2"
            alt="CLEOPE background"
            fill
            quality={70}
            className="object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 text-left md:text-right space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">
            Who We Are
          </h3>
          <p className="text-neutral-300 text-base leading-relaxed">
            CLEOPE HUB is a <span className="text-white font-semibold">creative collective</span> where  
            <span className="text-white font-semibold">music, fashion, and people</span> seamlessly come together.  
            <br /><br />
            Each event goes beyond entertainment — it’s a <span className="italic">curated experience</span>  
            where sound, style, and ideas merge into something unique.  
            <br /><br />
            We stand for <span className="text-white font-semibold">quality</span>,  
            <span className="text-white font-semibold">creativity</span>, and a  
            <span className="text-white font-semibold">new way of living culture together</span>.  
          </p>

        </div>
      </section>

      <section className="relative py-28 px-6 text-center border-t border-neutral-800 bg-black overflow-hidden">
        <p className="max-w-3xl mx-auto text-2xl md:text-3xl uppercase tracking-[0.2em] font-semibold text-white relative z-10">
          From club nights to showcases, each project builds visibility, connections and lasting stories.
        </p>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:140px_140px]" />
      </section>

      <section className="relative flex flex-col md:flex-row items-center gap-12 py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="w-full md:w-1/2 text-left space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">
            Why Cleope?
          </h3>
          <p className="text-neutral-300 leading-relaxed max-w-2xl">
            Venues choose us for the <span className="text-white font-semibold">network we connect</span>,  
            the <span className="text-white font-semibold">targeted visibility</span> we deliver,  
            and our ability to provide <span className="text-white font-semibold">all-in-one production and services</span>  
            with consistently <span className="text-white font-semibold">high-quality performances</span>.  
            <br /><br />
            At CLEOPE, we act as a <span className="italic">true partner</span> — not just an organizer —  
            building long-term value for every venue we collaborate with.  
          </p>

        </div>
        <div className="w-full md:w-1/2 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/IMG_0507.JPG?alt=media&token=c4211af3-dbe5-474a-8459-65d3af342fb2"
            alt="CLEOPE background"
            fill
            quality={70}
            className="object-cover"
          />
        </div>
      </section>

      <section className="relative flex flex-col md:flex-row items-center gap-12 py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="w-full md:w-1/2 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/44.jpg?alt=media&token=bea30554-3da5-4d0b-b8a8-c9dced58312f"
            alt="CLEOPE background"
            fill
            quality={70}
            className="object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 text-left md:text-right space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">
            Production Events
          </h3>
          <p className="text-neutral-300 text-base leading-relaxed">
            We collaborate with <span className="text-white font-semibold">top–tier partners</span> such as  
            <span className="text-white font-semibold"> Next Show</span>, bringing expertise gained through  
            years of experience in <span className="italic">concerts, festivals, and national tours</span>.  
            <br /><br />
            Their portfolio includes some of Italy’s most iconic productions:  
            <span className="text-white font-semibold"> Marrageddon</span>,  
            <span className="text-white font-semibold"> Milan Games Week 2022</span>, and  
            <span className="text-white font-semibold"> Tha Sup Box Fight 2020</span>.  
            <br /><br />
            Together, we provide <span className="text-white font-medium">unparalleled quality and innovation</span>  
            to every CLEOPE project, raising the standards of entertainment.  

          </p>
        </div>
      </section>

      <section className="relative flex flex-col md:flex-row items-center gap-12 py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="w-full md:w-1/2 text-left space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">
            Creative Hub
          </h3>
          <p className="text-neutral-300 text-base leading-relaxed">
            We have the possibility to collaborate with: <span className="text-white font-semibold"> Studio Cirasa</span>, which is a creative hub that manages projects from concept to completion.
            <br /><br />
            With expertise in photography, 3D, video, art direction, production,
            installations, and concept design,
            they support clients through every stage of the <span className="text-white font-semibold"> creative process.</span>
            <br /><br />
            From initial idea to final execution,
            by transforming visions into tangible and engaging experiences.
          </p>
        </div>
        <div className="w-full md:w-1/2 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/55.jpg?alt=media&token=3e608df0-229c-4c2e-be49-8adbbd72dfab"
            alt="CLEOPE background"
            fill
            quality={70}
            className="object-cover"
          />
        </div>
      </section>
      
    </main>
  );
}
