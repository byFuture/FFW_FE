import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FFW 포럼포러워치",
  description: "FFW 포럼포러워치 포털",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-gov-dynamic-subset.min.css"
        />
      </head>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
