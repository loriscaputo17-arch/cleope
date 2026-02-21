"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSearchParams } from "next/navigation";

const RSVP_COLLECTION  = "the_merge_2_rsvp";
const TABLE_COLLECTION = "the_merge_2_tables";
const EVENT_DATE = new Date("2026-02-28T23:45:00");

export default function TheMergeII() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [progress, setProgress] = useState(0);

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("access");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [time, setTime] = useState({ d:0,h:0,m:0,s:0 });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [data, setData] = useState({
    fullName:"",
    email:"",
    phone:"",
    guests:"",
    notes:""
  });

  useEffect(() => {
      const interval = setInterval(() => {
        const diff = EVENT_DATE - new Date();
        if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }, 1000);
  
      return () => clearInterval(interval);
  }, []);

/* LOADING SCREEN WITH PERCENTAGE */
useEffect(() => {
  let value = 0;

  const interval = setInterval(() => {
    value += Math.floor(Math.random() * 6) + 3; // step irregolare
    if (value >= 100) {
      value = 100;
      clearInterval(interval);
      setTimeout(() => setLoading(false), 300);
    }
    setProgress(value);
  }, 120);

  return () => clearInterval(interval);
}, []);


  /* COUNTDOWN */
  useEffect(() => {
    const i = setInterval(() => {
      const diff = EVENT_DATE - new Date();
      if (diff <= 0) return;
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      });
    }, 1000);
    return () => clearInterval(i);
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSending(true);

    try {
      if (!data.email || !data.fullName) {
        setError("ACCESS DENIED");
        return;
      }

      await addDoc(
        collection(db, mode === "access" ? RSVP_COLLECTION : TABLE_COLLECTION),
        {
          ...data,
          q: q || null,
          createdAt: serverTimestamp(),
        }
      );

      await fetch("/api/themerge2_sendrequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: data.email,
          name: data.fullName,
        }),
      });

      setDone(true);
    } catch {
      setError("TRANSMISSION FAILED");
    } finally {
      setSending(false);
    }
  }

if (loading) {
  return (
    <main className="min-h-screen bg-[#ededed] flex flex-col items-center justify-center text-black">

      <p className="loading-text2 mb-6">
        INITIALIZING PRIVATE INTERFACE
      </p>

      <div className="loading-wrapper mb-4">
        <div
          className="loading-bar-inner"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="loading-percent">
        {progress}%
      </p>

      <p className="loading-text2 mt-6 opacity-50">
        ONE MERGE · ONE NIGHT
      </p>
    </main>
  );
}


  return (
    <main className="relative min-h-screen bg-[#ededed] text-black overflow-hidden">

      {/* SIDE LEFT */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-6 opacity-40 z-20">
        <div className="side-label">PRIVATE ACCESS</div>
        <div className="side-meta">
          <span>SYSTEM</span>
          <span>ONLINE</span>
        </div>
        <div className="side-countdown">
          <span>{time.d}D</span>
          <span>{time.h}H</span>
          <span>{time.m}M</span>
          <span>{time.s}S</span>
        </div>
      </div>

      {/* SIDE RIGHT */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-end gap-6 opacity-40 z-20">
        <div className="side-label">THE MERGE II</div>
        <div className="side-meta">
          <span>MFW · 26</span>
          <span>CONFIDENTIAL</span>
        </div>
        <div className="side-hash">
          #28·02·26<br />MILANO
        </div>
      </div>

      {/* GHOST */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="ghost-title">THE MERGE</h1>
      </div>

      {/* MAIN */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-12 max-w-3xl mx-auto">

        {/* TOP IMAGE */}
        <img
          src="/images/themerge2/header.png"
          alt="The Merge"
          className="md:w-[25vw] w-[75vw] mb-4 opacity-90"
        />
        <p className="micro mb-4">28 · 02 · 2026</p>

        {/* Countdown */}
        <div className="flex gap-4 mb-6">
          {["days", "hours", "minutes", "seconds"].map((unit, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-xl font-bold text-white-500 drop-shadow-[0_0_8px_#fff]">{timeLeft[unit]}</span>

              <span className="text-[6px] uppercase tracking-[0.25em] opacity-40 mt-0">
                {unit}
              </span>
            </div>
          ))}
        </div>

        {/* MODE */}
        <div className="flex gap-16 tabs mb-4 mt-2 font-bold cursor-pointer">
          <button onClick={()=>{setMode("access"); setDone(false)}} className={mode==="access"?"active":""}>
            RSVP
          </button>
          <button onClick={()=>{setMode("table"); setDone(false)}} className={mode==="table"?"active":""}>
            TABLES
          </button>
        </div>

        {!done ? (
          <form onSubmit={submit} className="glass-box max-w-md">

            <input
              className="glass-input"
              placeholder="Full name"
              onChange={e=>setData({...data,fullName:e.target.value})}
            />

            <input
              className="glass-input"
              placeholder="Email"
              required
              onChange={e=>setData({...data,email:e.target.value})}
            />

            <input
              className="glass-input"
              placeholder="Phone"
              onChange={e=>setData({...data,phone:e.target.value})}
            />

            {mode==="table" && (
              <>
                <input
                  className="glass-input"
                  placeholder="Guests"
                  onChange={e=>setData({...data,guests:e.target.value})}
                />
                <textarea
                  className="glass-input"
                  placeholder="Notes (optional)"
                  onChange={e=>setData({...data,notes:e.target.value})}
                />
              </>
            )}

            {!!error && <p className="error">{error}</p>}

            <button className="submit cursor-pointer" disabled={sending}>
              {sending ? "SENDING…" : "REQUEST"}
            </button>
          </form>
        ) : (
          <div className="glass-box">
            <p className="micro">REQUEST RECEIVED</p>
            <p className="text-sm opacity-50 mt-4">
              If approved, you will be contacted.
            </p>
          </div>
        )}

        <p className="footer">PRIVATE SYSTEM</p>

        {/* BOTTOM IMAGE */}
        <img
          src="/images/themerge2/footer.png"
          alt="Confidential"
          className="md:w-56 w-42 mt-4 mb-10"
        />
      </div>
    </main>
  );
}
