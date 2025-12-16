/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'nonce-{nonce}'; style-src 'self' 'nonce-{nonce}' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=()'
  }
];

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Ensure eval() is not used in the build
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      use: {
        loader: 'string-replace-loader',
        options: {
          search: /eval\s*\(/g,
          replace: '/* eval() is blocked for security reasons */',
          flags: 'g'
        }
      }
    });

    return config;
  }
};

module.exports = nextConfig;
