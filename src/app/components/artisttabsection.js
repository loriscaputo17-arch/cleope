'use client'
import { useState } from "react"
import { Calendar, Music, Radio } from "lucide-react"

export default function ArtistTabsSection() {
  const [activeTab, setActiveTab] = useState('dates')

  return (
    <section className="max-w-5xl mx-auto mb-40 px-4">
      <div className="flex justify-center gap-6 md:gap-12 mb-12 border-b border-white/5">
        {[
          { id: 'dates', label: 'Tour Dates', icon: Calendar },
          { id: 'upcoming', label: 'Upcoming', icon: Music },
          { id: 'mix', label: 'Mix & Radio', icon: Radio },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 uppercase tracking-[0.2em] text-[10px] transition-all cursor-pointer ${
              activeTab === tab.id ? "text-red-600 border-b-2 border-red-600" : "text-white/40 hover:text-white"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[300px] animate-in fade-in duration-500">
        {/* TOUR DATES */}
        {activeTab === 'dates' && (
          <div className="space-y-4">
            {[
              { date: "16 GEN", club: "VOLT", city: "Milano", event: "Mosaiko Night" },
              { date: "23 GEN", club: "Rocket Club", city: "Milano", event: "Akeem" },
              { date: "07 FEB", club: "Blue Marlin", city: "Ibiza", event: "Special Guest" },
            ].map((show, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-6">
                  <span className="text-red-600 font-bold tabular-nums w-12">{show.date}</span>
                  <div>
                    <h5 className="text-sm font-bold uppercase tracking-tight">{show.club}</h5>
                    <p className="text-[10px] text-white/40 uppercase">{show.city}</p>
                  </div>
                </div>
                <span className="text-[10px] text-white/20 uppercase tracking-widest hidden md:block">{show.event}</span>
              </div>
            ))}
          </div>
        )}

        {/* UPCOMING MUSIC */}
        {activeTab === 'upcoming' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-red-900/20 to-black rounded-2xl border border-red-900/30">
              <span className="text-[10px] text-red-500 font-bold uppercase">Febbraio 2026</span>
              <h5 className="text-xl font-bold mt-2">Tribal Spirit (EP)</h5>
              <p className="text-sm text-white/50 mt-1">Union Records</p>
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
             <div className="group border-b border-white/5 pb-4">
                <p className="text-[10px] text-white/30 uppercase">Rinse FM Guest Mix</p>
                <h5 className="text-sm font-medium group-hover:text-red-600 transition-colors">Afro House Journey Vol. 4</h5>
             </div>
             <div className="group border-b border-white/5 pb-4">
                <p className="text-[10px] text-white/30 uppercase">Radio Ibiza Global</p>
                <h5 className="text-sm font-medium group-hover:text-red-600 transition-colors">Sunset Session 2025</h5>
             </div>
          </div>
        )}
      </div>
    </section>
  )
}