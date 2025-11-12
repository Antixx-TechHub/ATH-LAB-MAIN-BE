/** @type {import('next').NextConfig} */
const nextConfig = {};

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
  console.error(err.stack);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🔥 Unhandled Rejection:", reason);
});

export default nextConfig;

// module.exports = {
//   experimental: {
//     esmExternals: true, // Enable ESM external support
//   },
// };

