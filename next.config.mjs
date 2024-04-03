

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    XANO_DB_URL: process.env.XANO_DB_URL,
  }
};

export default nextConfig;
