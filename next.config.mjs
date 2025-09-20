/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "www.google.com",
      "images.xceed.me",
      "www.ticketnation.it",
    ],
  },
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "srevents.vercel.app", // se arriva da questo dominio
          },
        ],
        destination: "/srevents/winter",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
