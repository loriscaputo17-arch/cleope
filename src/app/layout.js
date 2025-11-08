import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import Script from "next/script";
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cyGroteskGrand = localFont({
  src: [
    {
      path: "./fonts/kobuzan-cy-grotesk-grand-dark.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-cy-grotesk-grand",
});


export const metadata = {
  title: "Access List Platform",
  description: "Access List Platform.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-57VJGES842', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>

      <body
        className={`${cyGroteskGrand.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
