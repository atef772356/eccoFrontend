/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "calm-bear-54de635d94.media.strapiapp.com",
      },
    ],
  },
};

export default nextConfig;
