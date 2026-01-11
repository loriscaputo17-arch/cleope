'use client'

import { useEffect } from "react"
import { Instagram, Music2, Youtube, PlayCircle } from "lucide-react"

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
    <main className="min-h-screen bg-black text-white relative overflow-hidden pb-20">

      {/* 1. HERO SECTION: PARALLAX-LIKE BACKGROUND & LOGO PNG */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6">
        
        {/* Background Artist Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ 
            backgroundImage: "url('/images/sound/kosmi.png')",
            filter: "contrast(1.1) brightness(0.8)" 
          }}
        />
        
        {/* Overlay sfumato per profondità */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

        {/* Content Overlay */}
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
          <h2 className="uppercase tracking-[0.6em] text-white/40 text-[10px] md:text-xs mb-8 animate-pulse">
            Cleope Sound Presents
          </h2>
          
          {/* LOGO PNG - IL NICKNAME SOPRA IL BACKGROUND */}
          <div className="relative group transition-transform duration-700 hover:scale-105">
            <img 
              src="/images/sound/kosmisign.png" 
              alt="Kosmi Signature" 
              className="w-[300px] md:w-[500px] lg:w-6800px] h-auto drop-shadow-[0_0_35px_rgba(255,255,255,0.1)]"
            />
          </div>

          {/* SOCIAL LINKS - Minimal & Chic */}
          <div className="flex gap-8 justify-center items-center mt-12 bg-black/20 backdrop-blur-md py-4 px-8 rounded-full border border-white/5">
            <a href="#" className="text-white/60 hover:text-white transition-all transform hover:scale-110"><Instagram size={22} /></a>
            <a href="#" className="text-white/60 hover:text-white transition-all transform hover:scale-110"><Music2 size={22} /></a>
            <a href="#" className="text-white/60 hover:text-white transition-all transform hover:scale-110"><Youtube size={22} /></a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
            <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* CONTENUTO PRINCIPALE */}
      <div className="relative z-10 px-6 md:px-20">
        
        {/* 2. PLAYER SECTION (MIX TAPE) */}
        <section className="max-w-5xl mx-auto -mt-16 mb-32">
          <div className="bg-[#0a0a0a] backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
             <div className="flex items-center gap-3 mb-6">
                <PlayCircle className="text-red-600" size={20} />
                <h4 className="uppercase tracking-[0.3em] text-[10px] text-white/60 font-semibold">Latest Mixtape</h4>
             </div>
             <iframe
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/kosmi/pointofviews&color=%23dd0005&inverse=true&auto_play=false&show_user=true"
              className="rounded-xl filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </section>

        <section className="max-w-4xl mx-auto mb-40">
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
                  dal 2024 è promoter del Giovedì al VOLT Milano."
                </p>
                <p className="text-white/60 text-base leading-relaxed">
                  Manager di artisti come Highsnob e Fresh Mula, dal 2019 ricopre il ruolo di 
                  <span className="text-white"> Talent Scout per ULTRA MUSIC PUBLISHING</span> sotto la direzione di Patrick Moxey.
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

        {/* 4. VIDEO SECTION - Vertical Reel Style (Max 300px) */}
        <section className="max-w-7xl mx-auto mb-40 px-4">
          <h4 className="uppercase tracking-[0.4em] text-[10px] text-white/30 mb-12 text-center">
            Visual Experiences
          </h4>
          
          {/* Griglia centrata: i video si dispongono in riga su desktop e colonna su mobile */}
          <div className="flex flex-wrap justify-center gap-8">
            
            {/* Video Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-2xl w-full max-w-[300px]">
              <div className="aspect-[9/16] overflow-hidden bg-black">
                <video 
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  poster="/images/sound/video-placeholder-1.jpg"
                >
                  <source src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/sound%2Fkosmi1.mp4?alt=media&token=28990f16-2616-4005-80e8-d169b9cb70b6" type="video/mp4" />
                  Il tuo browser non supporta il tag video.
                </video>
              </div>
              
              {/* Label Info Sotto */}
              <div className="p-5 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/5 text-center">
                <p className="text-[9px] uppercase tracking-[0.3em] text-red-600 font-bold mb-1 italic">Live</p>
                <h5 className="text-[11px] uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors">
                  Live @HouseParty
                </h5>
              </div>
            </div>

            {/* Video Card 2 - Copia questa struttura per altri video */}
            <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-2xl w-full max-w-[300px]">
              <div className="aspect-[9/16] overflow-hidden bg-black">
                <video 
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/sound%2Fkosmi2.mp4?alt=media&token=c17c9fcf-59ca-4b82-957a-6f4faef1fb32" type="video/mp4" />
                </video>
              </div>
              <div className="p-5 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/5 text-center">
                <p className="text-[9px] uppercase tracking-[0.3em] text-red-600 font-bold mb-1 italic">Live</p>
                <h5 className="text-[11px] uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors">
                  Live @HouseParty
                </h5>
              </div>
            </div>

          </div>
        </section>

        {/* 5. GALLERY SECTION - High End Grid */}
        <section className="max-w-7xl mx-auto mb-40">
          <h4 className="uppercase tracking-[0.4em] text-[10px] text-white/30 mb-12 text-center">In Action</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-4">
                <img src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/kosmi%2Ffoto%2FCREDITS%20%20%23milan%20%23centralstation-6265.jpg?alt=media&token=acdac707-b621-4b10-8ec9-b9b3bb8cb5ec" className="w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-500" alt="kosmi" />
                <img src="http://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/kosmi%2Ffoto%2FCREDITS%20%20%23milan%20%23centralstation-6265.jpg?alt=media&token=acdac707-b621-4b10-8ec9-b9b3bb8cb5ec" className="w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-500" alt="kosmi" />
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
                <img src="/images/sound/set3.jpg" className="w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-500" alt="kosmi" />
                <img src="/images/sound/kosmi.png" className="w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-500" alt="kosmi" />
            </div>
          </div>
        </section>

        {/* 6. FOOTER */}
        <footer className="py-20 text-center border-t border-white/5">
          <img src="/images/sound/kosmisign.png" alt="Kosmi" className="w-32 mx-auto opacity-20 mb-8" />
          <p className="text-[10px] text-white/20 uppercase tracking-[0.8em]">
            Cleope Sound — Discover the Unheard
          </p>
        </footer>
      </div>
    </main>
  )
}