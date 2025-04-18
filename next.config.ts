import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["www.tta.or.kr"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "211.253.241.175",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "14.34.53.218",
        port: "47102",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/api/:path*",
        destination:
          (process.env.NEXT_PUBLIC_BASE_URL || "http://211.253.241.27:8080") +
          "/api/:path*", // 환경 변수 사용
        permanent: false, // true이면 308 상태코드, false이면 307 상태코드
      },
    ];
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/v1/cnsut/web-editor/image/:path*',
  //       destination: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://211.253.241.27:8090'}/api/v1/cnsut/web-editor/image/:path*`,
  //     },
  //   ];
  // },
};

export default nextConfig;
