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
      // Redirect se il dominio è srevents.vercel.app
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "srevents.vercel.app",
          },
        ],
        destination: "/srevents/winter",
        permanent: true,
      },

      // Redirect solo dalla root di breakoutpeople.com
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "breakoutpeople.com",
          },
        ],
        destination: "/formats/breakout",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
