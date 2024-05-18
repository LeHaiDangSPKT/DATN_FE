/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "static.vecteezy.com",
      "static-00.iconduck.com",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "cdn.chotot.com",
      "salt.tikicdn.com",
    ],
  },
};

module.exports = nextConfig;
