'use client'

import { useEffect } from "react"

export default function CleopeSoundKosmiPage() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = "https://w.soundcloud.com/player/api.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden px-6 md:px-20 py-16">

      <h1 className="absolute inset-0 flex items-center justify-center text-[22vw] md:text-[11vw] font-black opacity-[0.04] tracking-tighter select-none pointer-events-none text-[#dd0005] leading-none">
        CLEOPE
      </h1>

      <section className="relative z-10 text-center mb-16 animate-fadeIn">
        <img
          src="/images/sound/kosmi.png"
          alt="KOSMI Logo"
          className="w-64 mx-auto mb-6 drop-shadow-xl"
        />

        <h2 className="uppercase text-white/60 text-[10px] mb-2">
          Artist Spotlight — New Release
        </h2>

        <h3 className="text-3xl md:text-5xl font-bold tracking-wide mb-6">
          KOSMI
        </h3>

      </section>

      <section className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-10 shadow-lg max-w-3xl mx-auto animate-fadeIn">
        <h4 className="uppercase tracking-[0.25em] text-xs text-white/50 mb-4 text-center">
          Listen Now
        </h4>

        <div className="flex justify-center">
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/kosmi/pointofviews&color=%23dd0005&inverse=false&auto_play=false&show_user=true"
            className="rounded-xl shadow-lg"
          ></iframe>
        </div>
      </section>

      <section className="relative z-10 mt-20 max-w-3xl mx-auto animate-fadeIn">
        <h4 className="uppercase tracking-[0.25em] text-xs text-white/40 mb-6 text-center">
          About the Artist
        </h4>

        <p className="text-white/70 text-sm leading-relaxed">
          Kosmi is an Italian DJ, producer, and artistic director, active for over ten years and recognized for his Afro House and contemporary electronic sound.
            A longtime resident in several Milan venues, he was the founder of formats such as JUMBLE, Mosaiko, and CLEOPE.
            He has performed at international festivals, released music with major labels including Virgin, Sony, and Warner, and works as a Talent Scout for Ultra Music Publishing.
            His mixes have been broadcast on Rinse FM, Ibiza Global Radio, Mad Decent, and Radio Deejay.
            He also boasts gold record certifications in Italy.
        </p>
      </section>

      <p className="relative z-10 mt-20 text-center text-[10px] text-white/40 uppercase tracking-[0.25em]">
        Cleope Sound<br></br>Discover the Unheard
      </p>
    </main>
  )
}
