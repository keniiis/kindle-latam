import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // La herramienta web se retiró: los enlaces viejos van a la página principal.
    return [{ source: "/app", destination: "/", permanent: true }];
  },
};

export default nextConfig;
