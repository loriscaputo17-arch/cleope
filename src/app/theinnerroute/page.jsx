"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-02-07T20:30:00");

export default function TheInnerRouteLanding() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = EVENT_DATE - new Date();
      if (diff <= 0) return;

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-black text-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative min-h-[100svh] flex items-center justify-center">

        {/* Background Image */}
        <img
          src="https://i.pinimg.com/736x/01/49/1a/01491a0f20ea212db3392bf818bff17b.jpg"
            className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
          alt="The Inner Route Hero"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl flex flex-col items-center">

          
          <img
            src="/logo/logovesper.png"
            alt="VESPER"
            className="w-32 mx-auto mb-2 mt-[10rem]"
          />

          <img
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/locandine%2Fvesper%2Fintestazione.png?alt=media&token=006a3583-41d5-44e5-a306-c716c142b9d4"
            className="w-64 md:w-80 mb-10"
            alt="Vesper Logo"
          />

          {/* TITLE */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            THE INNER ROUTE
          </h1>

          {/* SHORT INTRO */}
          <p className="mt-6 text-sm md:text-base text-white/80 leading-relaxed max-w-xl">
            A five-part experiential journey introducing VESPER BEACH CLUB to Milan —
            unfolding through curated chapters, shared rituals and evolving narratives.
          </p>

          {/* COUNTDOWN */}
          <div className="mt-12 flex gap-8">
            {["days", "hours", "minutes", "seconds"].map((unit, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-light tracking-tight">
                  {timeLeft[unit]}
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/50 mt-1">
                  {unit}
                </span>
              </div>
            ))}
          </div>

          {/* CHAPTER I DESCRIPTION */}
          <p className="mt-10 text-xs md:text-sm text-white/65 leading-relaxed max-w-md">
            <span className="text-white">Part I</span> marks the beginning of the route —
            an intimate Milan chapter designed to slow down, connect and set the tone
            for what follows.
          </p>

          {/* CTA */}
          <a
            href="/formats/theinnerroute"
            className="mt-14 border border-white px-12 py-4 text-[11px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition"
          >
            Enter Part I
          </a>
        </div>
      </section>

      <section className="relative py-32 md:py-40 px-6 max-w-7xl mx-auto">

            <div className="grid md:grid-cols-12 gap-12 items-center">

                {/* IMAGE */}
                <div className="md:col-span-7 flex items-center gap-8">
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/locandine%2Fvesper%2F2.png?alt=media&token=b2d4e88e-200e-4456-92cc-b344e4a4f754"
                    className="h-[40vw] object-cover grayscale brightness-90"
                    alt="The Inner Route Project"
                />
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/locandine%2Fvesper%2F3.png?alt=media&token=4758b9ae-8009-436a-adbb-e4fdb6ef46ff"
                    className="h-[40vw] object-cover grayscale brightness-90"
                    alt="The Inner Route Project"
                />
                </div>

                {/* TEXT */}
                <div className="md:col-span-5 md:pl-10">
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/50 mb-8">
                    The Project
                </p>

                <h3 className="text-2xl md:text-3xl font-light leading-snug mb-8">
                    A route, not a format.
                </h3>

                <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8">
                    The Inner Route is conceived as a progressive cultural journey —
                    unfolding through carefully curated chapters rather than isolated events.
                </p>

                <p className="text-sm text-white/55 leading-relaxed max-w-md">
                    Each chapter explores sound, space and human connection, gradually shaping
                    the foundations of VESPER ahead of its Summer 2026 opening in Porto Cervo.
                </p>
                </div>

            </div>
            </section>


      <section className="relative py-32 md:py-40 px-6 max-w-6xl mx-auto">

  <p className="text-center text-[10px] uppercase tracking-[0.4em] text-white/50 mb-20">
    Creative Direction & Vision
  </p>

  <div className="grid md:grid-cols-2 gap-24 items-start">

    {/* CLEOPE */}
    <div>
      <img
        src="/logo/logowhite.png"
        className="w-28 mb-10"
        alt="CLEOPE"
      />

      <p className="text-lg font-light leading-relaxed mb-6">
        Curatorship & Cultural Direction
      </p>

      <p className="text-sm text-white/60 leading-relaxed max-w-sm">
        CLEOPE oversees the artistic direction, event formats, communication
        and digital ecosystem of The Inner Route, defining its tone, language
        and long-term narrative.
      </p>
    </div>

    {/* VESPER */}
    <div className="md:pt-24">
      <img
        src="/logo/logovesper.png"
        className="w-28 mb-10"
        alt="VESPER BEACH CLUB"
      />

      <p className="text-lg font-light leading-relaxed mb-6">
        Hospitality Concept
      </p>

      <p className="text-sm text-white/60 leading-relaxed max-w-sm">
        VESPER BEACH CLUB is a contemporary Mediterranean hospitality project,
        rooted in elegance, ritual and rhythm — opening in Porto Cervo,
        Summer 2026.
      </p>
    </div>

  </div>
</section>


      {/* ================= TIMELINE ================= */}
      <section className="py-24 md:py-32 px-6 max-w-4xl mx-auto">

        <p className="text-center text-[11px] uppercase tracking-[0.35em] text-white/50 mb-16">
          The Route
        </p>

        <div className="flex flex-col gap-12">

          {/* ACTIVE */}
          <div className="flex items-center justify-between border-b border-white/30 pb-8">
            <div>
              <p className="uppercase tracking-wider text-sm">Part I</p>
              <p className="text-xs text-white/50 mt-2">
                Milan · 07 February 2026
              </p>
            </div>

            <a
              href="/formats/theinnerroute"
              className="border border-white px-6 py-2 text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-black transition"
            >
              Open
            </a>
          </div>

          {/* LOCKED */}
          {["Part II", "Part III", "Part IV", "Part V"].map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-white/10 pb-8 opacity-40"
            >
              <div>
                <p className="uppercase tracking-wider text-sm">{c}</p>
                <p className="text-xs mt-2">Details to be revealed</p>
              </div>
              <span className="text-xs uppercase tracking-[0.3em]">
                Locked
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-20 text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
          Not a night. A journey. The Inner Route.
        </p>
      </footer>

      {/* ================= FIXED RSVP BAR ================= */}
    <div className="fixed bottom-0 left-0 w-full bg-white text-black z-50 overflow-hidden border-t border-black/10">
    <a
        href="/formats/theinnerroute/"
        className="whitespace-nowrap flex items-center h-12 animate-marquee cursor-pointer"
        >

                <span className="mx-8 text-xs uppercase tracking-[0.3em]">
                <span className="font-bold">The Inner Route  Part I</span> — Saturday February 7th 2026 · Milan · RSVP Now
                </span>
                <span className="mx-8 text-xs uppercase tracking-[0.3em]">
                <span className="font-bold">The Inner Route  Part I</span> — Saturday February 7th 2026 · Milan · RSVP Now
                </span>
                <span className="mx-8 text-xs uppercase tracking-[0.3em]">
                <span className="font-bold">The Inner Route  Part I</span> — Saturday February 7th 2026 · Milan · RSVP Now
                </span>
            </a>
    </div>


    </main>
  );
}
