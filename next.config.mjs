// next.config.mjs
export default {
  async rewrites() {
    const backend = process.env.BACKEND_URL; // e.g., http://localhost:5000
    return backend
      ? [{ source: "/api/:path*", destination: `${backend}/api/:path*` }]
      : [];
  },
};
