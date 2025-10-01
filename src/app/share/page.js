'use client'

import Image from "next/image";
import Link from 'next/link';

export default function SharePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-between px-6 py-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
        <Link href="/">
        <Image
          src="/logo/logowhite.png"
          alt="Cleope Logo"
          width={200}
          height={200}
          className=""
        />
        </Link>
        <h1 className="text-md font-bold uppercase tracking-widest">
          @CLEOPEHUB
        </h1>
        <p className="text-neutral-400 text-center text-sm max-w-md">
          An Entertainment Hub — Music, Fashion & Lifestyle.
        </p>
      </div>

      {/* Links */}
      <div className="flex flex-col gap-4 w-full max-w-sm mt-10">
        {[
          { label: "THE MERGE - Secret Party", link: "/themerge/11.10" },
          { label: "Book a Table", link: "/tables" },
          { label: "About The Hub", link: "/about" },
          { label: "Join Newsletter", link: "/newsletter" },
        ].map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            className="w-full text-center py-3 rounded-full bg-white text-black font-semibold uppercase tracking-widest hover:bg-neutral-200 transition cursor-pointer"
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Social + Footer */}
      <div className="flex flex-col items-center gap-6 mt-12">
        {/* Social Icons */}
        <div className="flex gap-6">
          <a
            href="https://instagram.com/cleope"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="20px" width="20px" viewBox="0 0 640 640"><path d="M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z"/></svg> 
          </a>
          <a
            href="https://tiktok.com/@cleope"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80"
          >
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="20px" width="20px" viewBox="0 0 640 640"><path d="M544.5 273.9C500.5 274 457.5 260.3 421.7 234.7L421.7 413.4C421.7 446.5 411.6 478.8 392.7 506C373.8 533.2 347.1 554 316.1 565.6C285.1 577.2 251.3 579.1 219.2 570.9C187.1 562.7 158.3 545 136.5 520.1C114.7 495.2 101.2 464.1 97.5 431.2C93.8 398.3 100.4 365.1 116.1 336C131.8 306.9 156.1 283.3 185.7 268.3C215.3 253.3 248.6 247.8 281.4 252.3L281.4 342.2C266.4 337.5 250.3 337.6 235.4 342.6C220.5 347.6 207.5 357.2 198.4 369.9C189.3 382.6 184.4 398 184.5 413.8C184.6 429.6 189.7 444.8 199 457.5C208.3 470.2 221.4 479.6 236.4 484.4C251.4 489.2 267.5 489.2 282.4 484.3C297.3 479.4 310.4 469.9 319.6 457.2C328.8 444.5 333.8 429.1 333.8 413.4L333.8 64L421.8 64C421.7 71.4 422.4 78.9 423.7 86.2C426.8 102.5 433.1 118.1 442.4 131.9C451.7 145.7 463.7 157.5 477.6 166.5C497.5 179.6 520.8 186.6 544.6 186.6L544.6 274z"/></svg>
          </a>
          <a
            href="mailto:cleope.events@gmail.com"
            className="hover:opacity-80"
          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="20px" width="20px" viewBox="0 0 640 640"><path d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z"/></svg>              </a>

        </div>

        {/* Share Button */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "CLEOPE HUB",
                text: "Check out CLEOPE HUB!",
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
            }
          }}
          className="w-full max-w-sm py-3 rounded-full bg-blue-600 text-white font-semibold uppercase tracking-widest hover:bg-blue-500 transition cursor-pointer"
        >
          Share This Page
        </button>

        {/* Footer */}
        <p className="text-neutral-500 text-xs text-center mt-8">
          © 2026 CLEOPE HUB — A Made in Italy Project.
        </p>
      </div>
    </main>
  );
}
