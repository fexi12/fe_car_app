// next.config.mjs
/** @type {import('next').NextConfig} */
const BE_RAW = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

function normalizeBaseUrl(v) {
  if (!v) return "";
  const trimmed = v.replace(/\/+$/, "");          // drop trailing /
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

const BE = normalizeBaseUrl(BE_RAW);

export default {
  async rewrites() {
    if (!BE) {
      console.warn("BACKEND_URL / NEXT_PUBLIC_BACKEND_URL not set – no rewrites applied.");
      return [];
    }
    return [
      { source: "/api/:path*",     destination: `${BE}/api/:path*` },
      { source: "/uploads/:path*", destination: `${BE}/uploads/:path*` }, // optional: proxy images too
    ];
  },
};
