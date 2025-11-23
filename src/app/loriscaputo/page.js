"use client";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";

export default function Home() {
  const links = [
    { name: "Cleope Events", url: "https://cleopeofficial.com" },
    { name: "My Next Product? Text me in DM", url: "#" },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#f6f2eb] via-[#efe9dd] to-[#e6dfd2] text-neutral-800">
      {/* Animated background waves or floating shapes */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-[-20%] left-[-30%] w-[120vw] h-[120vh] bg-gradient-to-r from-[#e6dfd2]/40 via-[#f6f2eb]/30 to-transparent rounded-full blur-[200px]"
          animate={{ x: [0, 20, -20, 0], y: [0, 15, -15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Center card */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center space-y-4 max-w-sm w-full backdrop-blur-xl bg-white/50 border border-white/30 rounded-3xl p-8 shadow-[0_10px_50px_rgba(0,0,0,0.08)]">
          <motion.img
            src="https://media.licdn.com/dms/image/v2/C4D03AQEIL1-3_BVsdw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1631609024936?e=1763596800&v=beta&t=lyh2QNnkbyjgCZkp-DUqpYwpBywkhGRhpK5rlkQ-Irk"
            alt="Loris Caputo"
            className="w-24 h-24 rounded-full object-cover border border-white/60 shadow-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          <h1 className="text-2xl font-bold text-neutral-900">Loris Caputo</h1>
          <p className="text-sm text-neutral-600">PM @ AI Tech • Co-Founder @ Cleope</p>

          <div className="flex space-x-5 mt-4">
            <a href="https://www.instagram.com/loris_caputo/" target="_blank" className="hover:text-neutral-900 transition">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/in/loris-caputo/" target="_blank" className="hover:text-neutral-900 transition">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://www.tiktok.com/@loris_caputo?lang=en" className="hover:text-neutral-900 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="black" viewBox="0 0 640 640"><path d="M544.5 273.9C500.5 274 457.5 260.3 421.7 234.7L421.7 413.4C421.7 446.5 411.6 478.8 392.7 506C373.8 533.2 347.1 554 316.1 565.6C285.1 577.2 251.3 579.1 219.2 570.9C187.1 562.7 158.3 545 136.5 520.1C114.7 495.2 101.2 464.1 97.5 431.2C93.8 398.3 100.4 365.1 116.1 336C131.8 306.9 156.1 283.3 185.7 268.3C215.3 253.3 248.6 247.8 281.4 252.3L281.4 342.2C266.4 337.5 250.3 337.6 235.4 342.6C220.5 347.6 207.5 357.2 198.4 369.9C189.3 382.6 184.4 398 184.5 413.8C184.6 429.6 189.7 444.8 199 457.5C208.3 470.2 221.4 479.6 236.4 484.4C251.4 489.2 267.5 489.2 282.4 484.3C297.3 479.4 310.4 469.9 319.6 457.2C328.8 444.5 333.8 429.1 333.8 413.4L333.8 64L421.8 64C421.7 71.4 422.4 78.9 423.7 86.2C426.8 102.5 433.1 118.1 442.4 131.9C451.7 145.7 463.7 157.5 477.6 166.5C497.5 179.6 520.8 186.6 544.6 186.6L544.6 274z"/></svg>            
            </a>
            <a href="mailto:loriscaputo17@gmail.com" className="hover:text-neutral-900 transition">
              <Mail className="w-6 h-6" />
            </a>
            
          </div>

          <div className="flex flex-col w-full mt-6 space-y-3">
            {links.map((link, i) => (
              <motion.a
                key={i}
                href={link.url}
                target="_blank"
                className="w-full text-center py-4 rounded-xl bg-white/70 backdrop-blur-md border border-white/40 text-neutral-800 font-bold hover:bg-white/90 hover:shadow-[0_6px_30px_rgba(0,0,0,0.1)] transition-all"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 180 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>

      <footer className="absolute bottom-8 w-full text-center text-[11px] text-neutral-500 tracking-wide z-10">
        © {new Date().getFullYear()} Loris Caputo
      </footer>
    </div>
  );
}
