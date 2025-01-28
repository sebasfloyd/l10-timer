/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Dominios que Next.js permitirá para cargar imágenes
    domains: ['api.stripe.com', 'checkout.stripe.com'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            // Ajusta tu CSP según tus necesidades (ej. script-src, frame-src, etc.)
            key: 'Content-Security-Policy',
            value:
              "font-src 'self' data: https://fonts.gstatic.com; " +
              "connect-src 'self' https://api.stripe.com https://checkout.stripe.com;"
          },
          {
            // Eliminamos directivas experimentales que causaban warnings
            key: 'Permissions-Policy',
            // Si no requieres ninguna directiva concreta, puedes dejarlo vacío o eliminarlo
            value: ''
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;
