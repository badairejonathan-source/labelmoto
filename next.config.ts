import type {NextConfig} from 'next';
const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.cloudworkstations.dev", "*.cluster-nle52mxuvfhlkrzyrq6g2cwb52.cloudworkstations.dev"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Désactive le header X-Powered-By (sécurité + légèreté)
  poweredByHeader: false,
  // Compression gzip activée
  compress: true,
  // Tree-shaking optimisé pour les grosses librairies
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      'firebase',
    ],
  },
  async headers() {
    return [
      // Cache long sur assets statiques Next.js
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache sur images publiques
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      // Cache GeoJSON
      {
        source: '/departements.geojson',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      // Sécurité headers sur toutes les pages
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'https', hostname: '**.googleusercontent.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '**.googleapis.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '**.google.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '**.gstatic.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '**.fbcdn.net', port: '', pathname: '/**' },
    ],
  },
};
export default nextConfig;
