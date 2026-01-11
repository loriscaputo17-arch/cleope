'use client'
import { useState } from "react"
import { Calendar, Music, Radio } from "lucide-react"
import { PlayCircle} from "lucide-react"

export default function ArtistTabsSection() {
  const [activeTab, setActiveTab] = useState('upcoming')

  return (
    <section className="max-w-7xl mx-auto mb-40">
      <div className="flex justify-center gap-6 md:gap-12 mb-12 border-b border-white/5">
        {[
          { id: 'upcoming', label: 'Upcoming', icon: Music },
          { id: 'mix', label: 'Music', icon: Radio },
          { id: 'dates', label: 'Dates', icon: Calendar },
          { id: 'old_dates', label: 'Last Dates', icon: Radio },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 uppercase tracking-[0.2em] text-[10px] transition-all cursor-pointer ${
              activeTab === tab.id ? "text-red-600 border-b-2 border-red-600" : "text-white hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[300px] animate-in fade-in duration-500">
        {/* TOUR DATES */}
        {activeTab === 'dates' && (
          <div className="space-y-4">
            {[
              { date: "28 FEB", club: "THE MERGE II", city: "Milano", event: "CLEOPE" },
              { date: "28 MAR", club: "THE MERGE III", city: "Milano", event: "CLEOPE" },
            ].map((show, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-6">
                  <span className="text-red-600 text-md font-bold tabular-nums w-35">{show.date}</span>
                  <div>
                    <h5 className="text-sm font-bold uppercase tracking-tight">{show.club}</h5>
                    <p className="text-[10px] text-white/40 uppercase">{show.city}</p>
                  </div>
                </div>
                <span className="text-[12px] text-white/50 uppercase tracking-widest hidden md:block">{show.event}</span>
              </div>
            ))}
          </div>
        )}

        {/* UPCOMING MUSIC */}
        {activeTab === 'upcoming' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-red-900/20 to-black rounded-2xl border border-red-900/30">
              <span className="text-[10px] text-red-500 font-bold uppercase">Febbraio 2026</span>
              <h5 className="text-xl font-bold mt-2">Caruso Remix</h5>
              <p className="text-sm text-white/50 mt-1">White Label</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 opacity-50">
              <span className="text-[10px] uppercase italic">In Produzione</span>
              <h5 className="text-xl font-bold mt-2">Secret ID</h5>
              <p className="text-sm text-white/50 mt-1">TBA</p>
            </div>
          </div>
        )}

        {/* MIX & RADIO */}
        {activeTab === 'mix' && (
          <div className="space-y-6">
             <section className="max-w-7xl mx-auto mb-32">
                <div className="bg-[#080808] backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                      <PlayCircle className="text-red-600" size={18} />
                      <h4 className="uppercase tracking-[0.3em] text-[10px] text-white/60 font-semibold">Featured Mixtape</h4>
                  </div>
                  <iframe
                    width="100%"
                    height="166"
                    scrolling="no"
                    frameBorder="no"
                    src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/kosmi/pointofviews&color=%23dd0005&inverse=true&auto_play=false&show_user=true"
                    className="rounded-xl filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </section>

          </div>
        )}

        {activeTab === 'old_dates' && (
          <div className="space-y-4">
            {[
              { date: "15 DIC 2024", club: "VOLT", city: "Milano", event: "CLEOPE" },
              { date: "4 MAG 2025", club: "TANTRA", city: "IBIZA", event: "CLEOPE" },
              { date: "31 MAG 2025", club: "FORO ITALICO", city: "ROMA", event: "CLEOPE" },
              { date: "14 AGO 2025", club: "VESPER BEACH CLUB", city: "Porto Cervo", event: "CLEOPE" },
              { date: "11 OTT 2025", club: "SUPERCLUB", city: "Milano", event: "THE MERGE I" },
            ].map((show, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-6">
                  <span className="text-red-600 text-md font-bold tabular-nums w-35">{show.date}</span>
                  <div>
                    <h5 className="text-sm font-bold uppercase tracking-tight">{show.club}</h5>
                    <p className="text-[10px] text-white/40 uppercase">{show.city}</p>
                  </div>
                </div>
                <span className="text-[12px] text-white/50 uppercase tracking-widest hidden md:block">{show.event}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}