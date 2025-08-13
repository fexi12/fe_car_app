/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backend = process.env.BACKEND_URL; // ex: http://127.0.0.1:5000
    return backend ? [
      { source: "/api/:path*", destination: `${backend}/:path*` }
    ] : [];
  }
};
export default nextConfig;
