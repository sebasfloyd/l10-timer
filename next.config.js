/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Permite cargar imágenes de estos dominios
    domains: ['api.stripe.com', 'checkout.stripe.com'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            // CSP más completa para permitir fuentes, estilos y conexiones necesarias
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self';
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' data: https://fonts.gstatic.com;
              connect-src 'self' https://api.stripe.com https://checkout.stripe.com;
              object-src 'none';
            `.replace(/\s{2,}/g, ' '), // El .replace() compacta espacios y saltos
          },
          {
            // Permissions-Policy vacío, sin directivas experimentales
            key: 'Permissions-Policy',
            value: '',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
