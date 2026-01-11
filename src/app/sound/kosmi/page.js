'use client'

import { useEffect } from "react"
import { Instagram, Music2, Youtube, PlayCircle, Calendar, Music, Radio } from "lucide-react"
import VideoTabsSection from "../../components/videotabsection"
import ArtistTabsSection from "../../components/artisttabsection"

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
    <main className="min-h-screen bg-black text-white relative overflow-hidden pb-20 font-sans">

      {/* 1. HERO SECTION: BACKGROUND & LOGO */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 h-[96vh]"
          style={{ 
            backgroundImage: "url('/images/sound/kosmi.png')",
            filter: "contrast(1.2) brightness(0.7)" 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
          <h2 className="uppercase tracking-[0.6em] text-white/40 text-[10px] md:text-xs mb-8">
            Cleope Sound Artist
          </h2>
          
          <div className="relative group transition-transform duration-1000">
            <img 
              src="/images/sound/kosmisign.png" 
              alt="Kosmi Signature" 
              className="w-[280px] md:w-[500px] lg:w-[700px] h-auto drop-shadow-[0_0_50px_rgba(255,255,255,0.15)]"
            />
          </div>

          <div className="flex gap-8 justify-center items-center mt-12 bg-white/5 backdrop-blur-xl py-4 px-10 rounded-full border border-white/10">
            <a href="https://www.instagram.com/kosmi_____/" target="_blank" className="text-white/60 hover:text-white transition-all transform hover:scale-110"><Instagram size={20} /></a>
            <a href="#" className="text-white/60 hover:text-white transition-all transform hover:scale-110"><Music2 size={20} /></a>
            <a href="#" className="text-white/60 hover:text-white transition-all transform hover:scale-110"><Youtube size={20} /></a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 animate-bounce">
            <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* CONTENUTO INIZIO */}
      <div className="relative z-10 px-6 md:px-20">

        {/* 3. BIO SECTION */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="grid md:grid-cols-[1fr_2fr] gap-16">
            {/* Colonna Sinistra: Titolo e Numero */}
            <div className="space-y-4">
              <span className="text-red-600 font-bold tracking-tighter text-5xl">01</span>
              <h3 className="text-3xl font-bold uppercase tracking-tighter leading-none">
                The <br /> Artist
              </h3>
            </div>

            {/* Colonna Destra: Bio e Dettagli */}
            <div className="space-y-12">
              
              {/* Bio Principale */}
              <div className="space-y-6">
                <p className="text-white/80 text-lg md:text-xl leading-relaxed font-light italic border-l-2 border-white/10 pl-6">
                  "Kosmi è stato per 12 anni dj resident del party Akeem di Zamunda al Rocket Club di Milano. 
                  Fondatore di JUMBLE e creatore della crew AfroHouse <span className="text-white font-medium italic">Mosaiko</span>, 
                  dal 2024 è promoter del Giovedì al VOLT Milano con il format CLEOPE."
                </p>
                <p className="text-white/60 text-base leading-relaxed">
                  Manager di artisti come Highsnob e Fresh Mula, ha ricoperto il ruolo di 
                  <span className="text-white"> Talent Scout per ULTRA MUSIC PUBLISHING</span> per 4 anni.
                </p>
              </div>

              {/* Radio & Mix */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-bold mb-4">Mix & Radio</h4>
                  <ul className="text-white/50 text-xs space-y-2 uppercase tracking-wider leading-loose">
                    <li>• Rinse FM</li>
                    <li>• Ibiza Global Radio</li>
                    <li>• Mad Decent (Special for Diplo)</li>
                    <li>• Radio Deejay (One Two One Two)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-bold mb-4">Main Festivals</h4>
                  <ul className="text-white/50 text-xs space-y-2 uppercase tracking-wider leading-loose">
                    <li>• Miami WMC</li>
                    <li>• Kappa Future Festival</li>
                    <li>• Love Festival (Belgrado)</li>
                    <li>• MTV Day & Digital Days</li>
                  </ul>
                </div>
              </div>

              {/* Discografia Highlight */}
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-bold mb-6">Selected Discography</h4>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 scrollbar-hide">
                  <div className="group">
                    <span className="text-white/30 text-[10px] block">2024</span>
                    <p className="text-sm text-white/80 group-hover:text-white transition-colors">Wonderwall / Lights On / Somebody That I Used To Know</p>
                    <p className="text-[10px] text-white/40 italic">Tropical House Records / Union Records</p>
                  </div>
                  <div className="group border-t border-white/5 pt-3">
                    <span className="text-white/30 text-[10px] block">2021</span>
                    <p className="text-sm text-white/80 group-hover:text-white transition-colors">Highsnob - Yang & 23 Coltellate (Traccia Oro)</p>
                    <p className="text-[10px] text-white/40 italic">Sony Music / Believe</p>
                  </div>
                  <div className="group border-t border-white/5 pt-3">
                    <span className="text-white/30 text-[10px] block">2018</span>
                    <p className="text-sm text-white/80 group-hover:text-white transition-colors">Maledetta Primavera / Cocaina / One Two Compilation</p>
                    <p className="text-[10px] text-white/40 italic">Universal / Warner Music</p>
                  </div>
                  <div className="group border-t border-white/5 pt-3 opacity-60">
                    <span className="text-white/30 text-[10px] block">Heritage 1999-2013</span>
                    <p className="text-sm text-white/70 italic leading-relaxed">
                      Casa Del Fico (Virgin), Poogliatribe (Sony), Freakshow (Mad Decent Remix), 88BROS Album.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. SCHEDULE & UPCOMING RELEASES (TABS) */}
        <ArtistTabsSection />

        {/* 5. VIDEO SECTION (TABS) */}
        <div className="mb-10">
           <VideoTabsSection />
        </div>

        {/* 6. GALLERY */}
       <section className="max-w-7xl mx-auto mb-40">
          <h4 className="uppercase tracking-[0.4em] text-[10px] text-white/30 mb-12 text-center">In Action</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-4">
                <img src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/kosmi%2Ffoto%2FCREDITS%20%20%23milan%20%23centralstation-6265.jpg?alt=media&token=acdac707-b621-4b10-8ec9-b9b3bb8cb5ec" className="w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-500" alt="kosmi" />
                <img src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/kosmi%2Ffoto%2FScreenshot%202026-01-11%20at%2014.52.04.png?alt=media&token=150cf1ac-b045-4943-85fd-6b1f00eaec5b" className="w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-500" alt="kosmi" />
            </div>
            <div className="pt-8 space-y-4">
                <img src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/kosmi%2Ffoto%2FCREDITS%20%20%23milan%20%23centralstation-6507.jpg?alt=media&token=ec7499ed-f2c9-444b-b542-e1284f6f060d" className="w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-500" alt="kosmi" />
                <img src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/kosmi%2Ffoto%2FCREDITS%20%20%23milan%20%23centralstation-6547.jpg?alt=media&token=a8fd2864-c068-419a-b0e0-86cdf6714ad6" className="w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-500" alt="kosmi" />
            </div>
            <div className="space-y-4">
                <img src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/kosmi%2Ffoto%2FCREDITS%20%20%23milan%20%23centralstation-6678.jpg?alt=media&token=15e8a3e7-cf6a-4af7-8ab3-808de7ce269c" className="w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-500" alt="kosmi" />
                <img src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/kosmi%2Ffoto%2FCREDITS%20%23milan%20%23centralstation-6825.jpg?alt=media&token=a080794f-9257-4860-9867-35b977f2fe6c" className="w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-500" alt="kosmi" />
            </div>
            <div className="pt-8 space-y-4">
                <img src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/kosmi%2Ffoto%2FScreenshot%202026-01-11%20at%2014.52.15.png?alt=media&token=d1453fe9-947a-4b6d-985a-805c96081698" className="w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-500" alt="kosmi" />
                <img src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/kosmi%2Ffoto%2FScreenshot%202026-01-11%20at%2014.52.36.png?alt=media&token=213de720-879b-44f6-b51e-22f1d055ddbc" className="w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-500" alt="kosmi" />
            </div>
          </div>
        </section>

        {/* 7. FOOTER */}
        <footer className="py-24 text-center border-t border-white/5">
          <img src="/images/sound/kosmisign.png" alt="Kosmi" className="w-24 mx-auto opacity-10 mb-8" />
          <p className="text-[10px] text-white/20 uppercase tracking-[0.8em]">
            Cleope Sound Artist — 2026
          </p>
        </footer>
      </div>
    </main>
  )
}