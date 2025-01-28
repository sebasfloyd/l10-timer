// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Aplicar estas cabeceras a todas las rutas
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' https://js.stripe.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' data: https://fonts.gstatic.com;
              connect-src 'self' https://api.stripe.com https://checkout.stripe.com;
              frame-src 'self' https://js.stripe.com https://checkout.stripe.com;
              media-src 'self' data:; /* Añadido para permitir media desde data: URIs */
              object-src 'none';
              upgrade-insecure-requests;
              report-uri https://q.stripe.com/csp-violation;
            `.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'Permissions-Policy',
            value: `
              camera=(),
              microphone=(),
              geolocation=()
            `.replace(/\s{2,}/g, ' ').trim(),
          },
          // Otras cabeceras de seguridad si las tienes
        ],
      },
    ];
  },
};

module.exports = nextConfig;
