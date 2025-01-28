/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.stripe.com https://checkout.stripe.com;"
          },
          {
            key: 'Permissions-Policy',
            value: 'browsing-topics=(), private-state-token-redemption=(), private-state-token-issuance=()'
          }
        ],
      },
    ]
  },
  reactStrictMode: true,
  images: {
    domains: ['api.stripe.com', 'checkout.stripe.com'],
  }
}