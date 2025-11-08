'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";

// Importiamo il font (stesso path che hai in layout.js)
const cyGroteskGrand = localFont({
  src: [
    {
      path: "../fonts/kobuzan-cy-grotesk-grand-dark.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-cy-grotesk-grand",
});

export const Footer = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(now);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      className={`${cyGroteskGrand.variable} font-[var(--font-cy-grotesk-grand)] bg-black text-white pt-24 pb-10 px-6`}
    >
      {/* Logo */}
      <div className="text-center mb-16">
        <Image
          src="/logo/logowhite.png"
          alt="Cleope Logo"
          width={300}
          height={300}
          className="mx-auto mb-4 opacity-90"
        />
        <p className="text-neutral-400 text-sm tracking-wide uppercase">
          Bringing together people, music, and moments — <strong>since 2024</strong>.
        </p>
      </div>

      {/* Content grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-12 text-sm">
        
        {/* 1️⃣ Social */}
        <div>
          <h4 className="text-md font-semibold uppercase mb-4 tracking-wide">
            Follow Us
          </h4>
          <div className="flex gap-4">
            <a href="https://instagram.com/cleopeofficial" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="26px" height="26px" viewBox="0 0 640 640"><path d="M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z"/></svg>
            </a>
            <a href="https://tiktok.com/@cleopeofficial" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="26px" height="26px" viewBox="0 0 640 640"><path d="M544.5 273.9C500.5 274 457.5 260.3 421.7 234.7L421.7 413.4C421.7 446.5 411.6 478.8 392.7 506C373.8 533.2 347.1 554 316.1 565.6C285.1 577.2 251.3 579.1 219.2 570.9C187.1 562.7 158.3 545 136.5 520.1C114.7 495.2 101.2 464.1 97.5 431.2C93.8 398.3 100.4 365.1 116.1 336C131.8 306.9 156.1 283.3 185.7 268.3C215.3 253.3 248.6 247.8 281.4 252.3L281.4 342.2C266.4 337.5 250.3 337.6 235.4 342.6C220.5 347.6 207.5 357.2 198.4 369.9C189.3 382.6 184.4 398 184.5 413.8C184.6 429.6 189.7 444.8 199 457.5C208.3 470.2 221.4 479.6 236.4 484.4C251.4 489.2 267.5 489.2 282.4 484.3C297.3 479.4 310.4 469.9 319.6 457.2C328.8 444.5 333.8 429.1 333.8 413.4L333.8 64L421.8 64C421.7 71.4 422.4 78.9 423.7 86.2C426.8 102.5 433.1 118.1 442.4 131.9C451.7 145.7 463.7 157.5 477.6 166.5C497.5 179.6 520.8 186.6 544.6 186.6L544.6 274z"/></svg>
            </a>
            <a href="mailto:cleope.events@gmail.com" className="hover:opacity-80 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="26px" height="26px" viewBox="0 0 640 640"><path d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z"/></svg>
            </a>
            <a href="https://wa.me/+393513895086" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="26px" height="26px" viewBox="0 0 640 640"><path d="M476.9 161.1C435 119.1 379.2 96 319.9 96C197.5 96 97.9 195.6 97.9 318C97.9 357.1 108.1 395.3 127.5 429L96 544L213.7 513.1C246.1 530.8 282.6 540.1 319.8 540.1L319.9 540.1C442.2 540.1 544 440.5 544 318.1C544 258.8 518.8 203.1 476.9 161.1zM319.9 502.7C286.7 502.7 254.2 493.8 225.9 477L219.2 473L149.4 491.3L168 423.2L163.6 416.2C145.1 386.8 135.4 352.9 135.4 318C135.4 216.3 218.2 133.5 320 133.5C369.3 133.5 415.6 152.7 450.4 187.6C485.2 222.5 506.6 268.8 506.5 318.1C506.5 419.9 421.6 502.7 319.9 502.7zM421.1 364.5C415.6 361.7 388.3 348.3 383.2 346.5C378.1 344.6 374.4 343.7 370.7 349.3C367 354.9 356.4 367.3 353.1 371.1C349.9 374.8 346.6 375.3 341.1 372.5C308.5 356.2 287.1 343.4 265.6 306.5C259.9 296.7 271.3 297.4 281.9 276.2C283.7 272.5 282.8 269.3 281.4 266.5C280 263.7 268.9 236.4 264.3 225.3C259.8 214.5 255.2 216 251.8 215.8C248.6 215.6 244.9 215.6 241.2 215.6C237.5 215.6 231.5 217 226.4 222.5C221.3 228.1 207 241.5 207 268.8C207 296.1 226.9 322.5 229.6 326.2C232.4 329.9 268.7 385.9 324.4 410C359.6 425.2 373.4 426.5 391 423.9C401.7 422.3 423.8 410.5 428.4 397.5C433 384.5 433 373.4 431.6 371.1C430.3 368.6 426.6 367.2 421.1 364.5z"/></svg>
            </a>
            <a href="https://t.me/houseofcleope" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="26px" height="26px" viewBox="0 0 640 640"><path d="M320 72C183 72 72 183 72 320C72 457 183 568 320 568C457 568 568 457 568 320C568 183 457 72 320 72zM435 240.7C431.3 279.9 415.1 375.1 406.9 419C403.4 437.6 396.6 443.8 390 444.4C375.6 445.7 364.7 434.9 350.7 425.7C328.9 411.4 316.5 402.5 295.4 388.5C270.9 372.4 286.8 363.5 300.7 349C304.4 345.2 367.8 287.5 369 282.3C369.2 281.6 369.3 279.2 367.8 277.9C366.3 276.6 364.2 277.1 362.7 277.4C360.5 277.9 325.6 300.9 258.1 346.5C248.2 353.3 239.2 356.6 231.2 356.4C222.3 356.2 205.3 351.4 192.6 347.3C177.1 342.3 164.7 339.6 165.8 331C166.4 326.5 172.5 322 184.2 317.3C256.5 285.8 304.7 265 328.8 255C397.7 226.4 412 221.4 421.3 221.2C423.4 221.2 427.9 221.7 430.9 224.1C432.9 225.8 434.1 228.2 434.4 230.8C434.9 234 435 237.3 434.8 240.6z"/></svg>  
            </a>
          </div>
        </div>

        {/* 2️⃣ Pages */}
        <div>
          <h4 className="text-md font-bold uppercase mb-4 tracking-wide">
            Explore
          </h4>
          <ul className="flex flex-col gap-2 text-neutral-400">
            <li><Link href="/" className="hover:text-white transition uppercase text-xs">Home</Link></li>
            <li><Link href="/nextevents" className="hover:text-white transition uppercase text-xs">Events</Link></li>
            <li><Link href="/about" className="hover:text-white transition uppercase text-xs">The Hub</Link></li>
            <li><Link href="/tables" className="hover:text-white transition uppercase text-xs">Tables</Link></li>
            <li><Link href="/contact" className="hover:text-white transition uppercase text-xs">Contact</Link></li>
          </ul>
        </div>

        {/* 3️⃣ Contact */}
        <div>
          <h4 className="text-md font-bold uppercase mb-4 tracking-wide">
            Contact
          </h4>
          <ul className="flex flex-col gap-2 text-neutral-400 text-xs">
            <li className="flex items-center gap-2"><span className="text-white font-bold ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="20px" height="20px" viewBox="0 0 640 640"><path d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z"/></svg>
              </span> cleope.events@gmail.com</li>
            <li className="flex items-center gap-2"><span className="text-white font-bold ">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="white" width="20px" height="20px" ><path d="M224.2 89C216.3 70.1 195.7 60.1 176.1 65.4L170.6 66.9C106 84.5 50.8 147.1 66.9 223.3C104 398.3 241.7 536 416.7 573.1C493 589.3 555.5 534 573.1 469.4L574.6 463.9C580 444.2 569.9 423.6 551.1 415.8L453.8 375.3C437.3 368.4 418.2 373.2 406.8 387.1L368.2 434.3C297.9 399.4 241.3 341 208.8 269.3L253 233.3C266.9 222 271.6 202.9 264.8 186.3L224.2 89z"/></svg>
              </span> +39 351 389 5086</li>
            <li className="flex items-center gap-2"><span className="text-white font-bold ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="20px" height="20px" viewBox="0 0 640 640"><path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z"/></svg>
              </span> Milano, Italy 🇮🇹</li>
            <li className="mt-2 text-neutral-500">Local time: {time}</li>
          </ul>
        </div>

        {/* 4️⃣ Newsletter */}
        <div>
          <h4 className="text-md font-semibold uppercase mb-4 tracking-wide">
            Join Our Community
          </h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing!");
            }}
            className="flex flex-col gap-3"
          >
            <input
              type="email"
              placeholder="Your email"
              required
              className="bg-white/10 border border-white/10 text-white px-4 py-2 rounded-full text-sm focus:outline-none focus:border-white placeholder-neutral-400"
            />
            <button
              type="submit"
              className=" cursor-pointer bg-white text-black rounded-full px-5 py-2 text-sm font-semibold hover:bg-neutral-200 transition inline-flex items-center justify-center gap-2"
            >
              Subscribe
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" viewBox="0 0 640 640">
                <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288H96c-17.7 0-32 14.3-32 32s14.3 32 32 32h370.7L361.3 457.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-16 border-t border-white/10 pt-6 text-center text-[12px] text-neutral-500 uppercase tracking-wider">
        <p>&copy; 2026 <strong>CLEOPE HUB</strong> — Made with ❤️ in Italy.</p>
        <p className="mt-1 text-neutral-600">
          All rights reserved • Privacy Policy • Terms of Service
        </p>
      </div>
    </footer>
  );
};
