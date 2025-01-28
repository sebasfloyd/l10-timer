/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Permite cargar imágenes de estos dominios si usas <Image> de Next.js
  images: {
    domains: ['api.stripe.com', 'checkout.stripe.com'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            // Politica de seguridad que habilita scripts externos e inline, estilos y fuentes de Google
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' https://js.stripe.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' data: https://fonts.gstatic.com;
              connect-src 'self' https://api.stripe.com https://checkout.stripe.com;
              frame-src 'self' https://js.stripe.com https://checkout.stripe.com;
              object-src 'none';
            `.replace(/\s{2,}/g, ' '), // Compactar espacios
          },
          {
            // Si no requieres Permissions-Policy, déjalo vacío o elimínalo
            key: 'Permissions-Policy',
            value: '',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
