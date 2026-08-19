const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000';

export const apiRewrites = [
  {
    source: '/api/v1/:path*',
    destination: `${backendUrl}/api/v1/:path*`,
  },
];
