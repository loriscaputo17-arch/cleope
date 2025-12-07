'use client'

import { useEffect } from "react"

export default function CleopeSoundKosmiPage() {

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://w.soundcloud.com/player/api.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden px-6 md:px-20 py-24">

      {/* 🔥 FULLSCREEN BLURRED BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-xs opacity-80 scale-110"
        style={{
          backgroundImage: "url('/images/sound/kosmi.png')"
        }}
      />

      {/* OPTIONAL OVERLAY PER RENDERE TUTTO PIÙ LEGGIBILE */}
      <div className="absolute inset-0 bg-black/60" />

      {/* HEADER */}
      <section className="relative z-10 text-center mb-20 mt-10">

        <h2 className="uppercase tracking-[0.35em] text-white/50 text-xs mb-3">
          Artist Spotlight — New Release
        </h2>

        <h3 className="text-4xl md:text-6xl font-bold tracking-wide mb-4">
          KOSMI <p className="text-sm font-light text-[#fff]">Point of Views</p>
        </h3>
      </section>

      {/* SOUNDCLOUD PLAYER */}
      <section className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-10 shadow-2xl max-w-3xl mx-auto">
        <h4 className="uppercase tracking-[0.25em] text-xs text-white/50 mb-6 text-center">
          Listen Now
        </h4>

        <iframe
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/kosmi/pointofviews&color=%23dd0005&inverse=false&auto_play=false&show_user=true"
          className="rounded-xl "
        />
      </section>

      {/* BIO */}
      <section className="relative z-10 mt-24 max-w-3xl mx-auto">
        <h4 className="uppercase tracking-[0.25em] text-xs text-white/40 mb-8 text-center">
          About the Artist
        </h4>

        <p className="text-white/70 text-sm md:text-base leading-relaxed">
          Kosmi is an Italian DJ, producer, and artistic director with over a decade
          of experience in the electronic and Afro House scene. He founded formats
          such as JUMBLE, Mosaiko, and CLEOPE and has performed on major stages
          worldwide. His releases span Virgin, Sony, Warner, and more.
        </p>
      </section>

      {/* FOOTER */}
      <p className="relative z-10 mt-24 text-center text-[10px] text-white/40 uppercase tracking-[0.25em] mb-10">
        Cleope Sound — Discover the Unheard
      </p>

    </main>
  )
}
