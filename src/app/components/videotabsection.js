'use client'

import { useState } from "react"

export default function VideoTabsSection() {
  // Rimosso il tipo TypeScript per farlo funzionare in .js
  const [activeTab, setActiveTab] = useState('live')

  return (
    <section className="max-w-7xl mx-auto mb-40">
      {/* SWITCHER TABS */}
      <div className="flex justify-center gap-6 md:gap-12 mb-12 border-b border-white/5">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-2 pb-4 uppercase tracking-[0.2em] text-[10px] transition-all cursor-pointer ${
              activeTab === 'live' ? "text-red-600 border-b-2 border-red-600" : "text-white hover:text-white"
            }`}
          
        >
          Experiences
        </button>
        <button
          onClick={() => setActiveTab('djsets')}
          className={`flex items-center gap-2 pb-4 uppercase tracking-[0.2em] text-[10px] transition-all cursor-pointer ${
              activeTab === 'djsets' ? "text-red-600 border-b-2 border-red-600" : "text-white hover:text-white"
            }`}
        >
          DJ Sets
        </button>
      </div>

      {/* CONTENUTO LIVE */}
      {activeTab === 'live' && (
        <div className="flex flex-wrap justify-center gap-8 animate-in fade-in duration-700">
          <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-2xl w-full max-w-[300px]">
            <div className="aspect-[9/16] overflow-hidden bg-black">
              <video className="w-full h-full object-cover" controls playsInline preload="metadata">
                <source src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/sound%2Fkosmi1.mp4?alt=media&token=28990f16-2616-4005-80e8-d169b9cb70b6" type="video/mp4" />
              </video>
            </div>
            <div className="p-5 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/5 text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-red-600 font-bold mb-1 italic">Live</p>
              <h5 className="text-[11px] uppercase tracking-[0.2em] text-white/70 italic">Live @HouseParty</h5>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-2xl w-full max-w-[300px]">
            <div className="aspect-[9/16] overflow-hidden bg-black">
              <video className="w-full h-full object-cover" controls playsInline preload="metadata">
                <source src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/sound%2Fkosmi2.mp4?alt=media&token=c17c9fcf-59ca-4b82-957a-6f4faef1fb32" type="video/mp4" />
              </video>
            </div>
            <div className="p-5 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/5 text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-red-600 font-bold mb-1 italic">Live</p>
              <h5 className="text-[11px] uppercase tracking-[0.2em] text-white/70 italic">Live @HouseParty</h5>
            </div>
          </div>
        </div>
      )}

      {/* CONTENUTO DJ SETS */}
      {activeTab === 'djsets' && (
        <div className="flex flex-wrap justify-center gap-8 animate-in fade-in duration-700">
          <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-2xl w-full max-w-[300px]">
            <div className="aspect-[9/16] overflow-hidden bg-black">
              <video className="w-full h-full object-cover" controls playsInline preload="metadata">
                <source src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/kosmi%2Fdjset%2F9153472407083279152.MP4?alt=media&token=2a4fb883-784a-430a-8be6-0dfcc0755f70" type="video/mp4" />
              </video>
            </div>
            <div className="p-5 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/5 text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-red-600 font-bold mb-1 italic">DJ Set</p>
              <h5 className="text-[11px] uppercase tracking-[0.2em] text-white/70 italic">VOLT Milano</h5>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-2xl w-full max-w-[300px]">
            <div className="aspect-[9/16] overflow-hidden bg-black">
              <video className="w-full h-full object-cover" controls playsInline preload="metadata">
                <source src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/kosmi%2Fdjset%2F564440575416043201.MP4?alt=media&token=343e969f-97a7-4b37-9530-b23b912e376a" type="video/mp4" />
              </video>
            </div>
            <div className="p-5 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/5 text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-red-600 font-bold mb-1 italic">DJ Set</p>
              <h5 className="text-[11px] uppercase tracking-[0.2em] text-white/70 italic">VOLT Milano</h5>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}